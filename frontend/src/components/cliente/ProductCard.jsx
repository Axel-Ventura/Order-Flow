import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { getBadgeClass } from '../../data/mockData'

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
        {agotado && (
          <span className={`badge badge-danger`} style={{ marginBottom: 8, fontSize: '0.7rem' }}>
            Agotado
          </span>
        )}
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
