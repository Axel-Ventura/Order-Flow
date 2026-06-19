import { useAuth } from '../../context/AuthContext'

export default function HeaderAdmin({ title, subtitle }) {
  const { currentUser } = useAuth()
  const initials = currentUser?.nombre
    ? currentUser.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A'

  return (
    <header className="main-header">
      <div>
        {title && <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{title}</h2>}
        {subtitle && <p style={{ fontSize: '0.8rem', margin: 0, marginTop: 1 }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="avatar" style={{ background: 'var(--primary-700)', color: 'white', fontSize: '0.8rem' }}>
          {initials}
        </div>
      </div>
    </header>
  )
}
