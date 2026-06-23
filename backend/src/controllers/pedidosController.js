/**
 * pedidosController — Gestión de pedidos.
 * Base route: /api/pedidos
 */
const supabase = require('../config/supabase');
const { success } = require('../utils/response');
const logger = require('../utils/logger');

/* ─── GET /api/pedidos ───────────────────────────────── */
// Admin: todos los pedidos | Cliente: solo los suyos (filtrado por id_comprador)
async function listar(req, res, next) {
  try {
    const { role, id } = req.user;
    const { estado: filtroEstado } = req.query;

    // Pedidos con detalle, comprador y canal
    let query = supabase
      .from('pedidos')
      .select(`
        id_pedido,
        estado,
        observaciones,
        total,
        fecha_pedido,
        id_canal,
        canales_venta ( nombre ),
        cliente:usuarios!fk_pedido_comprador ( id_usuario, nombre, correo, telefono, direccion ),
        vendedor:usuarios!fk_pedido_vendedor ( id_usuario, nombre ),
        detalle_pedido (
          id_detalle,
          cantidad,
          precio_unitario,
          productos ( id_producto, nombre, imagen_url )
        )
      `)
      .order('fecha_pedido', { ascending: false });

    // Clientes/compradores: solo sus propios pedidos
    // Vendedores: solo los pedidos donde ellos son el vendedor
    // Admin: todos los pedidos
    if (role === 'comprador' || role === 'cliente') {
      query = query.eq('id_comprador', Number(id));
    } else if (role === 'vendedor') {
      query = query.eq('id_vendedor', Number(id));
    }
    // admin → sin filtro adicional, ve todo

    if (filtroEstado && filtroEstado !== 'todos') {
      query = query.eq('estado', filtroEstado);
    }

    const { data, error: err } = await query;
    if (err) throw err;

    // Normalizar shape para el frontend
    const pedidos = (data || []).map(normalizarPedido);

    return success(res, { data: pedidos });
  } catch (err) {
    next(err);
  }
}

/* ─── GET /api/pedidos/:id ───────────────────────────── */
async function obtener(req, res, next) {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    let query = supabase
      .from('pedidos')
      .select(`
        id_pedido,
        estado,
        observaciones,
        total,
        fecha_pedido,
        id_canal,
        canales_venta ( nombre ),
        cliente:usuarios!fk_pedido_comprador ( id_usuario, nombre, correo, telefono, direccion ),
        vendedor:usuarios!fk_pedido_vendedor ( id_usuario, nombre ),
        detalle_pedido (
          id_detalle,
          cantidad,
          precio_unitario,
          productos ( id_producto, nombre, imagen_url )
        )
      `)
      .eq('id_pedido', id);

    // Seguridad: Clientes solo ven sus propios pedidos
    if (role === 'comprador' || role === 'cliente') {
      query = query.eq('id_comprador', Number(userId));
    }

    const { data, error: err } = await query.maybeSingle();

    if (err) throw err;
    if (!data) {
      const e = new Error('Pedido no encontrado o no tienes permisos para verlo.');
      e.statusCode = 404;
      throw e;
    }

    return success(res, { data: normalizarPedido(data) });
  } catch (err) {
    next(err);
  }
}

/* ─── POST /api/pedidos ──────────────────────────────── */
// Crea un pedido completo con su detalle desde el carrito del cliente
async function crear(req, res, next) {
  try {
    const { id: id_comprador } = req.user;
    const { items, observaciones } = req.body;

    // 1. Validar la estructura básica de los items
    if (!items || !Array.isArray(items) || items.length === 0) {
      const e = new Error('El pedido debe tener al menos un producto.');
      e.statusCode = 400;
      throw e;
    }

    // Validar cantidades y formato
    for (const item of items) {
      if (!item.id_producto || !item.cantidad || parseInt(item.cantidad, 10) <= 0) {
        const e = new Error('Cada producto debe tener un ID válido y una cantidad mayor a cero.');
        e.statusCode = 400;
        throw e;
      }
    }

    // 2. Obtener productos desde Supabase usando los id_producto únicos
    const uniqueProductIds = [...new Set(items.map(item => item.id_producto))];
    const { data: dbProductos, error: prodErr } = await supabase
      .from('productos')
      .select('id_producto, id_vendedor, precio')
      .in('id_producto', uniqueProductIds);

    if (prodErr) throw prodErr;

    // 3. Validar que todos los productos existan en el catálogo
    if (!dbProductos || dbProductos.length !== uniqueProductIds.length) {
      const e = new Error('Uno o más productos no existen en el inventario.');
      e.statusCode = 400;
      throw e;
    }

    // 4. Validar que todos los productos pertenezcan al mismo vendedor
    const vendedores = [...new Set(dbProductos.map(p => p.id_vendedor))];
    if (vendedores.length > 1) {
      const e = new Error('No se pueden comprar productos de diferentes vendedores en un mismo pedido.');
      e.statusCode = 400;
      throw e;
    }
    const id_vendedor = vendedores[0];

    // 5. Obtener canal de venta llamado "manual"
    const { data: canal, error: canalErr } = await supabase
      .from('canales_venta')
      .select('id_canal')
      .eq('nombre', 'manual')
      .maybeSingle();

    if (canalErr) throw canalErr;
    if (!canal) {
      const e = new Error('El canal de venta "manual" no está configurado en el sistema.');
      e.statusCode = 500;
      throw e;
    }

    // 6. Calcular el total del pedido usando los precios reales de la BD
    const preciosMap = {};
    dbProductos.forEach(p => {
      preciosMap[p.id_producto] = parseFloat(p.precio);
    });

    const total = items.reduce((sum, item) => {
      const precio = preciosMap[item.id_producto];
      return sum + (precio * parseInt(item.cantidad, 10));
    }, 0);

    // 7. Insertar el pedido en la tabla pedidos
    const { data: pedido, error: pedErr } = await supabase
      .from('pedidos')
      .insert({
        id_comprador,
        id_vendedor,
        id_canal:      canal.id_canal,
        estado:        'pendiente',
        observaciones: observaciones || null,
        total,
      })
      .select('id_pedido')
      .single();

    if (pedErr) throw pedErr;

    // 8. Insertar los detalles en detalle_pedido
    const detalles = items.map((item) => ({
      id_pedido:       pedido.id_pedido,
      id_producto:     item.id_producto,
      cantidad:        parseInt(item.cantidad, 10),
      precio_unitario: preciosMap[item.id_producto],
    }));

    const { error: detErr } = await supabase
      .from('detalle_pedido')
      .insert(detalles);

    if (detErr) throw detErr;

    logger.info('Pedido creado', { id_pedido: pedido.id_pedido, id_comprador, total });

    return success(res, {
      statusCode: 201,
      message: 'Pedido creado exitosamente.',
      data: { id_pedido: pedido.id_pedido, total, estado: 'pendiente' },
    });
  } catch (err) {
    next(err);
  }
}

/* ─── PUT /api/pedidos/:id/estado ────────────────────── */
// Solo admin/vendedor puede cambiar estado
async function actualizarEstado(req, res, next) {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const { role, id: userId } = req.user;

    // Alineado con el constraint CHECK de la base de datos (Esquema.sql)
    const ESTADOS_VALIDOS = ['pendiente', 'en_proceso', 'completado', 'cancelado'];
    if (!ESTADOS_VALIDOS.includes(estado)) {
      const e = new Error(`Estado inválido. Válidos: ${ESTADOS_VALIDOS.join(', ')}`);
      e.statusCode = 400;
      throw e;
    }


    const { data, error: err } = await supabase
      .from('pedidos')
      .update({ estado })
      .eq('id_pedido', id)
      .select('id_pedido, estado')
      .maybeSingle();

    if (err) throw err;
    if (!data) {
      const e = new Error('Pedido no encontrado.');
      e.statusCode = 404;
      throw e;
    }

    logger.info('Estado de pedido actualizado', { id, estado });
    return success(res, { message: 'Estado actualizado.', data });
  } catch (err) {
    next(err);
  }
}

/* ─── Normalizer ─────────────────────────────────────── */
function normalizarPedido(p) {
  return {
    id:           p.id_pedido,
    estado:       p.estado,
    observaciones: p.observaciones,
    total:        p.total,
    fecha:        p.fecha_pedido,
    canal:        p.canales_venta?.nombre || 'manual',
    cliente: p.cliente
      ? {
          id:        p.cliente.id_usuario,
          nombre:    p.cliente.nombre,
          correo:    p.cliente.correo,
          telefono:  p.cliente.telefono,
          direccion: p.cliente.direccion,
        }
      : null,
    vendedor: p.vendedor
      ? {
          id:        p.vendedor.id_usuario,
          nombre:    p.vendedor.nombre,
        }
      : null,
    productos: (p.detalle_pedido || []).map((d) => ({
      producto: {
        id:        d.productos?.id_producto,
        nombre:    d.productos?.nombre,
        imagen_url: d.productos?.imagen_url,
      },
      cantidad:        d.cantidad,
      precio_unitario: d.precio_unitario,
      subtotal:        d.cantidad * d.precio_unitario,
    })),
  };
}

module.exports = { listar, obtener, crear, actualizarEstado };
