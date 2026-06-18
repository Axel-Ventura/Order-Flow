import LayoutCliente from "../components/LayoutCliente";
import { ArrowLeft, Clock, ChefHat, CheckCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";

function SeguimientoPedido({ pedidosCliente = [], totalProductos }) {
  const { id } = useParams();

  const pedido = pedidosCliente.find((p) => p.id === id);

  return (
    <LayoutCliente totalProductos={totalProductos}>
      <div className="tracking-page">
        <Link to="/history" className="back-btn">
          <ArrowLeft size={21} /> Volver a mis pedidos
        </Link>

        <div className="tracking-card">
          <div className="tracking-header">
            <div>
              <h2>Pedido {pedido?.id || id}</h2>
              <p>{pedido?.fecha || "18 de junio de 2026"}</p>
            </div>

            <span>EN PROCESO</span>
          </div>

          <div className="timeline">
            <div className="timeline-item done">
              <div className="timeline-icon">
                <Clock size={28} />
              </div>
              <div>
                <h3>Pendiente</h3>
                <p>Orden recibida</p>
              </div>
            </div>

            <div className="timeline-line active-line"></div>

            <div className="timeline-item done">
              <div className="timeline-icon">
                <ChefHat size={28} />
              </div>
              <div>
                <h3>En Proceso</h3>
                <p>Preparando tu pedido</p>
              </div>
            </div>

            <div className="timeline-line"></div>

            <div className="timeline-item pending">
              <div className="timeline-icon">
                <CheckCircle size={28} />
              </div>
              <div>
                <h3>Completado</h3>
                <p>Listo para entregar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutCliente>
  );
}

export default SeguimientoPedido;