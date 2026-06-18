import { useNavigate } from "react-router-dom";

function BoxLogo({ className = "" }) {
  return <span className={`box-logo ${className}`}>⬢</span>;
}

export function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 11 8-7 8 7" />
      <path d="M6.5 10.5V20h11v-9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function CubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5 5 7.3l7 3.9 7-3.9-7-3.8Z" />
      <path d="M5 7.3v8.1l7 4.1v-8.3" />
      <path d="M19 7.3v8.1l-7 4.1" />
      <path d="m8.4 5.55 7.05 3.9" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

export function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-label="Carrito">
      <path d="M4 5h2l1.7 9.1a1.6 1.6 0 0 0 1.6 1.3h7.5a1.6 1.6 0 0 0 1.55-1.2L20 8.5H7" />
      <path d="M10 20h.01" />
      <path d="M17 20h.01" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10" />
      <path d="M14 8 18 12l-4 4" />
      <path d="M18 12H9" />
    </svg>
  );
}

function NavButton({ active, children, icon, onClick }) {
  return (
    <button className={active ? "active" : ""} type="button" onClick={onClick}>
      {icon}
      {children}
    </button>
  );
}

function OrderFlowLayout({ activeModule, cartCount = 54, children }) {
  const navigate = useNavigate();

  return (
    <main className="catalog-app">
      <aside className="sidebar">
        <div className="brand">
          <BoxLogo className="brand-logo" />
          <span>OrderFlow</span>
        </div>

        <nav className="side-nav">
          <NavButton
            active={activeModule === "catalogo"}
            icon={<HomeIcon />}
            onClick={() => navigate("/catalogo")}
          >
            Catálogo
          </NavButton>

          <NavButton
            active={activeModule === "pedidos"}
            icon={<CubeIcon />}
            onClick={() => navigate("/history")}
          >
            Mis Pedidos
          </NavButton>

          <NavButton
            active={activeModule === "perfil"}
            icon={<UserIcon />}
            onClick={() => navigate("/profile")}
          >
            Mi Perfil
          </NavButton>
        </nav>

        <button
          className="logout-button"
          type="button"
          onClick={() => navigate("/login")}
        >
          <LogoutIcon />
          Cerrar Sesión
        </button>
      </aside>

      <section className="catalog-main">
        <header className="topbar">
          <label className="search-box">
            <input type="search" placeholder="Buscar productos..." />
          </label>

          <div className="user-actions">
            <button
  className="cart-button has-items"
  type="button"
  onClick={() => window.location.href = "/carrito"}
>
  <CartIcon />
  <span className="cart-count">{cartCount}</span>
</button>

            <button
              className="user-pill"
              type="button"
              onClick={() => navigate("/profile")}
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                alt="María"
              />
              María
            </button>
          </div>
        </header>

        {children}
      </section>
    </main>
  );
}

export default OrderFlowLayout;