function Header({ username, onLogout }) {
  return (
    <header className="topbar">
      <span>
        Hola, <strong>{username}</strong>
      </span>
      <button type="button" className="ghost" onClick={onLogout}>
        Salir
      </button>
    </header>
  );
}

export default Header;
