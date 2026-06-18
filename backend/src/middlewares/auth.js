/**
 * auth middleware — Protección de rutas y autorización por roles (RBAC)
 */
const tokenService = require('../services/tokenService');
const { error } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * verifyToken — Extrae y valida el Access Token del header Authorization.
 * Adjunta el payload decodificado en req.user.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, {
      statusCode: 401,
      message: 'Acceso denegado. Se requiere token de autenticación.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = tokenService.verifyAccessToken(token);
    req.user = {
      id:    payload.sub,
      email: payload.email,
      role:  payload.role,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, {
        statusCode: 401,
        message: 'El token ha expirado. Usa el refresh token para renovar tu sesión.',
      });
    }
    logger.warn('Token inválido recibido', { token: token?.substring(0, 20) + '...' });
    return error(res, {
      statusCode: 401,
      message: 'Token de autenticación inválido.',
    });
  }
}

/**
 * requireRole — Fábrica de middleware para autorización por roles (RBAC).
 * @param {...string} roles - Roles permitidos (ej: 'admin', 'vendedor')
 *
 * @example
 *   router.get('/admin-only', verifyToken, requireRole('admin'), handler)
 *   router.get('/staff',      verifyToken, requireRole('admin', 'vendedor'), handler)
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, {
        statusCode: 401,
        message: 'No autenticado.',
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Acceso denegado por rol insuficiente', {
        userId:       req.user.id,
        userRole:     req.user.role,
        requiredRoles: roles,
        path:          req.path,
      });
      return error(res, {
        statusCode: 403,
        message: `Acceso denegado. Se requiere uno de los siguientes roles: ${roles.join(', ')}.`,
      });
    }

    next();
  };
}

module.exports = { verifyToken, requireRole };
