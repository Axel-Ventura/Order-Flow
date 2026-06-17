function Catalogo() {
  return (
    <div>
      <h2>Catálogo de Productos</h2>

      <input type="text" placeholder="Buscar producto" />

      <br />
      <br />

      <select>
        <option>Todas las categorías</option>
        <option>Comida</option>
        <option>Bebidas</option>
        <option>Tecnología</option>
      </select>

      <h3>Productos Destacados</h3>

      <div>
        <h4>Producto 1</h4>
        <p>$100</p>
        <button>Agregar al carrito</button>
      </div>

      <div>
        <h4>Producto 2</h4>
        <p>$200</p>
        <button>Agregar al carrito</button>
      </div>
    </div>
  )
}

export default Catalogo