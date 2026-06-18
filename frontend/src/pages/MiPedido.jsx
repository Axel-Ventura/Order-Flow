import LayoutCliente from "../components/LayoutCliente";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

function MiPedido({
  carrito = [],
  eliminarDelCarrito = () => {},
  totalProductos = 0,
  enviarPedido = () => {},
}) {
  const subtotal = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  return (
    <LayoutCliente totalProductos={totalProductos}>
      <div className="cart-page">
        <div className="cart-left">
          <Link to="/catalogo" className="back-btn">
            <ArrowLeft size={21} /> Seguir comprando
          </Link>

          {carrito.length === 0 ? (
            <div className="clean-cart-item">
              <div className="clean-cart-info">
                <h3>Tu pedido está vacío</h3>
                <span>Agrega productos desde el catálogo.</span>
              </div>
            </div>
          ) : (
            carrito.map((item) => (
              <div className="clean-cart-item" key={item.id}>
                <img src={item.imagen} alt={item.nombre} />

                <div className="clean-cart-info">
                  <h3>{item.nombre}</h3>
                  <p>${Number(item.precio).toFixed(2)}</p>
                  <span>Cantidad: {item.cantidad}</span>
                </div>

                <button
                  className="trash-clean-btn"
                  onClick={() => eliminarDelCarrito(item.id)}
                >
                  <Trash2 size={20} />
                </button>

                <strong>
                  ${(Number(item.precio) * item.cantidad).toFixed(2)}
                </strong>
              </div>
            ))
          )}
        </div>

        <div className="cart-right">
          <h1>Mi Pedido</h1>

          <div className="clean-summary">
            <h2>Resumen</h2>

            <div className="summary-row">
              <span>Subtotal ({totalProductos} productos)</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <div className="summary-row">
              <span>Costo de envío</span>
              <strong className="free">Gratis</strong>
            </div>

            <hr />

            <div className="summary-total-clean">
              <div>
                <h3>Total a pagar</h3>
                <p>El pago se realizará al recibir</p>
              </div>

              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <button
              className="send-order-btn"
              onClick={enviarPedido}
              disabled={carrito.length === 0}
            >
              Enviar Pedido
            </button>
          </div>
        </div>
      </div>
    </LayoutCliente>
  );
}

export default MiPedido;