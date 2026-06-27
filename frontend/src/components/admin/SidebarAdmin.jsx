import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Users, Package, BarChart2, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/admin',            label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/admin/pedidos',    label: 'Pedidos',     icon: ClipboardList },
  { to: '/admin/clientes',   label: 'Clientes',    icon: Users },
  { to: '/admin/inventario', label: 'Inventario',  icon: Package },
  { to: '/admin/reportes',   label: 'Reportes',    icon: BarChart2 },
]

export default function SidebarAdmin({ isOpen = false, onClose }) {
  const { logout, currentUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const initials = currentUser?.nombre
    ? currentUser.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A'

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">O</div>
        <div>
          <span className="sidebar-logo-text">OrderFlow</span>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Vendedor</div>
        </div>
      </div>

      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar" style={{ width: 38, height: 38, fontSize: '0.85rem', background: 'var(--primary-700)', color: 'white' }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{currentUser?.nombre || 'Vendedor'}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Vendedor</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
