import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SidebarAdmin from './SidebarAdmin'
import HeaderAdmin from './HeaderAdmin'

const pageTitles = {
  '/admin':            { title: 'Dashboard',          subtitle: 'Resumen general del negocio' },
  '/admin/pedidos':    { title: 'Gestión de Pedidos', subtitle: 'Visualiza y administra todos los pedidos' },
  '/admin/clientes':   { title: 'Clientes',           subtitle: 'Lista de clientes registrados' },
  '/admin/inventario': { title: 'Inventario',         subtitle: 'Control de productos y stock' },
  '/admin/reportes':   { title: 'Reportes',           subtitle: 'Estadísticas y análisis del negocio' },
}

export default function LayoutAdmin() {
  const { pathname } = useLocation()
  const meta = pageTitles[pathname] || {}
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">
      {/* Overlay oscuro — sólo activo en móvil cuando sidebar está abierto */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <SidebarAdmin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <HeaderAdmin
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
