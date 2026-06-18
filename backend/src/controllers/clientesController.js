/**
 * clientesController — Gestión de clientes (usuarios compradores).
 * Base route: /api/clientes
 */
const supabase = require('../config/supabase');
const { success } = require('../utils/response');

/* ─── GET /api/clientes ──────────────────────────────── */
async function listar(req, res, next) {
  try {
    const { data: roles } = await supabase
      .from('roles')
      .select('id_rol')
      .in('nombre', ['comprador', 'cliente']);

    const roleIds = (roles || []).map((r) => r.id_rol);

    let query = supabase
      .from('usuarios')
      .select('id_usuario, nombre, correo, telefono, direccion, activo, fecha_registro, roles(nombre)')
      .order('fecha_registro', { ascending: false });

    if (roleIds.length > 0) {
      query = query.in('id_rol', roleIds);
    }

    const { data, error: err } = await query;
    if (err) throw err;

    // Contar pedidos por cliente
    const clientIds = (data || []).map((u) => u.id_usuario);
    let pedidosCount = {};
    if (clientIds.length > 0) {
      const { data: pedidos } = await supabase
        .from('pedidos')
        .select('id_comprador')
        .in('id_comprador', clientIds);

      (pedidos || []).forEach((p) => {
        pedidosCount[p.id_comprador] = (pedidosCount[p.id_comprador] || 0) + 1;
      });
    }

    const clientes = (data || []).map((u) => ({
      id:             u.id_usuario,
      nombre:         u.nombre,
      correo:         u.correo,
      telefono:       u.telefono || '',
      direccion:      u.direccion || '',
      estado:         u.activo ? 'activo' : 'inactivo',
      fechaRegistro:  u.fecha_registro,
      totalPedidos:   pedidosCount[u.id_usuario] || 0,
      rol:            u.roles?.nombre || 'cliente',
    }));

    return success(res, { data: clientes });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar };
