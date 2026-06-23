/**
 * statsController — Estadísticas del dashboard del administrador.
 * Base route: /api/stats
 */
const supabase = require('../config/supabase');
const { success } = require('../utils/response');

async function dashboard(req, res, next) {
  try {
    const idVendedor = req.user.id;

    // 1. Total pedidos del vendedor autenticado
    const { count: totalPedidos } = await supabase
      .from('pedidos')
      .select('*', { count: 'exact', head: true })
      .eq('id_vendedor', idVendedor);

    // 2. Pedidos pendientes del vendedor autenticado
    const { count: pedidosPendientes } = await supabase
      .from('pedidos')
      .select('*', { count: 'exact', head: true })
      .eq('id_vendedor', idVendedor)
      .in('estado', ['pendiente', 'en_proceso']);

    // 3. Ingresos del mes actual del vendedor autenticado
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const { data: pedidosMes } = await supabase
      .from('pedidos')
      .select('total')
      .eq('id_vendedor', idVendedor)
      .gte('fecha_pedido', inicioMes)
      .in('estado', ['completado', 'entregado']);

    const ingresosMes = (pedidosMes || []).reduce(
      (sum, p) => sum + parseFloat(p.total || 0),
      0
    );

    // 4. Total clientes que han comprado al vendedor autenticado
    const { data: compradoresData } = await supabase
      .from('pedidos')
      .select('id_comprador')
      .eq('id_vendedor', idVendedor);

    const totalClientes = new Set(
      (compradoresData || []).map((p) => p.id_comprador).filter(Boolean)
    ).size;

    // 5. Últimos 5 pedidos del vendedor autenticado
    const { data: pedidosRecientes } = await supabase
      .from('pedidos')
      .select('id_pedido, estado, total, fecha_pedido, observaciones, id_canal, canales_venta(nombre), usuarios!fk_pedido_comprador(nombre, correo), detalle_pedido(cantidad, precio_unitario, productos(nombre))')
      .eq('id_vendedor', idVendedor)
      .order('fecha_pedido', { ascending: false })
      .limit(5);

    const pedidosNorm = (pedidosRecientes || []).map((p) => ({
      id:           p.id_pedido,
      estado:       p.estado,
      total:        p.total,
      fecha:        p.fecha_pedido,
      canal:        p.canales_venta?.nombre || 'manual',
      observaciones: p.observaciones,
      cliente: p.usuarios
        ? { nombre: p.usuarios.nombre, correo: p.usuarios.correo }
        : null,
      productos: (p.detalle_pedido || []).map((d) => ({
        cantidad: d.cantidad,
        producto: { nombre: d.productos?.nombre || '' },
        subtotal: d.cantidad * d.precio_unitario,
      })),
    }));

    return success(res, {
      data: {
        totalPedidos:      totalPedidos || 0,
        pedidosPendientes: pedidosPendientes || 0,
        ingresosMes,
        totalClientes,
        pedidosRecientes:  pedidosNorm,
        // Cambios estáticos (mejorable con comparación de periodos)
        cambiosPedidos:    '+0',
        cambiosIngresos:   '+0',
        cambiosClientes:   '+0',
        cambiosPendientes: '0',
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { dashboard };
