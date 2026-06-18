import { useState } from 'react'
import { Search } from 'lucide-react'
import { pedidos, getBadgeClass, getBadgeLabel, formatDate, formatCurrency } from '../../data/mockData'

const ESTADOS = ['todos', 'pendiente', 'en_proceso', 'completado', 'cancelado']
const PER_PAGE = 4

export default function Pedidos() {
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [pagina, setPagina] = useState(1)

  const filtered = pedidos.filter((p) => {
    const matchEstado = filtroEstado === 'todos' || p.estado === filtroEstado
    const term = search.toLowerCase()
    const matchSearch = !search ||
      p.id.toLowerCase().includes(term) ||
      p.cliente.nombre.toLowerCase().includes(term)
    return matchEstado && matchSearch
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE)

  const handleSearch = (v) => { setSearch(v); setPagina(1) }
  const handleEstado = (v) => { setFiltroEstado(v); setPagina(1) }

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="search-wrapper" style={{ maxWidth: 300 }}>
          <Search size={16} className="search-icon" />
          <input
            className="search-input"
            type="text"
            placeholder="Buscar por ID o cliente..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          style={{ width: 180 }}
          value={filtroEstado}
          onChange={(e) => handleEstado(e.target.value)}
        >
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e === 'todos' ? 'Todos los estados' : getBadgeLabel(e)}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">
            {filtered.length} pedido{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Canal</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? paginated.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>#{p.id}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.7rem' }}>
                        {p.cliente.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{p.cliente.nombre}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.cliente.correo}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {p.productos.map((dp, i) => (
                      <div key={i}>{dp.cantidad}× {dp.producto.nombre}</div>
                    ))}
                  </td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(p.total)}</td>
                  <td style={{ textTransform: 'capitalize', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {p.canal}
                  </td>
                  <td>
                    <span className={`badge ${getBadgeClass(p.estado)}`}>
                      {getBadgeLabel(p.estado)}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    {formatDate(p.fecha)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    No se encontraron pedidos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-btn${pagina === i + 1 ? ' active' : ''}`}
                onClick={() => setPagina(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
