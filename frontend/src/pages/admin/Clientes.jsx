import { useState } from 'react'
import { Search } from 'lucide-react'
import { clientes, getBadgeClass, getBadgeLabel, formatDate } from '../../data/mockData'

export default function Clientes() {
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  const filtered = clientes.filter((c) => {
    const matchEstado = filtroEstado === 'todos' || c.estado === filtroEstado
    const term = search.toLowerCase()
    const matchSearch = !search ||
      c.nombre.toLowerCase().includes(term) ||
      c.correo.toLowerCase().includes(term) ||
      c.telefono.includes(term)
    return matchEstado && matchSearch
  })

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="search-wrapper" style={{ maxWidth: 300 }}>
          <Search size={16} className="search-icon" />
          <input
            className="search-input"
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => { setSearch(e.target.value) }}
          />
        </div>
        <select
          className="form-select"
          style={{ width: 160 }}
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">
            {filtered.length} cliente{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Pedidos</th>
                <th>Estado</th>
                <th>Registro</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ width: 34, height: 34, fontSize: '0.78rem' }}>
                        {c.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.nombre}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.correo}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{c.telefono}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{c.direccion}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                      {c.totalPedidos}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getBadgeClass(c.estado)}`}>
                      {getBadgeLabel(c.estado)}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    {formatDate(c.fechaRegistro)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    No se encontraron clientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
