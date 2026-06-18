import OrderFlowLayout from '../components/OrderFlowLayout.jsx'

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 12 3 3 7-7" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4v3" />
      <path d="M17 4v3" />
      <path d="M5 8h14" />
      <path d="M5.5 6.5h13v13h-13z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function ConfirmacionPedido({ cartCount, order, onLogout, onNavigate }) {
  const currentOrder = order ?? {
    id: 'ORD-6145',
    date: '17 de junio de 2026',
    status: 'Pendiente',
  }

  return (
    <OrderFlowLayout
      activeModule="confirmacion"
      cartCount={cartCount}
      onLogout={onLogout}
      onNavigate={onNavigate}
    >
      <section className="order-confirmation" aria-label="Pedido enviado">
        <span className="confirmation-check">
          <CheckIcon />
        </span>
        <h1>¡Pedido Enviado!</h1>
        <p>Hemos recibido tu solicitud y pronto comenzaremos a prepararla.</p>

        <div className="confirmation-details">
          <div className="confirmation-row main">
            <span>Número de Pedido</span>
            <strong>{currentOrder.id}</strong>
          </div>
          <div className="confirmation-row">
            <span>
              <CalendarIcon />
              Fecha
            </span>
            <strong>{currentOrder.date}</strong>
          </div>
          <div className="confirmation-row">
            <span>
              <ClockIcon />
              Estado
            </span>
            <strong className="pending-text">{currentOrder.status.toUpperCase()}</strong>
          </div>
        </div>

        <button className="check-status-button" type="button" onClick={() => onNavigate('seguimiento')}>
          Consultar Estado
        </button>
        <button className="home-outline-button" type="button" onClick={() => onNavigate('catalogo')}>
          Volver al Inicio
        </button>
      </section>
    </OrderFlowLayout>
  )
}

export default ConfirmacionPedido
