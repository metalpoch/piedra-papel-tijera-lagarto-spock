import { useState } from "react";
import { setToken, api } from "../utils/api";

function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (e) => {
    console.log(e);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const path = mode === "login" ? "/api/auth/login" : "/api/auth/register";

      const body =
        mode === "login"
          ? { username: form.username, password: form.password }
          : form;

      const data = await api(path, { method: "POST", body });
      setToken(data.token);
      onAuth(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Bazinga!</h1>
      <p className="subtitle">Piedra, papel, tijera, lagarto, Spock</p>
      <div className="tabs">
        <button
          type="button"
          className={mode === "login" ? "active" : ""}
          onClick={() => setMode("login")}
        >
          Iniciar sesion
        </button>
        <button
          type="button"
          className={mode === "register" ? "active" : ""}
          onClick={() => setMode("register")}
        >
          Registrarse
        </button>
      </div>
      <form onSubmit={submit}>
        <input
          name="username"
          placeholder={mode === "login" ? "Usuario o email" : "Usuario"}
          value={form.username}
          onChange={update}
          required
        />

        {mode === "register" && (
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={update}
            required
          />
        )}

        <input
          name="password"
          type="password"
          placeholder="Contrasena"
          value={form.password}
          onChange={update}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="primary" disabled={loading}>
          {loading
            ? "Cargando..."
            : mode === "login"
              ? "Entrar"
              : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}

export default Auth;
