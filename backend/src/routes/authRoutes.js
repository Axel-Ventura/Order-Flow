/**
 * authRoutes — Rutas públicas y privadas de autenticación
 * Base: /api/auth
 */
const express = require('express');
const rateLimit = require('express-rate-limit');

const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');
const {
  registerRules,
  loginRules,
  refreshTokenRules,
  logoutRules,
  validate,
} = require('../validators/authValidator');

const router = express.Router();

/* ─── Rate Limiting para rutas de auth ──────────────── */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // ventana de 15 minutos
  max:      10,                 // máximo 10 intentos por IP
  message:  {
    success:   false,
    message:   'Demasiados intentos. Por favor espera 15 minutos e intenta de nuevo.',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders:   false,
});

/* ─── Rutas Públicas ─────────────────────────────────── */

// POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  registerRules,
  validate,
  authController.register
);

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  loginRules,
  validate,
  authController.login
);

// POST /api/auth/refresh-token
router.post(
  '/refresh-token',
  refreshTokenRules,
  validate,
  authController.refreshToken
);

// POST /api/auth/logout
router.post(
  '/logout',
  logoutRules,
  validate,
  authController.logout
);

/* ─── Rutas Protegidas ───────────────────────────────── */

// GET /api/auth/me  (requiere autenticación)
router.get('/me', verifyToken, authController.me);

/* ─── Roles públicos (para formulario de registro) ───── */

// GET /api/auth/roles
router.get('/roles', async (req, res, next) => {
  try {
    const supabase = require('../config/supabase');
    const { data, error } = await supabase
      .from('roles')
      .select('id_rol, nombre, descripcion')
      .order('id_rol');
    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
