import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Pedidos from './pages/Pedidos'
import AgregarPedido from './pages/AgregarPedido'
import EditarPedido from './pages/EditarPedido'
import Catalogo from './pages/Catalogo'
import DetalleProducto from './pages/DetalleProducto'
import MiPedido from './pages/MiPedido'
import ConfirmacionPedido from './pages/ConfirmacionPedido'
import HistorialPedidos from './pages/HistorialPedidos'
import PerfilCliente from './pages/PerfilCliente'
import Inventario from './pages/Inventario'

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>OrderFlow</h1>

        <nav>
          <Link to="/">Login</Link>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/detalle-producto">Detalle Producto</Link>
          <Link to="/mi-pedido">Mi Pedido</Link>
          <Link to="/confirmacion-pedido">Confirmación</Link>
          <Link to="/historial">Historial</Link>
          <Link to="/perfil">Perfil</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/pedidos">Pedidos</Link>
          <Link to="/inventario">Inventario</Link>
          <Link to="/agregar-pedido">Agregar Pedido</Link>
          <Link to="/editar-pedido">Editar Pedido</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/detalle-producto" element={<DetalleProducto />} />
          <Route path="/mi-pedido" element={<MiPedido />} />
          <Route path="/confirmacion-pedido" element={<ConfirmacionPedido />} />
          <Route path="/historial" element={<HistorialPedidos />} />
          <Route path="/perfil" element={<PerfilCliente />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/agregar-pedido" element={<AgregarPedido />} />
          <Route path="/editar-pedido" element={<EditarPedido />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
