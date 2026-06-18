/**
 * authController — Maneja las peticiones HTTP de autenticación.
 * Delega la lógica de negocio a authService.
 */
const authService = require('../services/authService');
const { success, error } = require('../utils/response');
const logger = require('../utils/logger');

/* ─────────────────────────────────────────────
   POST /api/auth/register
───────────────────────────────────────────── */
async function register(req, res, next) {
  try {
    const { nombre, correo, password, idRol } = req.body;
    const user = await authService.register({ nombre, correo, password, idRol });

    return success(res, {
      statusCode: 201,
      message:    'Usuario registrado exitosamente.',
      data:       user,
    });
  } catch (err) {
    next(err);
  }
}

/* ─────────────────────────────────────────────
   POST /api/auth/login
───────────────────────────────────────────── */
async function login(req, res, next) {
  try {
    const { correo, password } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];

    const result = await authService.login({ correo, password, ipAddress, userAgent });

    return success(res, {
      statusCode: 200,
      message:    'Inicio de sesión exitoso.',
      data:       result,
    });
  } catch (err) {
    next(err);
  }
}

/* ─────────────────────────────────────────────
   POST /api/auth/refresh-token
───────────────────────────────────────────── */
async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];

    const tokens = await authService.refreshSession({ refreshToken, ipAddress, userAgent });

    return success(res, {
      statusCode: 200,
      message:    'Sesión renovada exitosamente.',
      data:       tokens,
    });
  } catch (err) {
    next(err);
  }
}

/* ─────────────────────────────────────────────
   POST /api/auth/logout
───────────────────────────────────────────── */
async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);

    return success(res, {
      statusCode: 200,
      message:    'Sesión cerrada exitosamente.',
    });
  } catch (err) {
    next(err);
  }
}

/* ─────────────────────────────────────────────
   GET /api/auth/me
───────────────────────────────────────────── */
async function me(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);

    return success(res, {
      statusCode: 200,
      message:    'Perfil obtenido exitosamente.',
      data:       user,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refreshToken, logout, me };
