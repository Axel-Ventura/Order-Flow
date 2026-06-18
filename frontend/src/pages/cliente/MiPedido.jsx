import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../data/mockData'

export default function MiPedido() {
  const { items, removeFromCart, updateQty, clearCart, subtotal, envio, total } = useCart()
  const navigate = useNavigate()
  const [instrucciones, setInstrucciones] = useState('')
  const [confirmado, setConfirmado] = useState(false)

  if (confirmado) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', gap: 16 }}>
        <div style={{ fontSize: '4rem' }}>✅</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>¡Pedido confirmado!</h2>
        <p>Tu pedido ha sido recibido y está siendo procesado.</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button className="btn btn-secondary" onClick={() => navigate('/history')}>
            Ver mis pedidos
          </button>
          <button className="btn btn-primary" onClick={() => { clearCart(); navigate('/'); }}>
            Seguir comprando
          </button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <ShoppingBag size={48} style={{ opacity: 0.3 }} />
        <h3 style={{ color: 'var(--text-secondary)' }}>Tu carrito está vacío</h3>
        <p>Agrega productos del catálogo para hacer tu pedido</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>
          Ver catálogo
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        className="btn btn-ghost mb-4"
        style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 0 }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        Seguir comprando
      </button>

      <div className="page-header">
        <div>
          <h1 className="page-title">Mi Pedido</h1>
          <p className="page-subtitle">{items.length} producto{items.length !== 1 ? 's' : ''} en tu carrito</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
        {/* Items */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Productos</span>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={clearCart}>
              <Trash2 size={14} /> Vaciar
            </button>
          </div>
          <div className="card-body" style={{ padding: '8px 20px' }}>
            {items.map(({ producto, cantidad }) => (
              <div key={producto.id} className="cart-item">
                <div className="cart-item-img">{producto.emoji}</div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{producto.nombre}</div>
                  <div className="cart-item-price">${producto.precio.toFixed(2)} c/u</div>
                </div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => updateQty(producto.id, cantidad - 1)}>
                    <Minus size={13} />
                  </button>
                  <div className="qty-value">{cantidad}</div>
                  <button className="qty-btn" onClick={() => updateQty(producto.id, cantidad + 1)}>
                    <Plus size={13} />
                  </button>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: 60, textAlign: 'right' }}>
                  ${(producto.precio * cantidad).toFixed(2)}
                </div>
                <button
                  className="btn btn-ghost"
                  style={{ color: 'var(--danger)', padding: 6 }}
                  onClick={() => removeFromCart(producto.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Instrucciones de entrega</span>
            </div>
            <div className="card-body">
              <textarea
                className="form-textarea"
                placeholder="Ej: Timbrar 2 veces, sin cebolla, etc."
                value={instrucciones}
                onChange={(e) => setInstrucciones(e.target.value)}
                style={{ minHeight: 80 }}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Resumen del pedido</span>
            </div>
            <div className="card-body">
              <div className="summary-box">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Envío</span>
                  <span>{formatCurrency(envio)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                className="btn btn-primary btn-full btn-lg"
                style={{ marginTop: 16 }}
                onClick={() => setConfirmado(true)}
              >
                Confirmar Pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
