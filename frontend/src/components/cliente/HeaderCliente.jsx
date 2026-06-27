import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, Menu } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export default function HeaderCliente({ onSearch, searchValue, onMenuToggle }) {
  const { totalItems } = useCart()
  const navigate = useNavigate()

  return (
    <header className="main-header">
      {/* Hamburger — visible sólo en móvil via CSS */}
      <button
        className="hamburger-btn"
        onClick={onMenuToggle}
        aria-label="Abrir menú"
      >
        <Menu size={22} />
      </button>

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
        style={{ position: 'relative', gap: 8, flexShrink: 0 }}
        onClick={() => navigate('/cart')}
      >
        <ShoppingCart size={18} />
        <span className="cart-label">Carrito</span>
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
