import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// Layouts
import LayoutCliente from './components/cliente/LayoutCliente'
import LayoutAdmin from './components/admin/LayoutAdmin'

// Auth pages
import Login from './pages/Login'
import Registro from './pages/Registro'

// Cliente pages
import Catalogo from './pages/cliente/Catalogo'
import DetalleProducto from './pages/cliente/DetalleProducto'
import MiPedido from './pages/cliente/MiPedido'
import HistorialPedidos from './pages/cliente/HistorialPedidos'
import SeguimientoPedido from './pages/cliente/SeguimientoPedido'
import PerfilCliente from './pages/cliente/PerfilCliente'

// Admin pages
import Dashboard from './pages/admin/Dashboard'
import Pedidos from './pages/admin/Pedidos'
import Clientes from './pages/admin/Clientes'
import Inventario from './pages/admin/Inventario'
import Reportes from './pages/admin/Reportes'

// Protected route component
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, currentUser } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && currentUser?.rol !== requiredRole) {
    // Redirect to correct portal based on actual role
    return <Navigate to={currentUser?.rol === 'admin' ? '/admin' : '/'} replace />
  }

  return children
}

function AppRoutes() {
  const { isAuthenticated, currentUser } = useAuth()

  return (
    <Routes>
      {/* Auth */}
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to={currentUser?.rol === 'admin' ? '/admin' : '/'} replace />
            : <Login />
        }
      />
      <Route
        path="/registro"
        element={
          isAuthenticated
            ? <Navigate to="/" replace />
            : <Registro />
        }
      />

      {/* Portal Cliente */}
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole="cliente">
            <LayoutCliente />
          </ProtectedRoute>
        }
      >
        <Route index element={<Catalogo />} />
        <Route path="product/:id" element={<DetalleProducto />} />
        <Route path="cart" element={<MiPedido />} />
        <Route path="history" element={<HistorialPedidos />} />
        <Route path="tracking/:id" element={<SeguimientoPedido />} />
        <Route path="profile" element={<PerfilCliente />} />
      </Route>

      {/* Portal Administrador */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <LayoutAdmin />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="pedidos" element={<Pedidos />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="inventario" element={<Inventario />} />
        <Route path="reportes" element={<Reportes />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
