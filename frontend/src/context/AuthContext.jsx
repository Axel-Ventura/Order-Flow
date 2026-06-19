/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/authApi'
import { getAccessToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true) // true mientras se restaura la sesión

  /* ── Restaurar sesión al cargar la app ─────────────── */
  useEffect(() => {
    const restore = async () => {
      if (!getAccessToken()) {
        setLoading(false)
        return
      }
      try {
        const user = await authApi.me()
        setCurrentUser(normalizeUser(user))
      } catch {
        // Token inválido o expirado y no se pudo renovar — limpiar
        setCurrentUser(null)
      } finally {
        setLoading(false)
      }
    }
    restore()
  }, [])

  /* ── Login ─────────────────────────────────────────── */
  const login = async (correo, password) => {
    const data = await authApi.login(correo, password)
    const user = normalizeUser(data.user)
    setCurrentUser(user)
    return { success: true, rol: user.rol }
  }

  /* ── Logout ────────────────────────────────────────── */
  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      setCurrentUser(null)
    }
  }

  const isAuthenticated = !!currentUser

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

/* ─── Normalizador de usuario del backend ──────────────
   El backend devuelve { id, nombre, correo, role }
   El frontend espera { id, nombre, correo, rol }         */
function normalizeUser(u) {
  if (!u) return null
  return {
    id:     u.id      || u.id_usuario,
    nombre: u.nombre,
    correo: u.correo  || u.email,
    // El backend usa 'role' (en inglés), el frontend usa 'rol'
    // Mapeamos también aliases: 'comprador' → 'cliente'
    rol:    mapRole(u.role || u.rol || u.roles?.nombre),
    telefono:  u.telefono  || '',
    direccion: u.direccion || '',
  }
}

function mapRole(role) {
  if (!role) return 'cliente'
  if (role === 'comprador') return 'cliente'
  if (role === 'vendedor')  return 'admin'
  return role // 'admin', 'cliente'
}
