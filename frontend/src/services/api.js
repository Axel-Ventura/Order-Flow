/**
 * api.js — Cliente HTTP centralizado para OrderFlow.
 *
 * Características:
 * - Base URL apunta a /api (proxy Vite en dev → localhost:5000)
 * - Adjunta automáticamente el Bearer token de localStorage
 * - Refresca el accessToken automáticamente cuando recibe 401
 * - Lanza errores con el mensaje del backend
 */

const BASE_URL = '/api';

/* ─── Token helpers ─────────────────────────────────── */
export function getAccessToken() {
  return localStorage.getItem('of_access_token');
}
export function getRefreshToken() {
  return localStorage.getItem('of_refresh_token');
}
export function setTokens({ accessToken, refreshToken }) {
  if (accessToken)  localStorage.setItem('of_access_token',  accessToken);
  if (refreshToken) localStorage.setItem('of_refresh_token', refreshToken);
}
export function clearTokens() {
  localStorage.removeItem('of_access_token');
  localStorage.removeItem('of_refresh_token');
}

/* ─── Petición base ─────────────────────────────────── */
let isRefreshing = false;
let refreshQueue = []; // Callbacks que esperan el nuevo token

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token disponible.');

  const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    window.location.href = '/login';
    throw new Error('Sesión expirada.');
  }

  const json = await res.json();
  setTokens(json.data);
  return json.data.accessToken;
}

export async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let response = await fetch(url, { ...options, headers });

  // Si el token expiró, intentar refresh automático
  if (response.status === 401 && getRefreshToken()) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        // Reenviar callbacks de la cola con el nuevo token
        refreshQueue.forEach((cb) => cb(newToken));
        refreshQueue = [];
        // Reintentar la petición original con el nuevo token
        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        };
        response = await fetch(url, { ...options, headers: retryHeaders });
      } catch {
        isRefreshing = false;
        refreshQueue = [];
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
      }
    } else {
      // Encolar mientras se hace refresh
      await new Promise((resolve) => refreshQueue.push(resolve));
      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${getAccessToken()}`,
      };
      response = await fetch(url, { ...options, headers: retryHeaders });
    }
  }

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg =
      json?.message ||
      json?.error ||
      `Error ${response.status}: ${response.statusText}`;
    const err = new Error(msg);
    err.status = response.status;
    err.data   = json;
    throw err;
  }

  return json;
}

/* ─── Helpers de método ─────────────────────────────── */
export const api = {
  get:    (endpoint, opts)       => apiFetch(endpoint, { method: 'GET',    ...opts }),
  post:   (endpoint, body, opts) => apiFetch(endpoint, { method: 'POST',   body: JSON.stringify(body), ...opts }),
  put:    (endpoint, body, opts) => apiFetch(endpoint, { method: 'PUT',    body: JSON.stringify(body), ...opts }),
  patch:  (endpoint, body, opts) => apiFetch(endpoint, { method: 'PATCH',  body: JSON.stringify(body), ...opts }),
  delete: (endpoint, opts)       => apiFetch(endpoint, { method: 'DELETE', ...opts }),
};
