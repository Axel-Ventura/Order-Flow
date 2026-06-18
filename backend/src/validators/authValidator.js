/**
 * authValidator — Esquemas de validación con express-validator
 */
const { body, validationResult } = require('express-validator');
const { validationError } = require('../utils/response');

/* ─── Reglas de validación ───────────────────────────── */

const registerRules = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido.')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('correo')
    .trim()
    .notEmpty().withMessage('El correo electrónico es requerido.')
    .isEmail().withMessage('Debe ser un correo electrónico válido.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('La contraseña es requerida.')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula.')
    .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número.'),

  body('idRol')
    .optional()
    .isInt({ min: 1 }).withMessage('El idRol debe ser un número entero válido.'),
];

const loginRules = [
  body('correo')
    .trim()
    .notEmpty().withMessage('El correo electrónico es requerido.')
    .isEmail().withMessage('Debe ser un correo electrónico válido.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('La contraseña es requerida.'),
];

const refreshTokenRules = [
  body('refreshToken')
    .notEmpty().withMessage('El refresh token es requerido.'),
];

const logoutRules = [
  body('refreshToken')
    .notEmpty().withMessage('El refresh token es requerido.'),
];

/* ─── Middleware: valida y responde si hay errores ───── */

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((e) => ({
      field:   e.path,
      message: e.msg,
    }));
    return validationError(res, formattedErrors);
  }
  next();
}

module.exports = {
  registerRules,
  loginRules,
  refreshTokenRules,
  logoutRules,
  validate,
};
