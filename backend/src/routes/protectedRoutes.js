/**
 * protectedRoutes — Ejemplos de rutas protegidas por autenticación y por rol.
 * Base: /api
 *
 * Úsalo como template para crear tus propios módulos de rutas.
 */
const express = require('express');
const { verifyToken, requireRole } = require('../middlewares/auth');
const { success } = require('../utils/response');

const router = express.Router();

/* ─────────────────────────────────────────────────────────
   Rutas que requieren solo estar autenticado
───────────────────────────────────────────────────────── */

/**
 * GET /api/dashboard
 * Accesible a cualquier usuario autenticado.
 */
router.get('/dashboard', verifyToken, (req, res) => {
  return success(res, {
    message: 'Bienvenido al dashboard.',
    data: {
      user: req.user,
      message: 'Tienes acceso a esta área porque estás autenticado.',
    },
  });
});

/* ─────────────────────────────────────────────────────────
   Rutas que requieren rol específico
───────────────────────────────────────────────────────── */

/**
 * GET /api/admin/usuarios
 * Solo accesible por usuarios con rol 'admin'.
 */
router.get('/admin/usuarios', verifyToken, requireRole('admin'), async (req, res, next) => {
  try {
    const supabase = require('../config/supabase');

    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, activo, created_at, roles(nombre)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return success(res, {
      message: 'Lista de usuarios obtenida.',
      data:    usuarios,
      meta:    { total: usuarios.length },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/vendedor/pedidos
 * Accesible por roles 'admin' y 'vendedor'.
 */
router.get('/vendedor/pedidos', verifyToken, requireRole('admin', 'vendedor'), async (req, res, next) => {
  try {
    const supabase = require('../config/supabase');

    const { data: pedidos, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return success(res, {
      message: 'Lista de pedidos obtenida.',
      data:    pedidos,
      meta:    { total: pedidos.length },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/cliente/historial
 * Solo accesible por el propio cliente (cualquier rol autenticado).
 * Filtra por el ID del usuario autenticado.
 */
router.get('/cliente/historial', verifyToken, async (req, res, next) => {
  try {
    const supabase = require('../config/supabase');

    const { data: pedidos, error } = await supabase
      .from('pedidos')
      .select('*, detalle_pedido(*)')
      .eq('usuario_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return success(res, {
      message: 'Historial de pedidos del cliente.',
      data:    pedidos,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
