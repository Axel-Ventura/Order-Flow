/**
 * statsApi.js — Estadísticas del dashboard.
 */
import { api } from './api';

export const statsApi = {
  /** GET /api/stats/dashboard */
  async dashboard() {
    const res = await api.get('/stats/dashboard');
    return res.data;
  },
};
