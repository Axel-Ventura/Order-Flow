import { useNavigate } from 'react-router-dom'
import { ShoppingBag, DollarSign, Users, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { pedidos, estadisticasDashboard, productos, getBadgeClass, getBadgeLabel, formatDate, formatCurrency } from '../../data/mockData'

const stats = [
  {
    label: 'Total Pedidos',
    value: estadisticasDashboard.totalPedidos,
    change: estadisticasDashboard.cambiosPedidos,
    icon: ShoppingBag,
    color: '#4f46e5',
    bg: '#eef2ff',
  },
  {
    label: 'Ingresos (mes)',
    value: formatCurrency(estadisticasDashboard.ingresosMes),
    change: estadisticasDashboard.cambiosIngresos,
    icon: DollarSign,
    color: '#10b981',
    bg: '#d1fae5',
  },
  {
    label: 'Clientes',
    value: estadisticasDashboard.totalClientes,
    change: estadisticasDashboard.cambiosClientes,
    icon: Users,
    color: '#f59e0b',
    bg: '#fef3c7',
  },
  {
    label: 'Pendientes',
    value: estadisticasDashboard.pedidosPendientes,
    change: estadisticasDashboard.cambiosPendientes,
    icon: Clock,
    color: '#ef4444',
    bg: '#fee2e2',
  },
]

export default function Dashboard() {
  const navigate = useNavigate()

  const topProductos = [...productos]
    .filter(p => p.estado === 'disponible')
    .slice(0, 4)

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s) => {
          const Icon = s.icon
          const isUp = s.change?.startsWith('+')
          return (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                <Icon size={22} />
              </div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className={`stat-change ${isUp ? 'up' : 'down'}`}>
                  <TrendingUp size={12} style={{ display: 'inline', marginRight: 3 }} />
                  {s.change} este mes
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Pedidos recientes */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Pedidos recientes</span>
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--primary-600)', fontWeight: 600 }}
              onClick={() => navigate('/admin/pedidos')}
            >
              Ver todos <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.slice(0, 5).map((p) => (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/pedidos')}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>#{p.id}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.7rem' }}>
                          {p.cliente.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span style={{ fontSize: '0.875rem' }}>{p.cliente.nombre}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(p.total)}</td>
                    <td>
                      <span className={`badge ${getBadgeClass(p.estado)}`}>
                        {getBadgeLabel(p.estado)}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {formatDate(p.fecha)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top productos */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Top productos</span>
          </div>
          <div className="card-body" style={{ padding: '8px 16px' }}>
            {topProductos.map((p, i) => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: i < topProductos.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 32, height: 32,
                  background: 'var(--primary-50)',
                  borderRadius: 'var(--radius)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', flexShrink: 0,
                }}>
                  {p.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{p.nombre}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Stock: {p.stock}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--primary-600)' }}>
                  ${p.precio.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
