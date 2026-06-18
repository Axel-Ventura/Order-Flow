import { useState } from "react";
import LayoutAdmin from "../components/LayoutAdmin";
import { Search, Eye, Trash2 } from "lucide-react";

const clientesIniciales = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    telefono: "+52 55 1234 5678",
    direccion: "CDMX",
    pedidos: 5,
  },
  {
    id: 2,
    nombre: "Ana Torres",
    telefono: "+52 33 9876 5432",
    direccion: "Guadalajara",
    pedidos: 3,
  },
  {
    id: 3,
    nombre: "Roberto Jiménez",
    telefono: "+52 81 5555 0011",
    direccion: "Monterrey",
    pedidos: 7,
  },
];

function Clientes() {
  const [clientes, setClientes] = useState(clientesIniciales);
  const [busqueda, setBusqueda] = useState("");

  const eliminarCliente = (id) => {
    if (window.confirm("¿Eliminar cliente?")) {
      setClientes(clientes.filter((c) => c.id !== id));
    }
  };

  const verCliente = (cliente) => {
    alert(
      `Cliente: ${cliente.nombre}\nTeléfono: ${cliente.telefono}\nDirección: ${cliente.direccion}\nPedidos: ${cliente.pedidos}`
    );
  };

  const filtrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.telefono.includes(busqueda)
  );

  return (
    <LayoutAdmin>
      <div className="admin-page-header">
        <div>
          <h1>Clientes</h1>
          <p>Gestiona la información de tus clientes.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Pedidos</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((cliente) => (
              <tr key={cliente.id}>
                <td className="blue-text">{cliente.nombre}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.direccion}</td>
                <td>{cliente.pedidos}</td>

                <td>
                  <div className="action-buttons">
                    <button onClick={() => verCliente(cliente)}>
                      <Eye size={16} />
                    </button>

                    <button
                      className="danger-btn"
                      onClick={() => eliminarCliente(cliente.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LayoutAdmin>
  );
}

export default Clientes;