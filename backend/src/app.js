/**
 * app.js — Configuración principal de la aplicación Express
 * Seguridad, middlewares globales y montaje de rutas.
 */
const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
const morgan  = require('morgan');

// Config debe cargarse primero (valida variables de entorno)
const { ALLOWED_ORIGINS, NODE_ENV } = require('./config/env');
const apiRoutes    = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const logger       = require('./utils/logger');

const app = express();

/* ════════════════════════════════════════════════════
   1. SEGURIDAD — Helmet (HTTP security headers)
════════════════════════════════════════════════════ */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'"],
      imgSrc:     ["'self'", 'data:'],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

/* ════════════════════════════════════════════════════
   2. CORS — Solo orígenes autorizados desde .env
════════════════════════════════════════════════════ */
const corsOptions = {
  origin(origin, callback) {
    // Permitir peticiones sin origen (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    logger.warn('Petición CORS bloqueada desde origen no autorizado', { origin });
    callback(new Error(`CORS: Origen no autorizado: ${origin}`));
  },
  credentials:     true,
  methods:         ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders:  ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders:  ['X-Total-Count'],
  maxAge:          86400, // 24h preflight cache
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight para todas las rutas

/* ════════════════════════════════════════════════════
   3. PARSERS
════════════════════════════════════════════════════ */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ════════════════════════════════════════════════════
   4. HTTP REQUEST LOGGING (Morgan)
════════════════════════════════════════════════════ */
const morganFormat = NODE_ENV === 'production'
  ? 'combined'   // IP, user-agent, referrer para producción
  : 'dev';       // Coloreado y compacto para desarrollo

app.use(morgan(morganFormat, {
  // Silenciar logs de health check en producción
  skip: (req) => NODE_ENV === 'production' && req.path === '/api/health',
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

/* ════════════════════════════════════════════════════
   5. RUTAS PRINCIPALES
════════════════════════════════════════════════════ */

// Ruta raíz — bienvenida
app.get('/', (req, res) => {
  res.json({
    success:  true,
    message:  'OrderFlow API v1.0 — Bienvenido',
    docs:     '/api/health',
    timestamp: new Date().toISOString(),
  });
});

// Montaje de la API
app.use('/api', apiRoutes);

/* ════════════════════════════════════════════════════
   6. 404 GLOBAL (rutas fuera de /api)
════════════════════════════════════════════════════ */
app.use((req, res) => {
  res.status(404).json({
    success:   false,
    message:   `Recurso no encontrado: ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
});

/* ════════════════════════════════════════════════════
   7. MANEJO CENTRALIZADO DE ERRORES
   IMPORTANTE: Debe ser el ÚLTIMO middleware
════════════════════════════════════════════════════ */
app.use(errorHandler);

module.exports = app;
