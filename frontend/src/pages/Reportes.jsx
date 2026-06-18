import LayoutAdmin from "../components/LayoutAdmin";

function Reportes() {
  return (
    <LayoutAdmin>
      <div className="admin-page-header">
        <div>
          <h1>Historial de Pedidos</h1>
          <p>Registro de todos los pedidos completados.</p>
        </div>

        <span className="completed-count">2 completados</span>
      </div>

      <div className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Productos</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="blue-text">ORD-003</td>
              <td>Roberto Jiménez</td>
              <td>2026-06-12</td>
              <td><span className="admin-status completado">Completado</span></td>
              <td>Teclado Mecánico ×1, Webcam HD ×1</td>
              <td><strong>$159.98</strong></td>
            </tr>

            <tr>
              <td className="blue-text">ORD-004</td>
              <td>María López</td>
              <td>2026-06-11</td>
              <td><span className="admin-status completado">Completado</span></td>
              <td>Tablet 10" ×1, Mouse Inalámbrico ×1</td>
              <td><strong>$529.98</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </LayoutAdmin>
  );
}

export default Reportes;