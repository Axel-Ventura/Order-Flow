import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'

export default function Registro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', correo: '', telefono: '', password: '', confirmar: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/login')
    }, 800)
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">O</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', lineHeight: 1.2 }}>OrderFlow</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gestión de pedidos</div>
          </div>
        </div>

        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-subtitle">Llena el formulario para registrarte</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-nombre">
              <User size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              Nombre completo
            </label>
            <input
              id="reg-nombre"
              name="nombre"
              type="text"
              className="form-input"
              placeholder="Juan Pérez"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-correo">
              <Mail size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              Correo electrónico
            </label>
            <input
              id="reg-correo"
              name="correo"
              type="email"
              className="form-input"
              placeholder="tu@correo.com"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-telefono">
              <Phone size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              Teléfono <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              id="reg-telefono"
              name="telefono"
              type="tel"
              className="form-input"
              placeholder="2381234567"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">
              <Lock size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0,
                }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirmar">
              <Lock size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              Confirmar contraseña
            </label>
            <input
              id="reg-confirmar"
              name="confirmar"
              type={showPass ? 'text' : 'password'}
              className="form-input"
              placeholder="••••••••"
              value={form.confirmar}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div style={{
              background: 'var(--danger-light)', color: '#991b1b',
              padding: '10px 14px', borderRadius: 'var(--radius)',
              fontSize: '0.875rem', fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 4 }} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <hr className="divider" />

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
