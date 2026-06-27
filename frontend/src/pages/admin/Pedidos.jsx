import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { pedidosApi } from '../../services/pedidosApi'
import { getBadgeClass, getBadgeLabel, formatDate, formatCurrency } from '../../data/mockData'

const ESTADOS = ['todos', 'pendiente', 'en_proceso', 'completado', 'cancelado']
const PER_PAGE = 10

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [pagina, setPagina] = useState(1)
  const [updatingId, setUpdatingId] = useState(null)

  const [errorMsg, setErrorMsg]   = useState(null)
  const [successId, setSuccessId] = useState(null)

  const cargar = () => {
    setLoading(true)
    pedidosApi.listar()
      .then((data) => setPedidos(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const filtered = pedidos.filter((p) => {
    const matchEstado = filtroEstado === 'todos' || p.estado === filtroEstado
    const term = search.toLowerCase()
    const matchSearch = !search ||
      String(p.id).includes(term) ||
      (p.cliente?.nombre || '').toLowerCase().includes(term)
    return matchEstado && matchSearch
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE)

  const handleSearch = (v) => { setSearch(v); setPagina(1) }
  const handleEstado = (v) => { setFiltroEstado(v); setPagina(1) }

  const handleCambiarEstado = async (id, nuevoEstado) => {
    setUpdatingId(id)
    setErrorMsg(null)
    try {
      await pedidosApi.actualizarEstado(id, nuevoEstado)
      setPedidos((prev) => prev.map((p) => p.id === id ? { ...p, estado: nuevoEstado } : p))
      setSuccessId(id)
      setTimeout(() => setSuccessId(null), 2000)
    } catch (err) {
      console.error('[Pedidos] Error al actualizar estado:', err)
      setErrorMsg(`Pedido #${id}: ${err.message}`)
    } finally {
      setUpdatingId(null)
    }
  }


  if (loading) return <div className="empty-state"><div className="empty-icon">⏳</div><p>Cargando pedidos...</p></div>
  if (error)   return <div className="empty-state"><div className="empty-icon">⚠️</div><p>Error: {error}</p></div>

  return (
    <div>
      {/* Error banner */}
      {errorMsg && (
        <div style={{
          background: 'var(--danger-light)', color: '#991b1b',
          padding: '10px 16px', borderRadius: 'var(--radius)', marginBottom: 16,
          fontSize: '0.875rem', fontWeight: 500, display: 'flex', justifyContent: 'space-between'
        }}>
          ⚠️ {errorMsg}
          <button onClick={() => setErrorMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrapper">
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
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id}>
                  <td data-label="Pedido">
                    <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>#{p.id}</span>
                  </td>
                  <td data-label="Cliente">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.7rem' }}>
                        {(p.cliente?.nombre || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{p.cliente?.nombre || '—'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.cliente?.correo || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Productos" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {(p.productos || []).map((dp, i) => (
                      <div key={i}>{dp.cantidad}× {dp.producto?.nombre}</div>
                    ))}
                  </td>
                  <td data-label="Total" style={{ fontWeight: 600 }}>{formatCurrency(p.total)}</td>
                  <td data-label="Canal" style={{ textTransform: 'capitalize', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {p.canal}
                  </td>
                  <td data-label="Estado">
                    <span className={`badge ${getBadgeClass(p.estado)}`}>
                      {getBadgeLabel(p.estado)}
                    </span>
                  </td>
                  <td data-label="Fecha" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    {formatDate((p.fecha || '').split('T')[0])}
                  </td>
                  <td data-label="Acción">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                      <select
                        className="form-select"
                        style={{
                          fontSize: '0.78rem', padding: '4px 8px', width: 140,
                          opacity: updatingId === p.id ? 0.6 : 1,
                          borderColor: successId === p.id ? 'var(--success)' : undefined,
                        }}
                        value={p.estado}
                        disabled={updatingId === p.id}
                        onChange={(e) => handleCambiarEstado(p.id, e.target.value)}
                      >
                        {ESTADOS.filter(e => e !== 'todos').map((e) => (
                          <option key={e} value={e}>{getBadgeLabel(e)}</option>
                        ))}
                      </select>
                      {updatingId === p.id && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏳</span>
                      )}
                      {successId === p.id && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>✓</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginated.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            No se encontraron pedidos
          </div>
        )}

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
