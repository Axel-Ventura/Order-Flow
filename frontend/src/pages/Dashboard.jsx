import LayoutAdmin from "../components/LayoutAdmin";

function Dashboard() {
  return (
    <LayoutAdmin>
      <div className="dashboard-admin">

        <h1>Dashboard</h1>
        <p>Resumen general del negocio</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Pedidos Pendientes</h3>
            <span>2</span>
          </div>

          <div className="stat-card">
            <h3>En Proceso</h3>
            <span>2</span>
          </div>

          <div className="stat-card">
            <h3>Completados</h3>
            <span>2</span>
          </div>

          <div className="stat-card">
            <h3>Productos Registrados</h3>
            <span>10</span>
          </div>
        </div>

        <div className="admin-card">
          <h2>Pedidos Recientes</h2>

          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>ORD-001</td>
                <td>Carlos Mendoza</td>
                <td>2026-06-14</td>
                <td>Pendiente</td>
              </tr>

              <tr>
                <td>ORD-002</td>
                <td>Ana Torres</td>
                <td>2026-06-13</td>
                <td>En Proceso</td>
              </tr>

              <tr>
                <td>ORD-003</td>
                <td>Roberto Jiménez</td>
                <td>2026-06-12</td>
                <td>Completado</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </LayoutAdmin>
  );
}

export default Dashboard;