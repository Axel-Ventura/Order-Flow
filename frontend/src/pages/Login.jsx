import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ correo: '', password: '', recordar: false })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      const result = login(form.correo, form.password)
      setLoading(false)
      if (result.success) {
        navigate(result.rol === 'admin' ? '/admin' : '/')
      } else {
        setError(result.error)
      }
    }, 600)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">O</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', lineHeight: 1.2 }}>OrderFlow</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gestión de pedidos</div>
          </div>
        </div>

        <h1 className="auth-title">Bienvenido de nuevo</h1>
        <p className="auth-subtitle">Inicia sesión para continuar</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="correo">
              <Mail size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              Correo electrónico
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              className="form-input"
              placeholder="tu@correo.com"
              value={form.correo}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              <Lock size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label className="checkbox-group">
              <input type="checkbox" name="recordar" checked={form.recordar} onChange={handleChange} />
              Recordarme
            </label>
            <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: 500 }}>
              ¿Olvidaste tu contraseña?
            </a>
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

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <hr className="divider" />

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
            Regístrate aquí
          </Link>
        </p>

        {/* Hint for development */}
        <div style={{
          marginTop: 20,
          background: 'var(--gray-50)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '12px 14px',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
        }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Cuentas de prueba:</strong>
          <br />
          👤 Cliente: <code style={{ color: 'var(--primary-700)' }}>comprador@test.com</code> / <code style={{ color: 'var(--primary-700)' }}>123456</code>
          <br />
          🔧 Vendedor: <code style={{ color: 'var(--primary-700)' }}>vendedor@test.com</code> / <code style={{ color: 'var(--primary-700)' }}>123456</code>
        </div>
      </div>
    </div>
  )
}