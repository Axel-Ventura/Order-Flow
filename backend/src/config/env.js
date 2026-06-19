/**
 * Validación y carga de variables de entorno al inicio del servidor.
 * Falla rápido si alguna variable crítica está ausente.
 */
require('dotenv').config();

const REQUIRED_VARS = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `[ENV ERROR] Faltan las siguientes variables de entorno críticas:\n  → ${missing.join('\n  → ')}\n` +
      'Copia .env.example a .env y completa los valores.'
    );
    process.exit(1);
  }
}

validateEnv();

module.exports = {
  PORT:                parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV:            process.env.NODE_ENV || 'development',

  // Supabase
  SUPABASE_URL:        process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY:   process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,

  // JWT
  JWT_SECRET:          process.env.JWT_SECRET,
  JWT_EXPIRES_IN:      process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_SECRET:  process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // CORS
  ALLOWED_ORIGINS:     (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',').map(o => o.trim()),

  // bcrypt
  BCRYPT_ROUNDS:       parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
};
