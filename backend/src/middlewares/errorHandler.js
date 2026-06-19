/**
 * errorHandler — Middleware centralizado de manejo de errores.
 * Debe registrarse ÚLTIMO en app.js.
 */
const logger = require('../utils/logger');
const { NODE_ENV } = require('../config/env');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Determinar status code
  const statusCode = err.statusCode || err.status || 500;

  // Log completo en desarrollo, resumido en producción
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.path} → ${statusCode}`, {
      message: err.message,
      stack:   NODE_ENV !== 'production' ? err.stack : undefined,
    });
  } else {
    logger.warn(`${req.method} ${req.path} → ${statusCode}`, {
      message: err.message,
    });
  }

  // Respuesta al cliente
  const body = {
    success:   false,
    message:   statusCode >= 500 ? 'Error interno del servidor.' : err.message,
    timestamp: new Date().toISOString(),
  };

  // En desarrollo incluir el stack
  if (NODE_ENV !== 'production' && statusCode >= 500) {
    body.debug = { stack: err.stack };
  }

  res.status(statusCode).json(body);
}

module.exports = errorHandler;
