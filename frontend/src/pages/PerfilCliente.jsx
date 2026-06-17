function PerfilCliente() {
  return (
    <div>
      <h2>Perfil del Usuario</h2>

      <input type="text" placeholder="Nombre" />
      <br /><br />

      <input type="text" placeholder="Teléfono" />
      <br /><br />

      <input type="text" placeholder="Dirección" />
      <br /><br />

      <input type="password" placeholder="Nueva contraseña" />
      <br /><br />

      <button>Guardar cambios</button>
    </div>
  )
}

export default PerfilCliente