/**
 * Logger utility — Timestamps + niveles de log estructurados
 */

const LOG_LEVELS = {
  INFO:  { label: 'INFO ', color: '\x1b[36m' },  // Cyan
  WARN:  { label: 'WARN ', color: '\x1b[33m' },  // Yellow
  ERROR: { label: 'ERROR', color: '\x1b[31m' },  // Red
  DEBUG: { label: 'DEBUG', color: '\x1b[35m' },  // Magenta
};

const RESET = '\x1b[0m';
const BOLD  = '\x1b[1m';

const isProd = process.env.NODE_ENV === 'production';

function formatTimestamp() {
  return new Date().toISOString();
}

function log(level, message, meta = null) {
  const { label, color } = LOG_LEVELS[level];
  const timestamp = formatTimestamp();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';

  // En producción evitar colores (para log parsers)
  if (isProd) {
    console.log(`[${timestamp}] [${label}] ${message}${metaStr}`);
  } else {
    console.log(`${color}${BOLD}[${label}]${RESET} ${color}${timestamp}${RESET} ${message}${metaStr}`);
  }
}

const logger = {
  info:  (message, meta) => log('INFO',  message, meta),
  warn:  (message, meta) => log('WARN',  message, meta),
  error: (message, meta) => log('ERROR', message, meta),
  debug: (message, meta) => { if (!isProd) log('DEBUG', message, meta); },
};

module.exports = logger;
