import { useState } from "react";
import LayoutAdmin from "../components/LayoutAdmin";
import { Save, Upload } from "lucide-react";

function Configuracion() {
  const [datos, setDatos] = useState({
    negocio: "OrderFlow Restaurant",
    direccion: "Av. Reforma 123, CDMX",
    telefono1: "+52 55 1234 5678",
    telefono2: "+52 55 8765 4321",
    horario: "Lunes a Domingo 9:00 AM - 10:00 PM",
  });

  const cambiarDato = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  const guardarCambios = () => {
    alert("Cambios guardados correctamente");
  };

  return (
    <LayoutAdmin>
      <div className="admin-page-header">
        <div>
          <h1>Configuración</h1>
          <p>Administra la información general del negocio.</p>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-grid">
          <div className="field">
            <label>Nombre del Negocio</label>
            <input name="negocio" value={datos.negocio} onChange={cambiarDato} />
          </div>

          <div className="field">
            <label>Dirección</label>
            <input name="direccion" value={datos.direccion} onChange={cambiarDato} />
          </div>

          <div className="field">
            <label>Teléfono Principal</label>
            <input name="telefono1" value={datos.telefono1} onChange={cambiarDato} />
          </div>

          <div className="field">
            <label>Teléfono Secundario</label>
            <input name="telefono2" value={datos.telefono2} onChange={cambiarDato} />
          </div>

          <div className="field full">
            <label>Horario de Atención</label>
            <input name="horario" value={datos.horario} onChange={cambiarDato} />
          </div>
        </div>

        <div className="upload-section">
          <div className="upload-box">
            <Upload size={28} />
            <p>Subir Logo</p>
            <input type="file" />
          </div>

          <div className="upload-box">
            <Upload size={28} />
            <p>Subir Foto</p>
            <input type="file" />
          </div>
        </div>

        <button className="save-btn" onClick={guardarCambios}>
          <Save size={18} /> Guardar Cambios
        </button>
      </div>
    </LayoutAdmin>
  );
}

export default Configuracion;