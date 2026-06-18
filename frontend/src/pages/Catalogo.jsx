import { useState } from "react";
import LayoutCliente from "../components/LayoutCliente";
import { Plus, Star } from "lucide-react";

const productos = [
  {
    id: 1,
    nombre: "Hamburguesa Gourmet",
    precio: 12.99,
    descripcion: "Carne de res premium, queso cheddar, tocino, lechuga, tomate y salsa especial.",
    categoria: "Comida",
    imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
  },
  {
    id: 2,
    nombre: "Café Latte Art",
    precio: 4.5,
    descripcion: "Espresso doble con leche vaporizada y un diseño único.",
    categoria: "Bebidas",
    imagen: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
  },
  {
    id: 3,
    nombre: "Ensalada Fresca",
    precio: 9.5,
    descripcion: "Mix de lechugas, tomate cherry, pepino, aguacate y aderezo de la casa.",
    categoria: "Comida",
    imagen: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
  },
  {
    id: 4,
    nombre: "Rebanada de Pastel de Chocolate",
    precio: 6.99,
    descripcion: "Pastel de chocolate oscuro con capas de ganache y fresas frescas.",
    categoria: "Postres",
    imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
  },
];

function Catalogo({ agregarAlCarrito, totalProductos }) {
  const [categoria, setCategoria] = useState("Todos");

  const filtrados =
    categoria === "Todos"
      ? productos
      : productos.filter((p) => p.categoria === categoria);

  return (
    <LayoutCliente totalProductos={totalProductos}>
      <div className="filters">
        {["Todos", "Comida", "Bebidas", "Postres"].map((cat) => (
          <button
            key={cat}
            className={categoria === cat ? "filter active-filter" : "filter"}
            onClick={() => setCategoria(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <h2 className="section-title">
        {categoria === "Todos" ? (
          <>
            <Star size={23} className="star" /> Productos Destacados
          </>
        ) : (
          categoria
        )}
      </h2>

      <div className="product-grid">
        {filtrados.map((producto) => (
          <div className="product-card" key={producto.id}>
            <img src={producto.imagen} alt={producto.nombre} />

            <div className="product-body">
              <div className="product-head">
                <h3>{producto.nombre}</h3>
                <strong>${producto.precio.toFixed(2)}</strong>
              </div>

              <p>{producto.descripcion}</p>

              <button
                className="add-btn"
                onClick={() => agregarAlCarrito(producto)}
              >
                <Plus size={20} /> Agregar al Pedido
              </button>
            </div>
          </div>
        ))}
      </div>
    </LayoutCliente>
  );
}

export default Catalogo;