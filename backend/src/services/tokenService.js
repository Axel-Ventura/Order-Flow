/**
 * tokenService — Generación, firma y verificación de JWT
 * Access Token:  corto plazo (15 min por defecto)
 * Refresh Token: largo plazo (7 días por defecto), rotación en cada uso
 */
const jwt  = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
} = require('../config/env');

/**
 * Genera un Access Token firmado con el payload del usuario.
 * @param {{ id, email, role }} userPayload
 */
function generateAccessToken(userPayload) {
  return jwt.sign(
    {
      sub:   userPayload.id,
      email: userPayload.email,
      role:  userPayload.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Genera un Refresh Token opaco (UUID v4) — se almacena en DB.
 * El JWT de refresh solo contiene el sub para validar la DB.
 * @param {string} userId
 */
function generateRefreshToken(userId) {
  const tokenId = uuidv4();
  const token = jwt.sign(
    { sub: userId, jti: tokenId },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
  return { token, tokenId };
}

/**
 * Verifica y decodifica un Access Token.
 * @returns {object} payload decodificado
 * @throws {jwt.JsonWebTokenError | jwt.TokenExpiredError}
 */
function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * Verifica y decodifica un Refresh Token.
 * @returns {object} payload decodificado
 * @throws {jwt.JsonWebTokenError | jwt.TokenExpiredError}
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

/**
 * Calcula la fecha de expiración del refresh token.
 */
function getRefreshTokenExpiry() {
  const match = JWT_REFRESH_EXPIRES_IN.match(/^(\d+)([smhd])$/);
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // default 7 días

  const [, amount, unit] = match;
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return new Date(Date.now() + parseInt(amount, 10) * multipliers[unit]);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
};
