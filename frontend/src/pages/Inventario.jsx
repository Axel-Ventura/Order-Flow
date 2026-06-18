import { useState } from "react";
import LayoutAdmin from "../components/LayoutAdmin";
import { Plus, Edit, Trash2 } from "lucide-react";

const productosBase = [
  { id: 1, nombre: "Hamburguesa Gourmet", categoria: "Comida", precio: 12.99, stock: 25 },
  { id: 2, nombre: "Café Latte Art", categoria: "Bebidas", precio: 4.50, stock: 8 },
  { id: 3, nombre: "Ensalada Fresca", categoria: "Comida", precio: 9.50, stock: 0 },
  { id: 4, nombre: "Pastel de Chocolate", categoria: "Postres", precio: 6.99, stock: 12 },
];

function Inventario() {
  const [productos, setProductos] = useState(productosBase);

  const agregarProducto = () => {
    const nuevo = {
      id: Date.now(),
      nombre: "Nuevo Producto",
      categoria: "Comida",
      precio: 0,
      stock: 1,
    };

    setProductos([...productos, nuevo]);
  };

  const editarProducto = (id) => {
    const nuevoNombre = prompt("Nuevo nombre del producto:");

    if (!nuevoNombre) return;

    setProductos(
      productos.map((p) =>
        p.id === id ? { ...p, nombre: nuevoNombre } : p
      )
    );
  };

  const eliminarProducto = (id) => {
    const confirmar = confirm("¿Seguro que deseas eliminar este producto?");

    if (confirmar) {
      setProductos(productos.filter((p) => p.id !== id));
    }
  };

  return (
    <LayoutAdmin>
      <div className="admin-page-header">
        <div>
          <h1>Inventario</h1>
          <p>Administra los productos disponibles.</p>
        </div>

        <button className="primary-admin-btn" onClick={agregarProducto}>
          <Plus size={18} /> Agregar Producto
        </button>
      </div>

      <div className="stats-grid inventory-stats">
        <div className="stat-card">
          <h3>Productos Totales</h3>
          <span>{productos.length}</span>
        </div>

        <div className="stat-card">
          <h3>Stock Bajo</h3>
          <span>{productos.filter((p) => p.stock > 0 && p.stock <= 10).length}</span>
        </div>

        <div className="stat-card">
          <h3>Agotados</h3>
          <span>{productos.filter((p) => p.stock === 0).length}</span>
        </div>
      </div>

      <div className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Existencias</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td className="blue-text">{producto.nombre}</td>
                <td>{producto.categoria}</td>
                <td>${producto.precio.toFixed(2)}</td>
                <td>{producto.stock}</td>
                <td>
                  {producto.stock === 0 ? (
                    <span className="admin-status agotado">Agotado</span>
                  ) : producto.stock <= 10 ? (
                    <span className="admin-status bajo">Stock Bajo</span>
                  ) : (
                    <span className="admin-status disponible">Disponible</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => editarProducto(producto.id)}>
                      <Edit size={16} />
                    </button>

                    <button className="danger-btn" onClick={() => eliminarProducto(producto.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LayoutAdmin>
  );
}

export default Inventario;