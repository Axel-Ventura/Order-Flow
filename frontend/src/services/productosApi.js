/**
 * productosApi.js — Llamadas de productos al backend.
 */
import { api } from './api';

export const productosApi = {
  /** GET /api/productos */
  async listar(params = {}) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v && v !== 'todos'))
    ).toString();
    const res = await api.get(`/productos${qs ? `?${qs}` : ''}`);
    return res.data; // array de productos
  },

  /** GET /api/categorias */
  async listarCategorias() {
    const res = await api.get('/categorias');
    return res.data; // array de tipos_negocio
  },

  /** POST /api/categorias */
  async crearCategoria(datos) {
    const res = await api.post('/categorias', datos);
    return res.data;
  },

  /** GET /api/productos/:id */
  async obtener(id) {
    const res = await api.get(`/productos/${id}`);
    return res.data;
  },

  /** POST /api/productos */
  async crear(datos) {
    const res = await api.post('/productos', datos);
    return res.data;
  },

  /** PUT /api/productos/:id */
  async actualizar(id, datos) {
    const res = await api.put(`/productos/${id}`, datos);
    return res.data;
  },

  /** DELETE /api/productos/:id */
  async eliminar(id) {
    await api.delete(`/productos/${id}`);
  },
};
