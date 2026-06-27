import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, DollarSign, Users, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { statsApi } from '../../services/statsApi'
import { getBadgeClass, getBadgeLabel, formatDate, formatCurrency } from '../../data/mockData'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    statsApi.dashboard()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats
    ? [
        { label: 'Total Pedidos',   value: stats.totalPedidos,      change: stats.cambiosPedidos,   icon: ShoppingBag, color: '#4f46e5', bg: '#eef2ff' },
        { label: 'Ingresos (mes)',  value: formatCurrency(stats.ingresosMes), change: stats.cambiosIngresos,  icon: DollarSign,  color: '#10b981', bg: '#d1fae5' },
        { label: 'Clientes',        value: stats.totalClientes,     change: stats.cambiosClientes,  icon: Users,       color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Pendientes',      value: stats.pedidosPendientes, change: stats.cambiosPendientes, icon: Clock,       color: '#ef4444', bg: '#fee2e2' },
      ]
    : []

  if (loading) return (
    <div className="empty-state"><div className="empty-icon">⏳</div><p>Cargando estadísticas...</p></div>
  )

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        {statCards.map((s) => {
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

      <div className="dashboard-grid">
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
                {(stats?.pedidosRecientes || []).map((p) => (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/pedidos')}>
                    <td data-label="Pedido">
                      <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>#{p.id}</span>
                    </td>
                    <td data-label="Cliente">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.7rem' }}>
                          {(p.cliente?.nombre || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span style={{ fontSize: '0.875rem' }}>{p.cliente?.nombre || '—'}</span>
                      </div>
                    </td>
                    <td data-label="Total" style={{ fontWeight: 600 }}>{formatCurrency(p.total)}</td>
                    <td data-label="Estado">
                      <span className={`badge ${getBadgeClass(p.estado)}`}>
                        {getBadgeLabel(p.estado)}
                      </span>
                    </td>
                    <td data-label="Fecha" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {formatDate((p.fecha || '').split('T')[0])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(stats?.pedidosRecientes || []).length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted)' }}>
              No hay pedidos aún
            </div>
          )}
        </div>

        {/* Resumen rápido */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Resumen rápido</span>
          </div>
          <div className="card-body" style={{ padding: '8px 16px' }}>
            {[
              { label: 'Pedidos totales',    value: stats?.totalPedidos || 0 },
              { label: 'Ingresos del mes',   value: formatCurrency(stats?.ingresosMes || 0) },
              { label: 'Clientes activos',   value: stats?.totalClientes || 0 },
              { label: 'Por procesar',       value: stats?.pedidosPendientes || 0 },
            ].map((item, i, arr) => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
