function Dashboard() {
  return (
    <div>
      <h2>Panel de Control del Vendedor</h2>

      <h3>Resumen de pedidos</h3>
      <p>Pendientes: 3</p>
      <p>En proceso: 2</p>
      <p>Completados: 5</p>

      <h3>Pedidos recientes</h3>
      <ul>
        <li>Pedido #001 - Cliente: Juan - Pendiente</li>
        <li>Pedido #002 - Cliente: Ana - En Proceso</li>
        <li>Pedido #003 - Cliente: Luis - Completado</li>
      </ul>
    </div>
  )
}

export default Dashboard