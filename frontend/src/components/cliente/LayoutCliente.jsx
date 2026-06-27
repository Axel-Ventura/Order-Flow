import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SidebarCliente from './SidebarCliente'
import HeaderCliente from './HeaderCliente'

export default function LayoutCliente() {
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">
      {/* Overlay oscuro — sólo activo en móvil cuando sidebar está abierto */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <SidebarCliente isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <HeaderCliente
          onSearch={setSearch}
          searchValue={search}
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="page-content">
          <Outlet context={{ search, setSearch }} />
        </main>
      </div>
    </div>
  )
}
