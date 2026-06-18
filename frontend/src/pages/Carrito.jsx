import OrderFlowLayout, { CartIcon } from '../components/OrderFlowLayout.jsx'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H5" />
      <path d="m12 5-7 7 7 7" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6.5 7l.9 13h9.2l.9-13" />
      <path d="M9 7V4.8h6V7" />
    </svg>
  )
}

function getPrice(product) {
  return Number(product.price.replace('$', ''))
}

function formatPrice(value) {
  return `$${value.toFixed(2)}`
}

function EmptyCart({ onNavigate }) {
  return (
    <section className="empty-cart" aria-label="Carrito vacío">
      <span className="empty-cart-icon">
        <CartIcon />
      </span>
      <h1>Tu pedido está vacío</h1>
      <p>Parece que aún no has agregado ningún producto a tu pedido.</p>
      <button type="button" onClick={() => onNavigate('catalogo')}>
        Explorar Catálogo
      </button>
    </section>
  )
}

function CartItem({ item, onRemove }) {
  const lineTotal = getPrice(item) * item.quantity

  return (
    <article className="cart-item">
      <img src={item.image} alt={item.name} />
      <div className="cart-item-info">
        <h2>{item.name}</h2>
        <strong>{item.price}</strong>
        <span>Cantidad: {item.quantity}</span>
      </div>
      <button className="cart-remove" type="button" aria-label={`Eliminar ${item.name}`} onClick={() => onRemove(item.id)}>
        <TrashIcon />
      </button>
      <strong className="cart-line-total">{formatPrice(lineTotal)}</strong>
    </article>
  )
}

function FilledCart({ items, onNavigate, onRemove, onSendOrder }) {
  const subtotal = items.reduce((total, item) => total + getPrice(item) * item.quantity, 0)
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="cart-content">
      <button className="continue-shopping" type="button" onClick={() => onNavigate('catalogo')}>
        <BackIcon />
        Seguir comprando
      </button>

      <div className="cart-layout">
        <section className="cart-items" aria-label="Productos en mi pedido">
          {items.map((item) => (
            <CartItem item={item} key={item.id} onRemove={onRemove} />
          ))}
        </section>

        <aside className="cart-summary" aria-label="Resumen del pedido">
          <h1>Mi Pedido</h1>
          <div className="summary-card">
            <h2>Resumen</h2>
            <div className="summary-row">
              <span>Subtotal ({totalItems} productos)</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Costo de envío</span>
              <strong className="free-shipping">Gratis</strong>
            </div>
            <div className="summary-total">
              <div>
                <span>Total a pagar</span>
                <small>El pago se realizará al recibir</small>
              </div>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <button type="button" onClick={onSendOrder}>
              Enviar Pedido
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Carrito({ cartCount, items, onLogout, onNavigate, onRemove, onSendOrder }) {
  return (
    <OrderFlowLayout
      activeModule="carrito"
      cartCount={cartCount}
      onLogout={onLogout}
      onNavigate={onNavigate}
    >
      {items.length === 0 ? (
        <EmptyCart onNavigate={onNavigate} />
      ) : (
        <FilledCart
          items={items}
          onNavigate={onNavigate}
          onRemove={onRemove}
          onSendOrder={onSendOrder}
        />
      )}
    </OrderFlowLayout>
  )
}

export default Carrito
