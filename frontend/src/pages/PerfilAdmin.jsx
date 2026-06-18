import { useState } from "react";
import LayoutAdmin from "../components/LayoutAdmin";
import { Save, User, Mail, Phone, MapPin, Lock } from "lucide-react";

function PerfilAdmin() {
  const [perfil, setPerfil] = useState({
    nombre: "Alejandro Reyes",
    correo: "admin@orderflow.mx",
    telefono: "+52 55 9988 7766",
    direccion: "Calle 5 de Mayo 77, CDMX",
  });

  const cambiarDato = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  return (
    <LayoutAdmin>
      <div className="admin-page-header">
        <div>
          <h1>Mi Perfil</h1>
          <p>Administra tu información personal y seguridad.</p>
        </div>
      </div>

      <div className="admin-profile-layout">
        <div className="settings-card">
          <h2>Información Personal</h2>

          <div className="settings-grid one-column">
            <div className="field">
              <label><User size={16} /> Nombre completo</label>
              <input name="nombre" value={perfil.nombre} onChange={cambiarDato} />
            </div>

            <div className="field">
              <label><Mail size={16} /> Correo electrónico</label>
              <input name="correo" value={perfil.correo} onChange={cambiarDato} />
            </div>

            <div className="field">
              <label><Phone size={16} /> Número telefónico</label>
              <input name="telefono" value={perfil.telefono} onChange={cambiarDato} />
            </div>

            <div className="field">
              <label><MapPin size={16} /> Dirección</label>
              <input name="direccion" value={perfil.direccion} onChange={cambiarDato} />
            </div>
          </div>

          <button className="save-btn" onClick={() => alert("Datos actualizados correctamente")}>
            <Save size={18} /> Actualizar Datos
          </button>
        </div>

        <div className="admin-profile-side">
          <div className="admin-profile-card">
            <div className="admin-profile-avatar">A</div>
            <h3>{perfil.nombre}</h3>
            <p>{perfil.correo}</p>
            <span>Administrador</span>
          </div>

          <div className="admin-security-card">
            <h3>Seguridad</h3>
            <p>Actualiza tu contraseña regularmente para mantener tu cuenta segura.</p>
            <button onClick={() => alert("Función para cambiar contraseña")}>
              <Lock size={18} /> Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}

export default PerfilAdmin;