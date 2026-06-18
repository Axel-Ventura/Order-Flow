import { useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { pedidos, getBadgeClass, getBadgeLabel, formatDate, formatCurrency } from '../../data/mockData'
import { useAuth } from '../../context/AuthContext'

export default function HistorialPedidos() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  // Show only orders for the current client
  const misPedidos = pedidos.filter((p) =>
    p.cliente.correo === currentUser?.correo
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mis Pedidos</h1>
          <p className="page-subtitle">Historial de todos tus pedidos</p>
        </div>
      </div>

      {misPedidos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3 style={{ color: 'var(--text-secondary)' }}>Aún no tienes pedidos</h3>
          <p>Haz tu primer pedido desde el catálogo</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>
            Ver catálogo
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Fecha</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {misPedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>#{pedido.id}</span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatDate(pedido.fecha)}</td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>
                        {pedido.productos.map((dp, i) => (
                          <div key={i}>
                            {dp.cantidad}× {dp.producto.nombre}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(pedido.total)}</td>
                    <td>
                      <span className={`badge ${getBadgeClass(pedido.estado)}`}>
                        {getBadgeLabel(pedido.estado)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/tracking/${pedido.id}`)}
                        style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                      >
                        <Eye size={14} />
                        Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Demo: show all orders as example */}
      {misPedidos.length === 0 && (
        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 12 }}>
            Ejemplo de cómo se verá tu historial:
          </p>
          <div className="card">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.slice(0, 3).map((p) => (
                    <tr key={p.id}>
                      <td><span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>#{p.id}</span></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{formatDate(p.fecha)}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(p.total)}</td>
                      <td><span className={`badge ${getBadgeClass(p.estado)}`}>{getBadgeLabel(p.estado)}</span></td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/tracking/${p.id}`)}>
                          <Eye size={14} /> Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
