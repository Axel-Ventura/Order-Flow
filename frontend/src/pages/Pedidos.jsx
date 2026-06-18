import OrderFlowLayout, { CubeIcon } from '../components/OrderFlowLayout.jsx'

const orders = [
  {
    id: 'ORD-001',
    date: '2026-06-10',
    count: '3 productos',
    products: '2x Hamburguesa Gourmet, 1x Ca...',
    status: 'Completado',
    tone: 'complete',
  },
  {
    id: 'ORD-002',
    date: '2026-06-12',
    count: '2 productos',
    products: '1x Ensalada Fresca, 1x Café Latte...',
    status: 'En Proceso',
    tone: 'progress',
  },
]

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.3-5 9.5-5 9.5 5 9.5 5-3.3 5-9.5 5-9.5-5-9.5-5Z" />
      <path d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    </svg>
  )
}

function Pedidos({ cartCount, onLogout, onNavigate, onViewOrder }) {
  return (
    <OrderFlowLayout
      activeModule="pedidos"
      cartCount={cartCount}
      onLogout={onLogout}
      onNavigate={onNavigate}
    >
      <div className="orders-content">
        <header className="orders-title">
          <span className="orders-title-icon">
            <CubeIcon />
          </span>
          <h1>Historial de Pedidos</h1>
        </header>

        <section className="orders-table-card" aria-label="Historial de pedidos">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td className="order-date">{order.date}</td>
                  <td>
                    <strong>{order.count}</strong>
                    <span>{order.products}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${order.tone}`}>{order.status}</span>
                  </td>
                  <td>
                    <button
                      className="details-button"
                      type="button"
                      onClick={() => onViewOrder(order)}
                    >
                      <EyeIcon />
                      Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </OrderFlowLayout>
  )
}

export default Pedidos
