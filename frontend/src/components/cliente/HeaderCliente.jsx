import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Search } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export default function HeaderCliente({ onSearch, searchValue }) {
  const { totalItems } = useCart()
  const navigate = useNavigate()

  return (
    <header className="main-header">
      <div className="search-wrapper">
        <Search size={16} className="search-icon" />
        <input
          className="search-input"
          type="text"
          placeholder="Buscar productos..."
          value={searchValue || ''}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      <button
        className="btn btn-secondary"
        style={{ position: 'relative', gap: 8 }}
        onClick={() => navigate('/cart')}
      >
        <ShoppingCart size={18} />
        Carrito
        {totalItems > 0 && (
          <span style={{
            position: 'absolute',
            top: -6, right: -6,
            background: 'var(--primary-600)',
            color: 'white',
            borderRadius: '9999px',
            fontSize: '0.7rem',
            fontWeight: 700,
            width: 20, height: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {totalItems}
          </span>
        )}
      </button>
    </header>
  )
}
