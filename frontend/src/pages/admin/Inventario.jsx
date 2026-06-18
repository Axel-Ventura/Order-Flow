import { useState } from 'react'
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react'
import { productos as initialProductos, categorias, getBadgeClass, getBadgeLabel } from '../../data/mockData'

export default function Inventario() {
  const [lista, setLista] = useState(initialProductos)
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [modal, setModal] = useState(null) // null | 'nuevo' | producto

  const filtered = lista.filter((p) => {
    const matchEstado = filtroEstado === 'todos' || p.estado === filtroEstado
    const term = search.toLowerCase()
    const matchSearch = !search || p.nombre.toLowerCase().includes(term)
    return matchEstado && matchSearch
  })

  const getStockBadge = (p) => {
    if (p.estado === 'agotado' || p.stock === 0) return 'badge-danger'
    if (p.stock < 10) return 'badge-warning'
    return 'badge-success'
  }
  const getStockLabel = (p) => {
    if (p.estado === 'agotado' || p.stock === 0) return 'Agotado'
    if (p.stock < 10) return 'Bajo Stock'
    return 'Disponible'
  }

  const handleEliminar = (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      setLista((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const handleGuardarModal = (form) => {
    if (modal === 'nuevo') {
      const newId = 'p' + Date.now()
      setLista((prev) => [...prev, {
        ...form,
        id: newId,
        emoji: form.emoji || '📦',
        imagen: null,
        estado: form.stock > 0 ? 'disponible' : 'agotado',
      }])
    } else {
      setLista((prev) => prev.map((p) =>
        p.id === modal.id
          ? { ...p, ...form, estado: form.stock > 0 ? 'disponible' : 'agotado' }
          : p
      ))
    }
    setModal(null)
  }

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="search-wrapper" style={{ maxWidth: 280 }}>
            <Search size={16} className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-select"
            style={{ width: 160 }}
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="disponible">Disponibles</option>
            <option value="agotado">Agotados</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('nuevo')}>
          <Plus size={16} />
          Nuevo Producto
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.4rem' }}>{p.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.nombre}</div>
                        <div className="product-card-desc" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 200 }}>
                          {p.descripcion?.slice(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textTransform: 'capitalize', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {p.categoria}
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                    ${p.precio.toFixed(2)}
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.stock}</td>
                  <td>
                    <span className={`badge ${getStockBadge(p)}`}>{getStockLabel(p)}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setModal(p)}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'var(--danger-light)', color: '#991b1b', border: 'none' }}
                        onClick={() => handleEliminar(p.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <ProductModal
          producto={modal === 'nuevo' ? null : modal}
          onSave={handleGuardarModal}
          onClose={() => setModal(null)}
          categorias={categorias.filter(c => c.id !== 'todos')}
        />
      )}
    </div>
  )
}

function ProductModal({ producto, onSave, onClose, categorias }) {
  const [form, setForm] = useState({
    nombre:      producto?.nombre      || '',
    descripcion: producto?.descripcion || '',
    precio:      producto?.precio      || '',
    stock:       producto?.stock       || '',
    categoria:   producto?.categoria   || 'comida',
    emoji:       producto?.emoji       || '📦',
  })

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...form, precio: parseFloat(form.precio), stock: parseInt(form.stock) })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{producto ? 'Editar Producto' : 'Nuevo Producto'}</span>
          <button className="btn btn-ghost" style={{ padding: 6 }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Emoji</label>
                <input name="emoji" className="form-input" value={form.emoji} onChange={handleChange} style={{ fontSize: '1.4rem', textAlign: 'center' }} maxLength={2} />
              </div>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select name="categoria" className="form-select" value={form.categoria} onChange={handleChange}>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Nombre del producto *</label>
              <input name="nombre" className="form-input" value={form.nombre} onChange={handleChange} required placeholder="Ej: Hamburguesa especial" />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea name="descripcion" className="form-textarea" value={form.descripcion} onChange={handleChange} placeholder="Descripción del producto..." style={{ minHeight: 70 }} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Precio (MXN) *</label>
                <input name="precio" type="number" min="0" step="0.01" className="form-input" value={form.precio} onChange={handleChange} required placeholder="0.00" />
              </div>
              <div className="form-group">
                <label className="form-label">Stock *</label>
                <input name="stock" type="number" min="0" className="form-input" value={form.stock} onChange={handleChange} required placeholder="0" />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              {producto ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
