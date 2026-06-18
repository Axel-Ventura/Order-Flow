/**
 * authService — Lógica de negocio para autenticación de usuarios.
 * Interactúa con Supabase (tabla usuarios y refresh_tokens).
 *
 * Nombres de columnas alineados con Esquema.sql:
 *   PK:     id_usuario  (BIGINT)
 *   email:  correo
 *   rol FK: id_rol  →  roles(id_rol)
 *   ts:     fecha_registro
 */
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const { BCRYPT_ROUNDS } = require('../config/env');
const tokenService = require('./tokenService');
const logger = require('../utils/logger');

/* ─────────────────────────────────────────────
   REGISTRO
───────────────────────────────────────────── */
async function register({ nombre, correo, password, idRol }) {
  // 1. Verificar si el correo ya existe
  const { data: existing } = await supabase
    .from('usuarios')
    .select('id_usuario')
    .eq('correo', correo)
    .maybeSingle();

  if (existing) {
    const err = new Error('El correo electrónico ya está registrado.');
    err.statusCode = 409;
    throw err;
  }

  // 2. Hash de contraseña
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // 2b. Si no se proporcionó id_rol, obtener el rol "comprador" o "cliente" por defecto
  let rolId = idRol ? Number(idRol) : null;
  if (!rolId) {
    const { data: rolDefault } = await supabase
      .from('roles')
      .select('id_rol')
      .in('nombre', ['comprador', 'cliente'])
      .limit(1)
      .maybeSingle();
    rolId = rolDefault?.id_rol || null;
  }

  // 3. Insertar usuario
  const { data: newUser, error } = await supabase
    .from('usuarios')
    .insert({
      nombre,
      correo,
      password_hash: passwordHash,
      id_rol:        rolId,
      activo:        true,
    })
    .select('id_usuario, nombre, correo, id_rol, fecha_registro')
    .single();

  if (error) {
    logger.error('Error al registrar usuario', { error: error?.message || error });
    const err = new Error(error?.message || 'No se pudo crear el usuario.');
    err.statusCode = 500;
    throw err;
  }

  logger.info('Usuario registrado exitosamente', { userId: newUser.id_usuario, correo });
  return newUser;
}

/* ─────────────────────────────────────────────
   LOGIN
───────────────────────────────────────────── */
async function login({ correo, password, ipAddress, userAgent }) {
  // 1. Buscar usuario con su rol
  const { data: user, error } = await supabase
    .from('usuarios')
    .select(`
      id_usuario,
      nombre,
      correo,
      password_hash,
      activo,
      roles (
        id_rol,
        nombre
      )
    `)
    .eq('correo', correo)
    .maybeSingle();

  if (error) {
    logger.error('Error al buscar usuario en login', { error });
    const err = new Error('Error interno al iniciar sesión.');
    err.statusCode = 500;
    throw err;
  }

  // 2. Verificar existencia y estado activo
  if (!user || !user.activo) {
    const err = new Error('Credenciales inválidas.');
    err.statusCode = 401;
    throw err;
  }

  // 3. Verificar contraseña
  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    const err = new Error('Credenciales inválidas.');
    err.statusCode = 401;
    throw err;
  }

  // 4. Generar tokens
  const userPayload = {
    id:    user.id_usuario,
    email: user.correo,
    role:  user.roles?.nombre || 'cliente',
  };

  const accessToken = tokenService.generateAccessToken(userPayload);
  const { token: refreshToken } = tokenService.generateRefreshToken(user.id_usuario);

  // 5. Guardar refresh token en DB
  await saveRefreshToken({ userId: user.id_usuario, token: refreshToken, ipAddress, userAgent });

  logger.info('Login exitoso', { userId: user.id_usuario, correo });

  return {
    accessToken,
    refreshToken,
    user: {
      id:     user.id_usuario,
      nombre: user.nombre,
      correo: user.correo,
      role:   user.roles?.nombre || 'cliente',
    },
  };
}

