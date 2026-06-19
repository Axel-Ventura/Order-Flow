import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Clock, Package, Truck, CheckCircle } from 'lucide-react'
import { pedidosApi } from '../../services/pedidosApi'
import { getBadgeClass, getBadgeLabel, formatDate, formatCurrency } from '../../data/mockData'

const steps = [
  { key: 'pendiente',   label: 'Pedido recibido',       icon: Package,     desc: 'Tu pedido fue registrado correctamente' },
  { key: 'en_proceso',  label: 'Preparando tu pedido',   icon: Clock,       desc: 'Estamos preparando tus productos' },
  { key: 'completado',  label: 'Completado',             icon: CheckCircle, desc: '¡Tu pedido está completado!' },
]

const getStepIndex = (estado) => {
  if (estado === 'cancelado') return -1
  if (estado === 'completado') return 3
  if (estado === 'en_proceso') return 2
  if (estado === 'pendiente')  return 1
  return 0
}

export default function SeguimientoPedido() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pedido, setPedido] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    pedidosApi.obtener(id)
      .then((data) => setPedido(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="empty-state"><div className="empty-icon">⏳</div><p>Cargando pedido...</p></div>
  if (error || !pedido) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3>Pedido no encontrado</h3>
        <button className="btn btn-secondary mt-4" onClick={() => navigate('/history')}>
          Ver mis pedidos
        </button>
      </div>
    )
  }

  const currentStep = getStepIndex(pedido.estado)
  const cancelado = pedido.estado === 'cancelado'

  return (
    <div>
      <button
        className="btn btn-ghost mb-4"
        style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 0 }}
        onClick={() => navigate('/history')}
      >
        <ArrowLeft size={18} />
        Mis pedidos
      </button>

      <div className="page-header">
        <div>
          <h1 className="page-title">Seguimiento del Pedido</h1>
          <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            #{pedido.id} · {formatDate(pedido.fecha?.split('T')[0] || pedido.fecha)}
            {pedido.vendedor && (
              <span style={{ background: 'var(--primary-100)', color: 'var(--primary-800)', padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>
                🏬 {pedido.vendedor.nombre}
              </span>
            )}
          </p>
        </div>
        <span className={`badge ${getBadgeClass(pedido.estado)}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
          {getBadgeLabel(pedido.estado)}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Stepper */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Estado del pedido</span>
          </div>
          <div className="card-body">
            {cancelado ? (
              <div style={{
                background: 'var(--danger-light)', color: '#991b1b',
                padding: '20px', borderRadius: 'var(--radius-lg)',
                textAlign: 'center', fontWeight: 600,
              }}>
                ❌ Este pedido fue cancelado
              </div>
            ) : (
              <div className="stepper">
                {steps.map((step, index) => {
                  const isCompleted = index < currentStep
                  const isCurrent   = index === currentStep - 1 || (currentStep === 3 && index === 2)
                  const Icon = step.icon

                  return (
                    <div
                      key={step.key}
                      className={`stepper-item${isCompleted || (currentStep === 3 && index <= 2) ? ' completed' : ''}${isCurrent && currentStep < 3 ? ' current' : ''}`}
                    >
                      <div className="stepper-circle">
                        {isCompleted || currentStep === 3 ? (
                          <Check size={15} />
                        ) : isCurrent ? (
                          <Icon size={15} />
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{index + 1}</span>
                        )}
                      </div>
                      <div className="stepper-content">
                        <div className="stepper-label" style={{
                          color: isCompleted || (currentStep === 3) ? 'var(--success)' :
                                 isCurrent ? 'var(--primary-600)' : 'var(--text-muted)',
                        }}>
                          {step.label}
                        </div>
                        <div className="stepper-time">{step.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {pedido.estado === 'en_proceso' && (
              <div style={{
                marginTop: 16, background: 'var(--primary-50)',
                borderRadius: 'var(--radius)', padding: '12px 16px',
                fontSize: '0.875rem', color: 'var(--primary-700)',
              }}>
                ⏱ Tiempo estimado de entrega: <strong>25–35 minutos</strong>
              </div>
            )}
          </div>
        </div>

        {/* Detalle del pedido */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Productos</span>
            </div>
            <div className="card-body" style={{ padding: '8px 20px' }}>
              {(pedido.productos || []).map(({ producto, cantidad, precio_unitario, subtotal }, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderBottom: i < pedido.productos.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.4rem' }}>🛒</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{producto.nombre}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>x{cantidad} · {formatCurrency(precio_unitario)}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{formatCurrency(subtotal)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="summary-box">
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatCurrency(pedido.total)}</span>
                </div>
              </div>
              {pedido.observaciones && (
                <div style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <strong>Notas:</strong> {pedido.observaciones}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
