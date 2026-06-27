import { Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function HeaderAdmin({ title, subtitle, onMenuToggle }) {
  const { currentUser } = useAuth()
  const initials = currentUser?.nombre
    ? currentUser.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A'

  return (
    <header className="main-header">
      {/* Hamburger — visible sólo en móvil via CSS */}
      <button
        className="hamburger-btn"
        onClick={onMenuToggle}
        aria-label="Abrir menú"
      >
        <Menu size={22} />
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </h2>
        )}
        {subtitle && (
          <p style={{ fontSize: '0.8rem', margin: 0, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div className="avatar" style={{ background: 'var(--primary-700)', color: 'white', fontSize: '0.8rem' }}>
          {initials}
        </div>
      </div>
    </header>
  )
}

