/**
 * routes/index.js — Router principal de la API
 * Monta todos los sub-routers en sus rutas base.
 */
const express = require('express');
const { success } = require('../utils/response');
const { verifyToken, requireRole, optionallyVerifyToken } = require('../middlewares/auth');

const authRoutes         = require('./authRoutes');
const productosController = require('../controllers/productosController');
const pedidosController   = require('../controllers/pedidosController');
const clientesController  = require('../controllers/clientesController');
const statsController     = require('../controllers/statsController');

const router = express.Router();

/* ─── Health Check ─────────────────────────────────── */
router.get('/health', (req, res) => {
  return success(res, {
    message: 'OrderFlow API está funcionando correctamente.',
    data: {
      status:      'OK',
      environment: process.env.NODE_ENV || 'development',
      timestamp:   new Date().toISOString(),
      uptime:      `${Math.floor(process.uptime())}s`,
    },
  });
});

/* ─── Auth ─────────────────────────────────────────── */
router.use('/auth', authRoutes);

/* ─── Productos ────────────────────────────────────── */
// Listar y obtener son públicos (el catálogo no requiere login)
router.get('/productos',     optionallyVerifyToken, productosController.listar);
router.get('/productos/:id', productosController.obtener);
// Crear, actualizar y eliminar requieren ser admin o vendedor
router.post(
  '/productos',
  verifyToken,
  requireRole('admin', 'vendedor'),
  productosController.crear
);
router.put(
  '/productos/:id',
  verifyToken,
  requireRole('admin', 'vendedor'),
  productosController.actualizar
);
router.delete(
  '/productos/:id',
  verifyToken,
  requireRole('admin', 'vendedor'),
  productosController.eliminar
);

/* ─── Pedidos ──────────────────────────────────────── */
router.get(
  '/pedidos',
  verifyToken,
  pedidosController.listar
);
router.get(
  '/pedidos/:id',
  verifyToken,
  pedidosController.obtener
);
router.post(
  '/pedidos',
  verifyToken,
  pedidosController.crear
);
router.put(
  '/pedidos/:id/estado',
  verifyToken,
  requireRole('admin', 'vendedor'),
  pedidosController.actualizarEstado
);

/* ─── Clientes ─────────────────────────────────────── */
router.get(
  '/clientes',
  verifyToken,
  requireRole('admin', 'vendedor'),
  clientesController.listar
);

/* ─── Categorías (Tipos de Negocio) ────────────────── */
router.get('/categorias', async (req, res, next) => {
  try {
    const supabase = require('../config/supabase');
    const { data, error } = await supabase
      .from('tipos_negocio')
      .select('id_tipo_negocio, nombre')
      .order('id_tipo_negocio');
    if (error) throw error;
    return success(res, { data });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/categorias',
  verifyToken,
  requireRole('admin', 'vendedor'),
  async (req, res, next) => {
    try {
      const supabase = require('../config/supabase');
      const { nombre, descripcion } = req.body;
      if (!nombre || !nombre.trim()) {
        const e = new Error('El nombre de la categoría es obligatorio.');
        e.statusCode = 400;
        throw e;
      }

      const { data, error } = await supabase
        .from('tipos_negocio')
        .insert({
          nombre: nombre.trim(),
          descripcion: descripcion ? descripcion.trim() : null
        })
        .select('*')
        .single();

      if (error) {
        if (error.code === '23505') {
          const e = new Error('La categoría ya existe.');
          e.statusCode = 400;
          throw e;
        }
        throw error;
      }

      return success(res, {
        statusCode: 201,
        message: 'Categoría creada exitosamente.',
        data
      });
    } catch (err) {
      next(err);
    }
  }
);

/* ─── Stats Dashboard ────────────────────────────────── */
router.get(
  '/stats/dashboard',
  verifyToken,
  requireRole('admin', 'vendedor'),
  statsController.dashboard
);

/* ─── 404 dentro de /api ───────────────────────────── */
router.use((req, res) => {
  res.status(404).json({
    success:   false,
    message:   `Ruta ${req.method} ${req.path} no encontrada.`,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
