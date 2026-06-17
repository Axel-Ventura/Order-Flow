function Pedidos() {
  return (
    <div>
      <h2>Gestión de Pedidos</h2>

      <input type="text" placeholder="Buscar por cliente o pedido" />
      <br /><br />

      <select>
        <option>Todos los estados</option>
        <option>Pendiente</option>
        <option>En Proceso</option>
        <option>Completado</option>
        <option>Cancelado</option>
      </select>

      <h3>Lista de pedidos</h3>

      <div>
        <p>Pedido #001 - Cliente: Juan - Estado: Pendiente</p>
        <select>
          <option>Pendiente</option>
          <option>En Proceso</option>
          <option>Completado</option>
          <option>Cancelado</option>
        </select>
      </div>

      <div>
        <p>Pedido #002 - Cliente: Ana - Estado: En Proceso</p>
        <select>
          <option>En Proceso</option>
          <option>Pendiente</option>
          <option>Completado</option>
          <option>Cancelado</option>
        </select>
      </div>
    </div>
  )
}

export default Pedidos