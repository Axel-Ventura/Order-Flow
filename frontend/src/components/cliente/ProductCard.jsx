import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function ProductCard({ producto }) {
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const agotado = producto.estado === 'agotado'

  return (
    <div className="product-card">
      <div
        className="product-card-img"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate(`/product/${producto.id}`)}
        role="button"
        tabIndex={0}
      >
        <span>{producto.emoji}</span>
      </div>

      <div className="product-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 4 }}>
          <span style={{ fontSize: '0.7rem', background: 'var(--primary-50)', color: 'var(--primary-700)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
            🏬 {producto.vendedor}
          </span>
          {agotado && (
            <span className="badge badge-danger" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
              Agotado
            </span>
          )}
        </div>
        <div
          className="product-card-name"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/product/${producto.id}`)}
        >
          {producto.nombre}
        </div>
        <div className="product-card-desc">{producto.descripcion}</div>

        <div className="product-card-footer">
          <span className="product-price">
            ${producto.precio.toFixed(2)}
          </span>
          <button
            className="btn btn-primary btn-sm"
            disabled={agotado}
            onClick={() => addToCart(producto)}
          >
            + Agregar
          </button>
        </div>
      </div>
    </div>
  )
}
