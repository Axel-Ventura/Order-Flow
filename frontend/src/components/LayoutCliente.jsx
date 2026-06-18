import { Link, useLocation } from "react-router-dom";
import { Box, Home, User, LogOut, ShoppingCart } from "lucide-react";

function LayoutCliente({ children, totalProductos = 0 }) {
  const location = useLocation();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Box size={24} /></div>
          <h2>OrderFlow</h2>
        </div>

        <nav className="menu">
          <Link className={location.pathname === "/catalogo" ? "active" : ""} to="/catalogo">
            <Home size={21} /> Catálogo
          </Link>

          <Link className={location.pathname === "/history" ? "active" : ""} to="/history">
            <Box size={21} /> Mis Pedidos
          </Link>

          <Link className={location.pathname === "/profile" ? "active" : ""} to="/profile">
            <User size={21} /> Mi Perfil
          </Link>
        </nav>

        <Link className="logout" to="/login">
          <LogOut size={21} /> Cerrar Sesión
        </Link>
      </aside>

      <main className="main">
        <header className="topbar">
          <input className="search" placeholder="Buscar productos..." />

          <div className="user-area">
           <Link to="/pedido" className="cart-wrap">
  <ShoppingCart size={23} />
  <span className="cart-badge">{totalProductos}</span>
</Link>

            <div className="avatar"></div>
            <span>María</span>
          </div>
        </header>

        <section className="content">{children}</section>
      </main>
    </div>
  );
}

export default LayoutCliente;