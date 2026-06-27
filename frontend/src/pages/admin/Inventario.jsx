import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react'
import { productosApi } from '../../services/productosApi'
import { inferEmoji } from '../cliente/Catalogo'

// Categorías cargadas dinámicamente desde la base de datos
export default function Inventario() {
  const [lista, setLista] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [modal, setModal] = useState(null) // null | 'nuevo' | producto
  const [categorias, setCategorias] = useState([])

  const cargar = () => {
    setLoading(true)
    Promise.all([
      productosApi.listar(),
      productosApi.listarCategorias()
    ])
      .then(([prodData, catData]) => {
        setCategorias(catData || [])
        setLista(normalizeProductos(prodData))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

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

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    try {
      await productosApi.eliminar(id)
      setLista((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  const handleGuardarModal = async (form) => {
    try {
      if (modal === 'nuevo') {
        const data = await productosApi.crear({
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: parseFloat(form.precio),
          stock: parseInt(form.stock),
          id_tipo_negocio: parseInt(form.id_tipo_negocio, 10),
        })
        const catLabel = categorias.find(c => Number(c.id_tipo_negocio) === Number(data.id_tipo_negocio))?.nombre || 'General'
        setLista((prev) => [...prev, {
          id: data.id_producto,
          nombre: data.nombre,
          descripcion: data.descripcion || '',
          precio: parseFloat(data.precio),
          stock: data.stock,
          estado: data.estado,
          emoji: inferEmoji(data.nombre, catLabel),
          id_tipo_negocio: data.id_tipo_negocio,
          categoria: catLabel,
        }])
      } else {
        const data = await productosApi.actualizar(modal.id, {
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: parseFloat(form.precio),
          stock: parseInt(form.stock),
          id_tipo_negocio: parseInt(form.id_tipo_negocio, 10),
        })
        const catLabel = categorias.find(c => Number(c.id_tipo_negocio) === Number(data.id_tipo_negocio))?.nombre || 'General'
        setLista((prev) => prev.map((p) =>
          p.id === modal.id
            ? {
              ...p,
              ...data,
              id: data.id_producto,
              precio: parseFloat(data.precio),
              emoji: inferEmoji(data.nombre, catLabel),
              id_tipo_negocio: data.id_tipo_negocio,
              categoria: catLabel
            }
            : p
        ))
      }
      setModal(null)
    } catch (err) {
      alert('Error al guardar: ' + err.message)
    }
  }

  if (loading) return <div className="empty-state"><div className="empty-icon">⏳</div><p>Cargando inventario...</p></div>
  if (error) return <div className="empty-state"><div className="empty-icon">⚠️</div><p>Error: {error}</p></div>

  return (
    <div>
      {/* Controls */}
      <div className="inventario-controls" style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="search-wrapper">
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
        <button className="btn btn-primary btn-nuevo" onClick={() => setModal('nuevo')}>
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
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td data-label="Producto">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '1.4rem' }}>{p.emoji}</span>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.nombre}</div>
                          <span style={{ fontSize: '0.65rem', background: 'var(--primary-100)', color: 'var(--primary-700)', padding: '1px 5px', borderRadius: 4, textTransform: 'capitalize', fontWeight: 600 }}>
                            {p.categoria}
                          </span>
                        </div>
                        <div className="product-card-desc" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 200 }}>
                          {(p.descripcion || '').slice(0, 50)}{p.descripcion?.length > 50 ? '...' : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Precio" style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                    ${parseFloat(p.precio).toFixed(2)}
                  </td>
                  <td data-label="Stock" style={{ fontWeight: 600 }}>{p.stock}</td>
                  <td data-label="Estado">
                    <span className={`badge ${getStockBadge(p)}`}>{getStockLabel(p)}</span>
                  </td>
                  <td data-label="Acciones">
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
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
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            No se encontraron productos
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <ProductModal
          producto={modal === 'nuevo' ? null : modal}
          categorias={categorias}
          onSave={handleGuardarModal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

function ProductModal({ producto, categorias, onSave, onClose }) {
  const [form, setForm] = useState({
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    precio: producto?.precio || '',
    stock: producto?.stock || '',
    id_tipo_negocio: producto?.id_tipo_negocio || (categorias[0]?.id_tipo_negocio || '1'),
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
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
            <div className="form-group">
              <label className="form-label">Nombre del producto *</label>
              <input name="nombre" className="form-input" value={form.nombre} onChange={handleChange} required placeholder="Ej: Hamburguesa especial" />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea name="descripcion" className="form-textarea" value={form.descripcion} onChange={handleChange} placeholder="Descripción del producto..." style={{ minHeight: 70 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Categoría *</label>
              <select name="id_tipo_negocio" className="form-select" value={form.id_tipo_negocio} onChange={handleChange} required>
                {categorias.map((cat) => (
                  <option key={cat.id_tipo_negocio} value={cat.id_tipo_negocio}>{cat.nombre}</option>
                ))}
              </select>
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
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : (producto ? 'Guardar cambios' : 'Crear producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─── Normalizer ─────────────────────────────────────── */
function normalizeProductos(data) {
  return (data || []).map((p) => ({
    id: p.id_producto,
    nombre: p.nombre,
    descripcion: p.descripcion || '',
    precio: parseFloat(p.precio),
    stock: p.stock,
    estado: p.estado,
    emoji: inferEmoji(p.nombre, p.tipos_negocio?.nombre),
    imagen_url: p.imagen_url,
    id_tipo_negocio: p.id_tipo_negocio,
    categoria: p.tipos_negocio?.nombre || 'General',
  }))
}
