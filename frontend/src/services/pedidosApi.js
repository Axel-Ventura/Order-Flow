/**
 * pedidosApi.js — Llamadas de pedidos al backend.
 */
import { api } from './api';

export const pedidosApi = {
  /** GET /api/pedidos */
  async listar(params = {}) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v && v !== 'todos'))
    ).toString();
    const res = await api.get(`/pedidos${qs ? `?${qs}` : ''}`);
    return res.data;
  },

  /** GET /api/pedidos/:id */
  async obtener(id) {
    const res = await api.get(`/pedidos/${id}`);
    return res.data;
  },

  /**
   * POST /api/pedidos
   * @param {{ items: Array<{id_producto, cantidad, precio_unitario}>, observaciones?: string, id_vendedor?: number }} datos
   */
  async crear(datos) {
    const res = await api.post('/pedidos', datos);
    return res.data;
  },

  /** PUT /api/pedidos/:id/estado */
  async actualizarEstado(id, estado) {
    const res = await api.put(`/pedidos/${id}/estado`, { estado });
    return res.data;
  },
};
