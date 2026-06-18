import { NavLink, useNavigate } from 'react-router-dom'
import { ClipboardList, User, LogOut, LayoutGrid } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/',        label: 'Catálogo',    icon: LayoutGrid,    end: true },
  { to: '/history', label: 'Mis Pedidos', icon: ClipboardList },
  { to: '/profile', label: 'Mi Perfil',   icon: User },
]

export default function SidebarCliente() {
  const { logout, currentUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = currentUser?.nombre
    ? currentUser.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">O</div>
        <span className="sidebar-logo-text">OrderFlow</span>
      </div>

      {/* User info */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar" style={{ width: 38, height: 38, fontSize: '0.85rem' }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              {currentUser?.nombre || 'Cliente'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {currentUser?.correo || ''}
            </div>
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
