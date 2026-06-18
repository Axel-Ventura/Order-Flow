import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { productos as allProductos, categorias } from '../../data/mockData'
import ProductCard from '../../components/cliente/ProductCard'

export default function Catalogo() {
  const { search } = useOutletContext?.() || {}
  const [categoriaActiva, setCategoriaActiva] = useState('todos')

  const filtered = allProductos.filter((p) => {
    const matchCat = categoriaActiva === 'todos' || p.categoria === categoriaActiva
    const matchSearch = !search || p.nombre.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

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
