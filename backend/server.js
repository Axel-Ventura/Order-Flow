/**
 * server.js — Punto de entrada del servidor OrderFlow Backend.
 * Arranque limpio con manejo de errores y señales del sistema operativo.
 */

// Carga dotenv antes que todo
require('dotenv').config();

const app    = require('./src/app');
const logger = require('./src/utils/logger');
const { PORT, NODE_ENV } = require('./src/config/env');

/* ─── Arranque del servidor ───────────────────────── */
const server = app.listen(PORT, () => {
  logger.info('═══════════════════════════════════════════');
  logger.info('  OrderFlow Backend — Servidor Iniciado');
  logger.info('═══════════════════════════════════════════');
  logger.info(`  🚀 Puerto:      ${PORT}`);
  logger.info(`  🌎 Entorno:     ${NODE_ENV}`);
  logger.info(`  📡 URL:         http://localhost:${PORT}`);
  logger.info(`  ❤️  Health:      http://localhost:${PORT}/api/health`);
  logger.info('═══════════════════════════════════════════');
});

/* ─── Manejo de errores de red ────────────────────── */
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`El puerto ${PORT} ya está en uso. Cambia PORT en .env.`);
  } else {
    logger.error('Error al iniciar el servidor', { error: err.message });
  }
  process.exit(1);
});

/* ─── Manejo de excepciones no capturadas ─────────── */
process.on('uncaughtException', (err) => {
  logger.error('Excepción no capturada. Cerrando servidor...', {
    error: err.message,
    stack: err.stack,
  });
  server.close(() => process.exit(1));
});

process.on('unhandledRejection', (reason) => {
  logger.error('Promise rechazada sin manejar. Cerrando servidor...', {
    reason: String(reason),
  });
  server.close(() => process.exit(1));
});

/* ─── Cierre graceful (SIGTERM / SIGINT) ──────────── */
function gracefulShutdown(signal) {
  logger.info(`Señal ${signal} recibida. Cerrando servidor gracefully...`);
  server.close(() => {
    logger.info('Servidor cerrado correctamente. ¡Hasta luego!');
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));
