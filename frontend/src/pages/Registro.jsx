import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { authApi } from '../services/authApi'

export default function Registro() {
  const navigate = useNavigate()
  const [roles, setRoles] = useState([])
  const [form, setForm] = useState({ nombre: '', correo: '', telefono: '', password: '', confirmar: '', idRol: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Cargar roles disponibles del backend
  useEffect(() => {
    authApi.getRoles().then((data) => {
      setRoles(data)
      // Seleccionar el rol "cliente" o "comprador" por defecto, prefiriendo "cliente" si ambos existen
      const defecto = data.find((r) => r.nombre === 'cliente') || data.find((r) => r.nombre === 'comprador')
      if (defecto) setForm((f) => ({ ...f, idRol: defecto.id_rol }))
    }).catch(() => {
      // Si falla, continuar sin roles (el backend usará el default)
    })
  }, [])

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (!/[A-Z]/.test(form.password)) {
      setError('La contraseña debe contener al menos una letra mayúscula.')
      return
    }
    if (!/[0-9]/.test(form.password)) {
      setError('La contraseña debe contener al menos un número.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await authApi.register({
        nombre:   form.nombre,
        correo:   form.correo,
        password: form.password,
        idRol:    form.idRol || undefined,
        telefono: form.telefono || undefined,
      })
      navigate('/login', { state: { registrado: true } })
    } catch (err) {
      if (err.data && err.data.errors && Array.isArray(err.data.errors)) {
        const msg = err.data.errors.map((e) => e.message).join(' | ')
        setError(msg)
      } else {
        setError(err.message || 'No se pudo crear la cuenta. Intenta nuevamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Rol seleccionado actual
  const rolActual = roles.find((r) => r.id_rol === Number(form.idRol))?.nombre || ''
  const esComprador = rolActual === 'comprador' || rolActual === 'cliente' || !rolActual

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

          {/* Tipo de cuenta dinámico desde el backend */}
          <div className="form-group">
            <label className="form-label">Tipo de Cuenta</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {(() => {
                const rolesFiltrados = []
                const vendedorRol = roles.find((r) => r.nombre === 'vendedor')
                const clienteRol = roles.find((r) => r.nombre === 'cliente')
                const compradorRol = roles.find((r) => r.nombre === 'comprador')

                if (clienteRol) {
                  rolesFiltrados.push(clienteRol)
                } else if (compradorRol) {
                  rolesFiltrados.push(compradorRol)
                }
                if (vendedorRol) {
                  rolesFiltrados.push(vendedorRol)
                }

                return rolesFiltrados.map((r) => {
                  const seleccionado = Number(form.idRol) === r.id_rol
                  const esVendedor = r.nombre === 'vendedor'
                  return (
                    <label
                      key={r.id_rol}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '10px 14px', border: '1.5px solid',
                        borderColor: seleccionado ? 'var(--primary-600)' : 'var(--border)',
                        borderRadius: 'var(--radius)', background: seleccionado ? 'var(--primary-50)' : 'var(--surface)',
                        color: seleccionado ? 'var(--primary-600)' : 'var(--text-secondary)',
                        fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'var(--transition)'
                      }}
                    >
                      <input
                        type="radio"
                        name="idRol"
                        value={r.id_rol}
                        checked={seleccionado}
                        onChange={handleChange}
                        style={{ display: 'none' }}
                      />
                      {esVendedor ? '💼 Vender (Vendedor)' : '👤 Comprar (Cliente)'}
                    </label>
                  )
                })
              })()}
              {/* Fallback si aún no cargaron los roles */}
              {roles.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '8px 0' }}>
                  Cargando tipos de cuenta...
                </div>
              )}
            </div>
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
