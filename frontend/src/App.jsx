import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Catalogo from "./pages/Catalogo";
import HistorialPedidos from "./pages/HistorialPedidos";
import PerfilCliente from "./pages/PerfilCliente";
import MiPedido from "./pages/MiPedido";
import SeguimientoPedido from "./pages/SeguimientoPedido";

import Dashboard from "./pages/Dashboard";
import Pedidos from "./pages/Pedidos";
import Inventario from "./pages/Inventario";
import Clientes from "./pages/Clientes";
import Reportes from "./pages/Reportes";
import PerfilAdmin from "./pages/PerfilAdmin";
import Configuracion from "./pages/Configuracion";

import "./App.css";

function App() {
  const [carrito, setCarrito] = useState([]);
  const [pedidosCliente, setPedidosCliente] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((items) => {
      const existe = items.find((item) => item.id === producto.id);

      if (existe) {
        return items.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...items, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((items) => items.filter((item) => item.id !== id));
  };

  const enviarPedido = () => {
    if (carrito.length === 0) return;

    const nuevoPedido = {
      id: `ORD-${String(pedidosCliente.length + 1).padStart(3, "0")}`,
      fecha: new Date().toISOString().slice(0, 10),
      productos: carrito,
      estado: "En Proceso",
    };

    setPedidosCliente([nuevoPedido, ...pedidosCliente]);
    setCarrito([]);
    alert("Pedido enviado correctamente");
  };

  const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/catalogo" />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/catalogo"
          element={
            <Catalogo
              agregarAlCarrito={agregarAlCarrito}
              totalProductos={totalProductos}
            />
          }
        />

        <Route
          path="/pedido"
          element={
            <MiPedido
              carrito={carrito}
              eliminarDelCarrito={eliminarDelCarrito}
              totalProductos={totalProductos}
              enviarPedido={enviarPedido}
            />
          }
        />

        <Route
          path="/history"
          element={
            <HistorialPedidos
              pedidosCliente={pedidosCliente}
              totalProductos={totalProductos}
            />
          }
        />

        <Route
          path="/tracking/:id"
          element={
            <SeguimientoPedido
              pedidosCliente={pedidosCliente}
              totalProductos={totalProductos}
            />
          }
        />

        <Route path="/profile" element={<PerfilCliente totalProductos={totalProductos} />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/pedidos" element={<Pedidos />} />
        <Route path="/admin/inventario" element={<Inventario />} />
        <Route path="/admin/clientes" element={<Clientes />} />
        <Route path="/admin/historial" element={<Reportes />} />
        <Route path="/admin/configuracion" element={<Configuracion />} />
        <Route path="/admin/perfil" element={<PerfilAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;