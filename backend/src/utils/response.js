/**
 * Response utility — Formato JSON consistente para todas las respuestas
 */

/**
 * Respuesta de éxito
 * @param {import('express').Response} res
 * @param {object} options
 */
function success(res, { statusCode = 200, message = 'OK', data = null, meta = null } = {}) {
  const body = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta }),
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(body);
}

/**
 * Respuesta de error
 * @param {import('express').Response} res
 * @param {object} options
 */
function error(res, { statusCode = 500, message = 'Error interno del servidor', errors = null } = {}) {
  const body = {
    success: false,
    message,
    ...(errors !== null && { errors }),
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(body);
}

/**
 * Respuesta de validación fallida
 */
function validationError(res, errors) {
  return error(res, {
    statusCode: 422,
    message: 'Error de validación. Verifica los campos enviados.',
    errors,
  });
}

module.exports = { success, error, validationError };