/* ─────────────────────────────────────────────
   REFRESH TOKEN
───────────────────────────────────────────── */
async function refreshSession({ refreshToken, ipAddress, userAgent }) {
  // 1. Verificar firma JWT del refresh token
  let payload;
  try {
    payload = tokenService.verifyRefreshToken(refreshToken);
  } catch {
    const err = new Error('Refresh token inválido o expirado.');
    err.statusCode = 401;
    throw err;
  }

  // 2. Buscar en DB y verificar que no esté revocado
  const { data: storedToken, error } = await supabase
    .from('refresh_tokens')
    .select('id, user_id, is_revoked, expires_at')
    .eq('token', refreshToken)
    .maybeSingle();

  if (error || !storedToken) {
    const err = new Error('Refresh token no encontrado.');
    err.statusCode = 401;
    throw err;
  }

  if (storedToken.is_revoked) {
    // Posible reuso de token — revocar todos los tokens del usuario (seguridad)
    logger.warn('Intento de reuso de refresh token revocado', { userId: storedToken.user_id });
    await revokeAllUserTokens(storedToken.user_id);
    const err = new Error('Refresh token ya fue utilizado. Sesión terminada por seguridad.');
    err.statusCode = 401;
    throw err;
  }

  if (new Date(storedToken.expires_at) < new Date()) {
    const err = new Error('Refresh token expirado.');
    err.statusCode = 401;
    throw err;
  }

  // 3. Revocar token actual (token rotation)
  await supabase
    .from('refresh_tokens')
    .update({ is_revoked: true })
    .eq('id', storedToken.id);

  // 4. Obtener datos actualizados del usuario
  const { data: user } = await supabase
    .from('usuarios')
    .select('id_usuario, nombre, correo, roles(nombre)')
    .eq('id_usuario', storedToken.user_id)
    .single();

  if (!user) {
    const err = new Error('Usuario no encontrado.');
    err.statusCode = 404;
    throw err;
  }

  // 5. Emitir nuevo par de tokens
  const userPayload = {
    id:    user.id_usuario,
    email: user.correo,
    role:  user.roles?.nombre || 'cliente',
  };

  const newAccessToken  = tokenService.generateAccessToken(userPayload);
  const { token: newRefreshToken } = tokenService.generateRefreshToken(user.id_usuario);

  await saveRefreshToken({ userId: user.id_usuario, token: newRefreshToken, ipAddress, userAgent });

  logger.info('Sesión renovada exitosamente', { userId: user.id_usuario });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

/* ─────────────────────────────────────────────
   LOGOUT
───────────────────────────────────────────── */
async function logout(refreshToken) {
  const { error } = await supabase
    .from('refresh_tokens')
    .update({ is_revoked: true })
    .eq('token', refreshToken);

  if (error) {
    logger.error('Error al revocar refresh token en logout', { error });
  }

  logger.info('Logout: refresh token revocado');
}

/* ─────────────────────────────────────────────
   OBTENER PERFIL (ME)
───────────────────────────────────────────── */
async function getMe(userId) {
  const { data: user, error } = await supabase
    .from('usuarios')
    .select('id_usuario, nombre, correo, activo, fecha_registro, roles(id_rol, nombre)')
    .eq('id_usuario', userId)
    .maybeSingle();

  if (error || !user) {
    const err = new Error('Usuario no encontrado.');
    err.statusCode = 404;
    throw err;
  }

  return user;
}

/* ─────────────────────────────────────────────
   HELPERS INTERNOS
───────────────────────────────────────────── */
async function saveRefreshToken({ userId, token, ipAddress, userAgent }) {
  const expiresAt = tokenService.getRefreshTokenExpiry();

  const { error } = await supabase.from('refresh_tokens').insert({
    user_id:    userId,
    token,
    expires_at: expiresAt.toISOString(),
    ip_address: ipAddress || null,
    user_agent: userAgent || null,
  });

  if (error) {
    logger.error('Error al guardar refresh token', { error });
    throw new Error('No se pudo guardar la sesión.');
  }
}

async function revokeAllUserTokens(userId) {
  await supabase
    .from('refresh_tokens')
    .update({ is_revoked: true })
    .eq('user_id', userId)
    .eq('is_revoked', false);
}

module.exports = { register, login, refreshSession, logout, getMe };
