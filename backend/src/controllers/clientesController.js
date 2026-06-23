/**
 * clientesController — Gestión de clientes (usuarios compradores).
 * Base route: /api/clientes
 */
const supabase = require('../config/supabase');
const { success } = require('../utils/response');

/* ─── GET /api/clientes ──────────────────────────────── */
async function listar(req, res, next) {
  try {
    const idVendedor = req.user.id;

    // 1. Obtener los pedidos del vendedor autenticado para conocer sus compradores únicos
    const { data: pedidosVendedor, error: pedErr } = await supabase
      .from('pedidos')
      .select('id_comprador')
      .eq('id_vendedor', idVendedor);

    if (pedErr) throw pedErr;

    // Si el vendedor no tiene pedidos aún, no hay clientes que mostrar
    const compradorIds = [
      ...new Set((pedidosVendedor || []).map((p) => p.id_comprador).filter(Boolean))
    ];

    if (compradorIds.length === 0) {
      return success(res, { data: [] });
    }

    // 2. Obtener el detalle de esos compradores
    const { data, error: err } = await supabase
      .from('usuarios')
      .select('id_usuario, nombre, correo, telefono, direccion, activo, fecha_registro, roles(nombre)')
      .in('id_usuario', compradorIds)
      .order('fecha_registro', { ascending: false });

    if (err) throw err;

    // 3. Contar cuántos pedidos tiene cada cliente CON ESTE vendedor
    const { data: pedidosCount } = await supabase
      .from('pedidos')
      .select('id_comprador')
      .eq('id_vendedor', idVendedor)
      .in('id_comprador', compradorIds);

    const countMap = {};
    (pedidosCount || []).forEach((p) => {
      countMap[p.id_comprador] = (countMap[p.id_comprador] || 0) + 1;
    });

    const clientes = (data || []).map((u) => ({
      id:            u.id_usuario,
      nombre:        u.nombre,
      correo:        u.correo,
      telefono:      u.telefono || '',
      direccion:     u.direccion || '',
      estado:        u.activo ? 'activo' : 'inactivo',
      fechaRegistro: u.fecha_registro,
      totalPedidos:  countMap[u.id_usuario] || 0,
      rol:           u.roles?.nombre || 'cliente',
    }));

    return success(res, { data: clientes });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar };
