import os
import random
from datetime import datetime, timezone
from functools import wraps
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from werkzeug.security import check_password_hash, generate_password_hash

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

DB_URI = os.environ.get("DB_URI", "")
if DB_URI.startswith("postgresql://"):
    DB_URI = DB_URI.replace("postgresql://", "postgresql+psycopg://", 1)

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-change-me")
app.config["SQLALCHEMY_DATABASE_URI"] = DB_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"pool_pre_ping": True}

CORS_ORIGINS = [o.strip() for o in os.environ.get("CORS_ORIGINS", "*").split(",") if o.strip()]
CORS(app, resources={r"/api/*": {"origins": CORS_ORIGINS}})

db = SQLAlchemy(app)
serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"], salt="auth-token")
TOKEN_MAX_AGE = 60 * 60 * 24 * 7


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    matches = db.relationship("Match", backref="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {"id": self.id, "username": self.username, "email": self.email}


class Match(db.Model):
    __tablename__ = "matches"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    player_choice = db.Column(db.String(20), nullable=False)
    computer_choice = db.Column(db.String(20), nullable=False)
    result = db.Column(db.String(10), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "player_choice": self.player_choice,
            "computer_choice": self.computer_choice,
            "result": self.result,
            "created_at": self.created_at.isoformat(),
        }


CHOICES = ["rock", "paper", "scissors", "lizard", "spock"]
BEATS = {
    "rock": ["scissors", "lizard"],
    "paper": ["rock", "spock"],
    "scissors": ["paper", "lizard"],
    "lizard": ["spock", "paper"],
    "spock": ["scissors", "rock"],
}
EMOJI = {
    "rock": "\U0001FAA8",
    "paper": "\U0001F4C4",
    "scissors": "\u2702\uFE0F",
    "lizard": "\U0001F98E",
    "spock": "\U0001F596",
}


def json_error(message, status):
    return jsonify({"ok": False, "error": message}), status


def make_token(user):
    return serializer.dumps({"uid": user.id})


def auth_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return json_error("Missing or invalid token", 401)
        token = header[7:]
        try:
            data = serializer.loads(token, max_age=TOKEN_MAX_AGE)
        except SignatureExpired:
            return json_error("Token expired", 401)
        except BadSignature:
            return json_error("Invalid token", 401)
        user = db.session.get(User, data.get("uid"))
        if user is None:
            return json_error("User not found", 401)
        g.user = user
        return fn(*args, **kwargs)

    return wrapper


@app.get("/")
def index():
    return jsonify({"name": "PPTLS API", "choices": CHOICES, "docs": {
        "register": "POST /api/auth/register",
        "login": "POST /api/auth/login",
        "me": "GET /api/auth/me",
        "play": "POST /api/game/play",
        "history": "GET /api/game/history",
        "stats": "GET /api/game/stats",
    }})


@app.post("/api/auth/register")
def register():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not username or not email or not password:
        return json_error("username, email and password are required", 400)
    if len(username) < 3:
        return json_error("username must be at least 3 characters", 400)
    if len(password) < 6:
        return json_error("password must be at least 6 characters", 400)
    if "@" not in email:
        return json_error("invalid email", 400)
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return json_error("username or email already registered", 409)

    user = User(username=username, email=email, password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()
    return jsonify({"ok": True, "token": make_token(user), "user": user.to_dict()}), 201


@app.post("/api/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    identifier = (data.get("username") or data.get("email") or "").strip()
    password = data.get("password") or ""

    if not identifier or not password:
        return json_error("credentials are required", 400)

    user = User.query.filter(
        (User.username == identifier) | (User.email == identifier.lower())
    ).first()
    if user is None or not check_password_hash(user.password_hash, password):
        return json_error("invalid credentials", 401)

    return jsonify({"ok": True, "token": make_token(user), "user": user.to_dict()})


@app.get("/api/auth/me")
@auth_required
def me():
    return jsonify({"ok": True, "user": g.user.to_dict()})


@app.post("/api/game/play")
@auth_required
def play():
    data = request.get_json(silent=True) or {}
    player = (data.get("choice") or "").strip().lower()

    if player not in CHOICES:
        return json_error(f"choice must be one of {CHOICES}", 400)

    computer = random.choice(CHOICES)
    if player == computer:
        result = "draw"
    elif computer in BEATS[player]:
        result = "win"
    else:
        result = "lose"

    match = Match(
        user_id=g.user.id,
        player_choice=player,
        computer_choice=computer,
        result=result,
    )
    db.session.add(match)
    db.session.commit()

    return jsonify({
        "ok": True,
        "match": match.to_dict(),
        "player_emoji": EMOJI[player],
        "computer_emoji": EMOJI[computer],
    })


@app.get("/api/game/history")
@auth_required
def history():
    limit = min(request.args.get("limit", 20, type=int), 100)
    matches = (
        Match.query.filter_by(user_id=g.user.id)
        .order_by(Match.created_at.desc())
        .limit(limit)
        .all()
    )
    return jsonify({"ok": True, "matches": [m.to_dict() for m in matches]})


@app.get("/api/game/stats")
@auth_required
def stats():
    total = Match.query.filter_by(user_id=g.user.id).count()
    wins = Match.query.filter_by(user_id=g.user.id, result="win").count()
    losses = Match.query.filter_by(user_id=g.user.id, result="lose").count()
    draws = Match.query.filter_by(user_id=g.user.id, result="draw").count()
    return jsonify({"ok": True, "stats": {
        "total": total, "wins": wins, "losses": losses, "draws": draws,
    }})


@app.errorhandler(404)
def not_found(_):
    return json_error("not found", 404)


@app.errorhandler(405)
def method_not_allowed(_):
    return json_error("method not allowed", 405)


@app.errorhandler(Exception)
def handle_exception(err):
    if isinstance(err, SystemExit):
        raise err
    return json_error("internal server error", 500)


with app.app_context():
    db.create_all()


if __name__ == "__main__":
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(host=host, port=port, debug=debug)
