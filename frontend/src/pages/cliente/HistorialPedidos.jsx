import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { pedidosApi } from '../../services/pedidosApi'
import { getBadgeClass, getBadgeLabel, formatDate, formatCurrency } from '../../data/mockData'

export default function HistorialPedidos() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    pedidosApi.listar()
      .then((data) => setPedidos(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="empty-state"><div className="empty-icon">⏳</div><p>Cargando pedidos...</p></div>
  )
  if (error) return (
    <div className="empty-state"><div className="empty-icon">⚠️</div><p>Error: {error}</p></div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mis Pedidos</h1>
          <p className="page-subtitle">Historial de todos tus pedidos</p>
        </div>
      </div>

      {pedidos.length === 0 ? (
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
                  <th>Establecimiento</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>#{pedido.id}</span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatDate(pedido.fecha?.split('T')[0] || pedido.fecha)}</td>
                    <td>
                      <span style={{ fontSize: '0.8rem', background: 'var(--primary-50)', color: 'var(--primary-700)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                        🏬 {pedido.vendedor?.nombre || 'Establecimiento'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>
                        {(pedido.productos || []).map((dp, i) => (
                          <div key={i}>
                            {dp.cantidad}× {dp.producto?.nombre}
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
    </div>
  )
}
