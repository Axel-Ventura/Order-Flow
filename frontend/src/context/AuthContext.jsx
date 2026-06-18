/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import { usuariosMock } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  const login = (correo, password) => {
    const user = usuariosMock.find(
      (u) => u.correo === correo && u.password === password
    )
    if (user) {
      const safeUser = { ...user }
      delete safeUser.password
      setCurrentUser(safeUser)
      return { success: true, rol: safeUser.rol }
    }
    return { success: false, error: 'Credenciales incorrectas' }
  }

  const logout = () => setCurrentUser(null)

  const isAuthenticated = !!currentUser

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
