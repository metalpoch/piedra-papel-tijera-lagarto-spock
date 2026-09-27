# PPTLS — Piedra, Papel, Tijera, Lagarto, Spock

Aplicación fullstack del clásico juego *Piedra, Papel, Tijera, Lagarto, Spock*.
El usuario se registra o inicia sesión, juega contra la computadora y puede ver
sus estadísticas y el historial de partidas. Cada jugada queda guardada en
PostgreSQL.

- **Backend**: Flask + Flask-SQLAlchemy + PostgreSQL, API REST JSON con autenticación por token (Bearer).
- **Frontend**: React 19 + Vite, consume la API mediante `fetch`.
- **Base de datos**: PostgreSQL (por ejemplo Neon), las tablas se crean solas al arrancar (`db.create_all()`).

## Reglas del juego

Cada jugada es uno contra uno. Una opción gana a dos de las otras cuatro:

| Opción   | Vence a          |
|----------|------------------|
| rock     | scissors, lizard |
| paper    | rock, spock      |
| scissors | paper, lizard    |
| lizard   | spock, paper     |
| spock    | scissors, rock   |

Si ambas opciones son iguales, es empate.

## Estructura de carpetas

```
pptls/
├── app.py                  # Backend Flask completo (app, modelos y endpoints)
├── requirements.txt        # Dependencias de Python
├── .env                    # Variables de entorno del backend (no versionado)
├── frontend/               # Aplicación React + Vite
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js      # Proxy de /api -> http://localhost:5000 en dev
│   ├── .env.example        # Plantilla de variables del frontend
│   ├── public/             # favicon.svg, icons.svg
│   └── src/
│       ├── main.jsx        # Punto de entrada de React
│       ├── App.jsx         # Decide entre Auth y Game según la sesión
│       ├── index.css       # Estilos globales
│       ├── App.css
│       ├── utils/
│       │   └── api.js      # Cliente fetch, manejo del token en localStorage
│       └── components/
│           ├── Auth.jsx    # Formulario de login / registro
│           ├── Game.jsx    # Vista principal del juego
│           └── game/
│               ├── Header.jsx   # Cabecera con usuario y logout
│               ├── Stats.jsx    # Totales: partidas, ganadas, perdidas, empates
│               ├── Choices.jsx  # Botones de las 5 jugadas
│               ├── Match.jsx    # Resultado de la partida actual
│               └── History.jsx  # Últimas partidas
└── .opencode/              # Configuración local del asistente (no versionado)
```

## API

Todas las respuestas son JSON. Los endpoints protegidos requieren la cabecera
`Authorization: Bearer <token>`.

| Método | Ruta                  | Auth | Descripción                                  |
|--------|-----------------------|------|----------------------------------------------|
| GET    | `/`                   | No   | Información de la API y listado de endpoints |
| POST   | `/api/auth/register`  | No   | Registro (`username`, `email`, `password`)   |
| POST   | `/api/auth/login`     | No   | Login (`username` o `email` + `password`)    |
| GET    | `/api/auth/me`        | Sí   | Datos del usuario autenticado                |
| POST   | `/api/game/play`      | Sí   | Jugar una ronda (`choice`)                   |
| GET    | `/api/game/history`   | Sí   | Historial (`?limit=`, máx. 100)              |
| GET    | `/api/game/stats`     | Sí   | Totales de partidas, victorias, derrotas y empates |

## Variables de entorno

### Backend — archivo `.env` en la raíz

| Variable        | Descripción                                                                 | Ejemplo / defecto                        |
|-----------------|-----------------------------------------------------------------------------|------------------------------------------|
| `DB_URI`        | Cadena de conexión a PostgreSQL. `postgresql://` se convierte a `postgresql+psycopg://`. | `postgresql://usuario:pass@host/db`      |
| `SECRET_KEY`    | Clave para firmar los tokens de sesión. Cámbiala en producción.             | `dev-secret-change-me`                   |
| `HOST`          | Interfaz donde escucha Flask.                                               | `127.0.0.1`                              |
| `PORT`          | Puerto del backend.                                                         | `5000`                                   |
| `FLASK_DEBUG`   | Modo debug (`true`/`false`).                                                | `false`                                  |
| `CORS_ORIGINS`  | Orígenes permitidos, separados por coma, o `*`. Déjalo vacío/`*` para desarrollo. | `*` o `https://pptls-front.example.com` |

### Frontend — archivo `frontend/.env`

Copia `frontend/.env.example` a `frontend/.env`.

| Variable       | Descripción                                                                                   | Ejemplo / defecto |
|----------------|-----------------------------------------------------------------------------------------------|-------------------|
| `VITE_API_URL` | URL pública del backend, sin barra final. Vacío = mismo origen (proxy `/api` del reverse proxy). | `https://pptls-api.example.com` |

> El frontend y el backend pueden desplegarse en equipos/dominios distintos; en
> ese caso ajusta `VITE_API_URL` y `CORS_ORIGINS` en consecuencia.

## Puesta en marcha

### Backend

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# crea el archivo .env con las variables de la tabla anterior
python app.py
```

### Frontend

```bash
cd frontend
npm install       # o: pnpm install
npm run dev
```

En desarrollo, Vite sirve el frontend y redirige `/api` a `http://localhost:5000`
(ver `frontend/vite.config.js`). Para compilar para producción: `npm run build`
y para lint: `npm run lint`.
