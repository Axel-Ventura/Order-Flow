import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SidebarCliente from './SidebarCliente'
import HeaderCliente from './HeaderCliente'

export default function LayoutCliente() {
  const [search, setSearch] = useState('')

  return (
    <div className="app-layout">
      <SidebarCliente />
      <div className="main-content">
        <HeaderCliente onSearch={setSearch} searchValue={search} />
        <main className="page-content">
          <Outlet context={{ search, setSearch }} />
        </main>
      </div>
    </div>
  )
}
