import './App.css'

function App() {
  return (
    <div>
      <h1>OrderFlow - Frontend</h1>

      <nav>
        <a href="/">Login</a> |{' '}
        <a href="/dashboard">Dashboard</a> |{' '}
        <a href="/pedidos">Pedidos</a> |{' '}
        <a href="/agregar-pedido">Agregar Pedido</a> |{' '}
        <a href="/editar-pedido">Editar Pedido</a>
      </nav>
    </div>
  )
}

export default App