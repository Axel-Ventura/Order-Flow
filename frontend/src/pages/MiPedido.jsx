import { useNavigate } from 'react-router-dom'

function MiPedido() {
  const navigate = useNavigate()

  return (
    <div>
      <h2>Mi Pedido / Carrito</h2>

      <p>Producto 1 - $100</p>
      <p>Producto 2 - $200</p>

      <h3>Total: $300</h3>

      <button onClick={() => navigate('/confirmacion-pedido')}>
        Confirmar pedido
      </button>
    </div>
  )
}

export default MiPedido