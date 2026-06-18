import LayoutCliente from "../components/LayoutCliente";
import { Box, Eye } from "lucide-react";
import { Link } from "react-router-dom";

function HistorialPedidos({ pedidosCliente = [], totalProductos }) {
  return (
    <LayoutCliente totalProductos={totalProductos}>
      <div className="page-title">
        <div className="title-icon">
          <Box size={24} />
        </div>
        <h1>Historial de Pedidos</h1>
      </div>

      <div className="orders-table">
        <div className="orders-header">
          <span>PEDIDO</span>
          <span>FECHA</span>
          <span>PRODUCTOS</span>
          <span>ESTADO</span>
          <span>ACCIÓN</span>
        </div>

        {pedidosCliente.length === 0 ? (
          <div className="orders-row">
            <strong>No hay pedidos</strong>
            <span>-</span>
            <span>Realiza un pedido desde el catálogo</span>
            <span>-</span>
            <span>-</span>
          </div>
        ) : (
          pedidosCliente.map((pedido) => {
            const totalCantidad = pedido.productos.reduce(
              (total, item) => total + item.cantidad,
              0
            );

            const resumen = pedido.productos
              .map((item) => `${item.cantidad}x ${item.nombre}`)
              .join(", ");

            return (
              <div className="orders-row" key={pedido.id}>
                <strong>{pedido.id}</strong>
                <span>{pedido.fecha}</span>

                <div>
                  <strong>{totalCantidad} productos</strong>
                  <p>{resumen}</p>
                </div>

                <span className="status process">{pedido.estado}</span>

                <Link className="details-btn" to={`/tracking/${pedido.id}`}>
                  <Eye size={17} /> Detalles
                </Link>
              </div>
            );
          })
        )}
      </div>
    </LayoutCliente>
  );
}

export default HistorialPedidos;