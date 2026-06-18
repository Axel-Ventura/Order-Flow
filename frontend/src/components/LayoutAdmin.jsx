import { Link, useLocation } from "react-router-dom";
import {
  Zap,
  LayoutDashboard,
  ShoppingCart,
  Box,
  Users,
  History,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";

function LayoutAdmin({ children }) {
  const location = useLocation();

  const itemClass = (path) =>
    location.pathname === path ? "admin-menu-item admin-active" : "admin-menu-item";

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <Zap size={24} />
          </div>
          <div>
            <h2>OrderFlow</h2>
            <p>Panel Administrativo</p>
          </div>
        </div>

        <nav className="admin-menu">
          <Link to="/admin/dashboard" className={itemClass("/admin/dashboard")}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>

          <Link to="/admin/pedidos" className={itemClass("/admin/pedidos")}>
            <ShoppingCart size={20} /> Pedidos
            <span className="admin-badge">2</span>
          </Link>

          <Link to="/admin/inventario" className={itemClass("/admin/inventario")}>
            <Box size={20} /> Inventario
          </Link>

          <Link to="/admin/clientes" className={itemClass("/admin/clientes")}>
            <Users size={20} /> Clientes
          </Link>

          <Link to="/admin/historial" className={itemClass("/admin/historial")}>
            <History size={20} /> Historial
          </Link>

          <Link to="/admin/configuracion" className={itemClass("/admin/configuracion")}>
            <Settings size={20} /> Configuración
          </Link>

          <Link to="/admin/perfil" className={itemClass("/admin/perfil")}>
            <UserCircle size={20} /> Perfil
          </Link>
        </nav>

        <Link to="/login" className="admin-logout">
  <LogOut size={20} /> Cerrar Sesión
</Link>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}

export default LayoutAdmin;