import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Save, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function PerfilCliente() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const [editando, setEditando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [form, setForm] = useState({
    nombre:    currentUser?.nombre    || '',
    correo:    currentUser?.correo    || '',
    telefono:  currentUser?.telefono  || '',
    direccion: currentUser?.direccion || '',
  })

  const initials = form.nombre
    ? form.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleGuardar = (e) => {
    e.preventDefault()
    setEditando(false)
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2500)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mi Perfil</h1>
          <p className="page-subtitle">Administra tu información personal</p>
        </div>
      </div>

      <div style={{ maxWidth: 600 }}>
        {/* Avatar */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div className="avatar avatar-xl" style={{ fontSize: '1.8rem', flexShrink: 0 }}>
              {initials}
            </div>
            <div>
              <h3 style={{ marginBottom: 4 }}>{form.nombre || 'Sin nombre'}</h3>
              <p style={{ fontSize: '0.875rem' }}>{form.correo}</p>
              <span className="badge badge-success" style={{ marginTop: 8 }}>Cliente activo</span>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Información personal</span>
            {!editando && (
              <button className="btn btn-secondary btn-sm" onClick={() => setEditando(true)}>
                Editar perfil
              </button>
            )}
          </div>
          <div className="card-body">
            {guardado && (
              <div style={{
                background: 'var(--success-light)', color: '#065f46',
                padding: '10px 14px', borderRadius: 'var(--radius)',
                fontSize: '0.875rem', fontWeight: 500, marginBottom: 16,
              }}>
                ✓ Cambios guardados correctamente
              </div>
            )}

            <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="pf-nombre">
                  <User size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                  Nombre completo
                </label>
                <input
                  id="pf-nombre"
                  name="nombre"
                  type="text"
                  className="form-input"
                  value={form.nombre}
                  onChange={handleChange}
                  disabled={!editando}
                  style={{ background: editando ? '' : 'var(--gray-50)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pf-correo">
                  <Mail size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                  Correo electrónico
                </label>
                <input
                  id="pf-correo"
                  name="correo"
                  type="email"
                  className="form-input"
                  value={form.correo}
                  onChange={handleChange}
                  disabled={!editando}
                  style={{ background: editando ? '' : 'var(--gray-50)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pf-telefono">
                  <Phone size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                  Número de teléfono
                </label>
                <input
                  id="pf-telefono"
                  name="telefono"
                  type="tel"
                  className="form-input"
                  value={form.telefono}
                  onChange={handleChange}
                  disabled={!editando}
                  placeholder="Sin número registrado"
                  style={{ background: editando ? '' : 'var(--gray-50)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pf-direccion">
                  <MapPin size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                  Dirección de entrega
                </label>
                <input
                  id="pf-direccion"
                  name="direccion"
                  type="text"
                  className="form-input"
                  value={form.direccion}
                  onChange={handleChange}
                  disabled={!editando}
                  placeholder="Sin dirección registrada"
                  style={{ background: editando ? '' : 'var(--gray-50)' }}
                />
              </div>

              {editando && (
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    <Save size={16} />
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditando(false)}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Cerrar sesión */}
        <div style={{ marginTop: 20 }}>
          <button
            className="btn btn-secondary btn-full"
            style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)', background: 'var(--danger-light)' }}
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}
