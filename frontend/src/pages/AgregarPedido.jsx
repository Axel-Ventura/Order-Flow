function AgregarPedido() {
  return (
    <div>
      <h2>Agregar Pedido</h2>

      <input type="text" placeholder="Nombre del cliente" />
      <br /><br />

      <input type="text" placeholder="Producto" />
      <br /><br />

      <input type="number" placeholder="Cantidad" />
      <br /><br />

      <select>
        <option>Pendiente</option>
        <option>En Proceso</option>
        <option>Completado</option>
        <option>Cancelado</option>
      </select>

      <br /><br />

      <textarea placeholder="Notas del pedido"></textarea>
      <br /><br />

      <button>Guardar pedido</button>
    </div>
  )
}

export default AgregarPedido