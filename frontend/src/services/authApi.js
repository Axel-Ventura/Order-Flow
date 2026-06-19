/**
 * authApi.js — Llamadas de autenticación al backend.
 */
import { api, setTokens, clearTokens, getRefreshToken } from './api';

export const authApi = {
  /** POST /api/auth/login */
  async login(correo, password) {
    const res = await api.post('/auth/login', { correo, password });
    // Guardar tokens en localStorage
    setTokens({
      accessToken:  res.data.accessToken,
      refreshToken: res.data.refreshToken,
    });
    return res.data; // { accessToken, refreshToken, user }
  },

  /** POST /api/auth/register */
  async register({ nombre, correo, password, idRol, telefono }) {
    const res = await api.post('/auth/register', { nombre, correo, password, idRol, telefono });
    return res.data; // { id_usuario, nombre, correo, ... }
  },

  /** GET /api/auth/me */
  async me() {
    const res = await api.get('/auth/me');
    return res.data; // usuario completo
  },

  /** POST /api/auth/logout */
  async logout() {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } finally {
      clearTokens();
    }
  },

  /** GET /api/auth/roles */
  async getRoles() {
    const res = await api.get('/auth/roles');
    return res.data; // [{ id_rol, nombre, descripcion }]
  },
};
