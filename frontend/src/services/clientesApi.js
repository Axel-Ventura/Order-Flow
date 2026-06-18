/**
 * clientesApi.js — Llamadas de clientes al backend.
 */
import { api } from './api';

export const clientesApi = {
  /** GET /api/clientes */
  async listar() {
    const res = await api.get('/clientes');
    return res.data;
  },
};
