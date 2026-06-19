import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
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

      {/* Categorías */}
      <div className="chips mb-6">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            className={`chip${categoriaActiva === cat.id ? ' active' : ''}`}
            onClick={() => setCategoriaActiva(cat.id)}
          >
            {cat.label}
          </button>
        ))}
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
