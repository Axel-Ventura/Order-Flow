import LayoutCliente from "../components/LayoutCliente";
import { User, Mail, Phone, MapPin } from "lucide-react";

function PerfilCliente() {
  return (
    <LayoutCliente>
      <div className="page-title">
        <div className="title-icon">
          <User size={24} />
        </div>
        <h1>Mi Perfil</h1>
      </div>

      <div className="profile-card">
        <div className="profile-banner"></div>

        <div className="profile-content">
          <div className="profile-avatar"></div>

          <button className="edit-btn">
            Editar Perfil
          </button>

          <div className="profile-grid">
            <div className="field">
              <label>Nombre completo</label>
              <div className="input-view">
                <User size={18} />
                María García
              </div>
            </div>

            <div className="field">
              <label>Correo electrónico</label>
              <div className="input-view">
                <Mail size={18} />
                maria.garcia@example.com
              </div>
            </div>

            <div className="field">
              <label>Número telefónico</label>
              <div className="input-view">
                <Phone size={18} />
                +52 55 1234 5678
              </div>
            </div>

            <div className="field full">
              <label>Dirección de entrega</label>
              <div className="input-view">
                <MapPin size={18} />
                Av. Paseo de la Reforma 222, CDMX
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutCliente>
  );
}

export default PerfilCliente;