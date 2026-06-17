import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [rol, setRol] = useState('comprador')

  const iniciarSesion = (e) => {
    e.preventDefault()

    localStorage.setItem('auth', 'true')
    localStorage.setItem('rol', rol)

    if (rol === 'comprador') {
      navigate('/catalogo')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div>
      <h2>Iniciar Sesión</h2>

      <form onSubmit={iniciarSesion}>
        <input type="email" placeholder="Correo electrónico" required />
        <br /><br />

        <input type="password" placeholder="Contraseña" required />
        <br /><br />

        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="comprador">Comprador</option>
          <option value="vendedor">Vendedor</option>
        </select>
        <br /><br />

        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  )
}

export default Login