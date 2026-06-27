import { useState, useEffect, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Filter, X, Check, Search as SearchIcon } from 'lucide-react'
import { productosApi } from '../../services/productosApi'
import { getBadgeClass, getBadgeLabel } from '../../data/mockData'
import ProductCard from '../../components/cliente/ProductCard'


export default function Catalogo() {
  const { search } = useOutletContext?.() || {}
  const [categoriaActiva, setCategoriaActiva] = useState('todos')
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([{ id: 'todos', label: 'Todos' }])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mobile Bottom Sheet States
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [searchCat, setSearchCat] = useState('')
  const [tempCat, setTempCat] = useState('todos')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      productosApi.listar({ estado: 'disponible' }),
      productosApi.listarCategorias()
    ])
      .then(([productsData, catsData]) => {
        setProductos(normalizeProductos(productsData))
        const list = [{ id: 'todos', label: 'Todos' }]
        if (Array.isArray(catsData)) {
          catsData.forEach(c => {
            list.push({ id: c.nombre, label: c.nombre })
          })
        }
        setCategorias(list)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = productos.filter((p) => {
    const matchCat = categoriaActiva === 'todos' || p.categoria === categoriaActiva
    const matchSearch = !search || p.nombre.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  // Conteo dinámico de productos por categoría (ignorando el filtro de categoría actual, pero respetando la búsqueda global)
  const catCounts = useMemo(() => {
    const counts = { todos: 0 }
    productos.forEach(p => {
      const matchSearch = !search || p.nombre.toLowerCase().includes(search.toLowerCase())
      if (matchSearch) {
        counts.todos++
        counts[p.categoria] = (counts[p.categoria] || 0) + 1
      }
    })
    return counts
  }, [productos, search])

  // Categorías filtradas dentro del modal
  const modalCategories = categorias.filter(c => 
    c.label.toLowerCase().includes(searchCat.toLowerCase())
  )

  const handleOpenModal = () => {
    setTempCat(categoriaActiva)
    setSearchCat('')
    setShowMobileFilters(true)
  }

  const handleApplyModal = () => {
    setCategoriaActiva(tempCat)
    setShowMobileFilters(false)
  }

  if (loading) return <div className="empty-state"><div className="empty-icon">⏳</div><p>Cargando productos...</p></div>
  if (error)   return <div className="empty-state"><div className="empty-icon">⚠️</div><p>Error: {error}</p></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Catálogo</h1>
          <p className="page-subtitle">{filtered.length} producto{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Categorías (Desktop) */}
      <div className="chips mb-6 desktop-only">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            className={`chip${categoriaActiva === cat.id ? ' active' : ''}`}
            onClick={() => setCategoriaActiva(cat.id)}
          >
            {cat.label} {catCounts[cat.id] !== undefined ? `(${catCounts[cat.id]})` : ''}
          </button>
        ))}
      </div>

      {/* Botón Filtros (Mobile) */}
      <div className="mobile-only">
        <div className="mobile-filter-bar" onClick={handleOpenModal}>
          <div className="filter-text">
            Categoría: <span style={{ color: 'var(--primary-600)' }}>
              {categorias.find(c => c.id === categoriaActiva)?.label || 'Todos'}
            </span>
          </div>
          <div className="filter-icon">
            <Filter size={18} />
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      {filtered.length > 0 ? (
        <div className="products-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3 style={{ color: 'var(--text-secondary)' }}>No se encontraron productos</h3>
          <p>Intenta con otra búsqueda o categoría</p>
        </div>
      )}

      {/* Modal Bottom Sheet para móvil */}
      {showMobileFilters && (
        <div className="modal-overlay mobile-only flex" onClick={() => setShowMobileFilters(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ width: '100%', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Filtrar por categoría</h2>
              <button 
                onClick={() => setShowMobileFilters(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={24} />
              </button>
            </div>

            <div className="search-wrapper" style={{ maxWidth: '100%' }}>
              <SearchIcon size={16} className="search-icon" />
              <input
                className="search-input"
                type="text"
                placeholder="Buscar categoría..."
                value={searchCat}
                onChange={e => setSearchCat(e.target.value)}
              />
            </div>

            <div className="category-list">
              {modalCategories.length > 0 ? modalCategories.map((cat) => {
                const isSelected = tempCat === cat.id
                return (
                  <div 
                    key={cat.id} 
                    className={`category-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setTempCat(cat.id)}
                  >
                    <div className="cat-name">
                      {isSelected ? <Check size={18} /> : <div style={{ width: 18 }} />}
                      {cat.label}
                    </div>
                    <div className="cat-count">{catCounts[cat.id] || 0}</div>
                  </div>
                )
              }) : (
                <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No hay categorías que coincidan.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn" 
                style={{ flex: 1, justifyContent: 'center', background: 'var(--gray-100)' }}
                onClick={() => setTempCat('todos')}
              >
                Limpiar
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 2, justifyContent: 'center' }}
                onClick={handleApplyModal}
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Normalizar producto del backend ─────────────────── */
function normalizeProductos(data) {
  return (data || []).map((p) => ({
    id:          p.id_producto,
    nombre:      p.nombre,
    descripcion: p.descripcion || '',
    precio:      parseFloat(p.precio),
    stock:       p.stock,
    estado:      p.estado,
    categoria:   inferCategoria(p),
    emoji:       inferEmoji(p.nombre, p.tipos_negocio?.nombre),
    imagen_url:  p.imagen_url,
    vendedor:    p.usuarios?.nombre || 'Establecimiento',
  }))
}

function inferCategoria(p) {
  return p.tipos_negocio?.nombre || 'Otros'
}

function inferEmoji(nombre, categoria) {
  const cat = (categoria || '').toLowerCase()
  const n = (nombre || '').toLowerCase()

  // 1. Check specific product keywords first
  if (n.includes('hambur'))  return '🍔'
  if (n.includes('papa'))    return '🍟'
  if (n.includes('refresc')) return '🥤'
  if (n.includes('agua'))    return '💧'
  if (n.includes('pastel') || n.includes('postre')) return '🍰'
  if (n.includes('browni'))  return '🍫'
  if (n.includes('alita'))   return '🍗'
  if (n.includes('hot dog') || n.includes('hotdog')) return '🌭'
  if (n.includes('pizza'))   return '🍕'
  if (n.includes('taco'))    return '🌮'

  // 2. Check category mapping
  if (cat.includes('alimento'))   return '🍔'
  if (cat.includes('moda') || cat.includes('ropa'))       return '👕'
  if (cat.includes('electrónica') || cat.includes('electronica')) return '💻'
  if (cat.includes('hogar'))      return '🏠'
  if (cat.includes('belleza') || cat.includes('salud'))    return '🧴'
  if (cat.includes('mascota'))    return '🐶'
  if (cat.includes('deporte'))    return '⚽'
  if (cat.includes('automotriz') || cat.includes('auto')) return '🚗'
  if (cat.includes('servicio'))   return '🛠️'
  if (cat.includes('educación') || cat.includes('educacion'))  return '📚'
  if (cat.includes('artesanía') || cat.includes('artesania'))  return '🎨'

  return '📦'
}

export { normalizeProductos, inferEmoji }
