import { Download } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { reportesMensuales, pedidos, formatCurrency } from '../../data/mockData'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

const estadosData = [
  { name: 'Completado', value: pedidos.filter(p => p.estado === 'completado').length },
  { name: 'En Proceso',  value: pedidos.filter(p => p.estado === 'en_proceso').length },
  { name: 'Pendiente',   value: pedidos.filter(p => p.estado === 'pendiente').length },
  { name: 'Cancelado',   value: pedidos.filter(p => p.estado === 'cancelado').length },
]

export default function Reportes() {
  const totalIngresos = reportesMensuales.reduce((s, r) => s + r.ventas, 0)
  const totalPedidosMes = reportesMensuales.reduce((s, r) => s + r.pedidos, 0)

  return (
    <div>
      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Ingresos totales (6 meses)', value: formatCurrency(totalIngresos), color: '#10b981' },
          { label: 'Pedidos totales (6 meses)',  value: totalPedidosMes,               color: '#4f46e5' },
          { label: 'Ticket promedio',            value: formatCurrency(totalIngresos / totalPedidosMes), color: '#f59e0b' },
        ].map((k) => (
          <div key={k.label} className="card" style={{ padding: 0 }}>
            <div style={{ padding: '18px 22px' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginBottom: 24 }}>
        {/* Line chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Ventas por mes</span>
            <button className="btn btn-secondary btn-sm" onClick={() => alert('Exportando PDF...')}>
              <Download size={14} /> PDF
            </button>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={reportesMensuales}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                  formatter={(v) => [formatCurrency(v), 'Ventas']}
                />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={{ fill: '#4f46e5', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Estado de pedidos</span>
          </div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={estadosData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {estadosData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                <Legend
                  iconType="circle"
                  iconSize={9}
                  wrapperStyle={{ fontSize: '0.8rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Resumen mensual</span>
          <button className="btn btn-secondary btn-sm" onClick={() => alert('Exportando Excel...')}>
            <Download size={14} /> Excel
          </button>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Mes</th>
                <th>Pedidos</th>
                <th>Ventas</th>
                <th>Ticket promedio</th>
              </tr>
            </thead>
            <tbody>
              {reportesMensuales.map((r) => (
                <tr key={r.mes}>
                  <td style={{ fontWeight: 600 }}>{r.mes} 2026</td>
                  <td>{r.pedidos}</td>
                  <td style={{ fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(r.ventas)}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{formatCurrency(r.ventas / r.pedidos)}</td>
                </tr>
              ))}
              <tr style={{ background: 'var(--primary-50)', fontWeight: 700 }}>
                <td>Total</td>
                <td>{totalPedidosMes}</td>
                <td style={{ color: 'var(--primary-600)' }}>{formatCurrency(totalIngresos)}</td>
                <td>{formatCurrency(totalIngresos / totalPedidosMes)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
