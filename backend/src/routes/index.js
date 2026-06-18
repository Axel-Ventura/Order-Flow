/**
 * routes/index.js — Router principal de la API
 * Monta todos los sub-routers en sus rutas base.
 */
const express = require('express');
const { success } = require('../utils/response');

const authRoutes      = require('./authRoutes');
const protectedRoutes = require('./protectedRoutes');

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

/* ─── Sub-Routers ──────────────────────────────────── */
router.use('/auth', authRoutes);
router.use('/',     protectedRoutes);

/* ─── 404 dentro de /api ───────────────────────────── */
router.use((req, res) => {
  res.status(404).json({
    success:   false,
    message:   `Ruta ${req.method} ${req.path} no encontrada.`,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
