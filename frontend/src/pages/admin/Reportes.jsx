import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { pedidosApi } from '../../services/pedidosApi'
import { formatCurrency } from '../../data/mockData'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

export default function Reportes() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataReportes, setDataReportes] = useState({
    estadosData: [],
    reportesMensuales: [],
  })

  useEffect(() => {
    setLoading(true)
    pedidosApi.listar()
      .then((listaPedidos) => {
        // 1. Agrupar por Estado
        const estados = { completado: 0, en_proceso: 0, pendiente: 0, cancelado: 0 };
        (listaPedidos || []).forEach((p) => {
          if (estados[p.estado] !== undefined) {
            estados[p.estado]++;
          }
        });

        const estadosData = [
          { name: 'Completado', value: estados.completado },
          { name: 'En Proceso',  value: estados.en_proceso },
          { name: 'Pendiente',   value: estados.pendiente },
          { name: 'Cancelado',   value: estados.cancelado },
        ];

        // 2. Agrupar Ventas por Mes (últimos 6 meses cronológicos)
        const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const ultimosMeses = [];
        
        const hoy = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          ultimosMeses.push({
            key,
            mes: `${mesesNombres[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`,
            ventas: 0,
            pedidos: 0,
          });
        }

        (listaPedidos || []).forEach((p) => {
          if (p.estado === 'cancelado') return; // Excluir cancelados de los reportes financieros
          const fecha = new Date(p.fecha);
          if (isNaN(fecha.getTime())) return;
          const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
          
          const mesObj = ultimosMeses.find((m) => m.key === key);
          if (mesObj) {
            mesObj.ventas += parseFloat(p.total || 0);
            mesObj.pedidos += 1;
          }
        });

        setDataReportes({ estadosData, reportesMensuales: ultimosMeses });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="empty-state"><div className="empty-icon">⏳</div><p>Cargando reportes...</p></div>
  if (error)   return <div className="empty-state"><div className="empty-icon">⚠️</div><p>Error: {error}</p></div>

  const { estadosData, reportesMensuales } = dataReportes
  const totalIngresos = reportesMensuales.reduce((s, r) => s + r.ventas, 0)
  const totalPedidosMes = reportesMensuales.reduce((s, r) => s + r.pedidos, 0)
  const ticketPromedio = totalPedidosMes > 0 ? (totalIngresos / totalPedidosMes) : 0

  return (
    <div>
      {/* Summary KPIs */}
      <div className="reportes-kpis">
        {[
          { label: 'Ingresos totales (6 meses)', value: formatCurrency(totalIngresos), color: '#10b981' },
          { label: 'Pedidos totales (6 meses)',  value: totalPedidosMes,               color: '#4f46e5' },
          { label: 'Ticket promedio',            value: formatCurrency(ticketPromedio), color: '#f59e0b' },
        ].map((k) => (
          <div key={k.label} className="card" style={{ padding: 0 }}>
            <div style={{ padding: '18px 22px' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="reportes-charts">
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
                  <td data-label="Mes" style={{ fontWeight: 600 }}>{r.mes}</td>
                  <td data-label="Pedidos">{r.pedidos}</td>
                  <td data-label="Ventas" style={{ fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(r.ventas)}</td>
                  <td data-label="Ticket promedio" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(r.pedidos > 0 ? r.ventas / r.pedidos : 0)}</td>
                </tr>
              ))}
              <tr style={{ background: 'var(--primary-50)', fontWeight: 700 }}>
                <td data-label="Mes">Total</td>
                <td data-label="Pedidos">{totalPedidosMes}</td>
                <td data-label="Ventas" style={{ color: 'var(--primary-600)' }}>{formatCurrency(totalIngresos)}</td>
                <td data-label="Ticket promedio">{formatCurrency(totalPedidosMes > 0 ? totalIngresos / totalPedidosMes : 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
