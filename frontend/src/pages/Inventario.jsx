function Inventario() {
  return (
    <div>
      <h2>Inventario y Productos</h2>

      <h3>Agregar producto</h3>

      <input type="text" placeholder="Nombre del producto" />
      <br /><br />

      <input type="number" placeholder="Precio" />
      <br /><br />

      <input type="number" placeholder="Stock" />
      <br /><br />

      <input type="text" placeholder="Categoría" />
      <br /><br />

      <button>Guardar producto</button>

      <h3>Lista de productos</h3>

      <div>
        <p>Producto 1 - $100 - Stock: 20 - Disponible</p>
        <button>Editar</button>
        <button>Desactivar</button>
      </div>

      <div>
        <p>Producto 2 - $200 - Stock: 3 - Stock bajo</p>
        <button>Editar</button>
        <button>Desactivar</button>
      </div>

      <div>
        <p>Producto 3 - $150 - Stock: 0 - Agotado</p>
        <button>Editar</button>
        <button>Desactivar</button>
      </div>
    </div>
  )
}

export default Inventario