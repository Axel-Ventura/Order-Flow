/**
 * productosController — CRUD de productos.
 * Base route: /api/productos
 */
const supabase = require('../config/supabase');
const { success, error } = require('../utils/response');
const logger = require('../utils/logger');

/* ─── GET /api/productos ─────────────────────────────── */
async function listar(req, res, next) {
  try {
    const { estado, categoria } = req.query;

    let query = supabase
      .from('productos')
      .select('id_producto, nombre, descripcion, precio, stock, imagen_url, estado, id_tipo_negocio, tipos_negocio(nombre), usuarios!fk_producto_vendedor(nombre)')
      .order('id_producto');

    // Si es un vendedor logueado, solo mostramos sus propios productos (su inventario)
    if (req.user && req.user.role === 'vendedor') {
      query = query.eq('id_vendedor', req.user.id);
    }

    if (estado && estado !== 'todos') query = query.eq('estado', estado);

    const { data, error: err } = await query;
    if (err) throw err;

    return success(res, { data });
  } catch (err) {
    next(err);
  }
}

/* ─── GET /api/productos/:id ─────────────────────────── */
async function obtener(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error: err } = await supabase
      .from('productos')
      .select('id_producto, nombre, descripcion, precio, stock, imagen_url, estado, id_tipo_negocio, tipos_negocio(nombre), usuarios!fk_producto_vendedor(nombre)')
      .eq('id_producto', id)
      .maybeSingle();

    if (err) throw err;
    if (!data) {
      const e = new Error('Producto no encontrado.');
      e.statusCode = 404;
      throw e;
    }

    return success(res, { data });
  } catch (err) {
    next(err);
  }
}

/* ─── POST /api/productos ────────────────────────────── */
async function crear(req, res, next) {
  try {
    const { nombre, descripcion, precio, stock, imagen_url, id_tipo_negocio } = req.body;
    const id_vendedor = req.user.id;

    let tipoNegocioId = id_tipo_negocio;
    if (!tipoNegocioId) {
      // Buscar el primer tipo de negocio configurado en la base de datos (por ejemplo, 'alimentos')
      const { data: tipoNegocio, error: tipoErr } = await supabase
        .from('tipos_negocio')
        .select('id_tipo_negocio')
        .limit(1)
        .maybeSingle();

      if (tipoErr) throw tipoErr;
      if (!tipoNegocio) {
        const e = new Error('No hay tipos de negocio configurados en la base de datos.');
        e.statusCode = 500;
        throw e;
      }
      tipoNegocioId = tipoNegocio.id_tipo_negocio;
    }

    const { data, error: err } = await supabase
      .from('productos')
      .insert({
        nombre,
        descripcion: descripcion || null,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        imagen_url: imagen_url || null,
        id_tipo_negocio: tipoNegocioId,
        id_vendedor,
        estado: parseInt(stock) > 0 ? 'disponible' : 'agotado',
      })
      .select()
      .single();

    if (err) throw err;

    logger.info('Producto creado', { id: data.id_producto, nombre });
    return success(res, { statusCode: 201, message: 'Producto creado.', data });
  } catch (err) {
    next(err);
  }
}

/* ─── PUT /api/productos/:id ─────────────────────────── */
async function actualizar(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, imagen_url, estado, id_tipo_negocio } = req.body;

    const updates = {};
    if (nombre !== undefined)       updates.nombre = nombre;
    if (descripcion !== undefined)  updates.descripcion = descripcion;
    if (precio !== undefined)       updates.precio = parseFloat(precio);
    if (imagen_url !== undefined)   updates.imagen_url = imagen_url;
    if (id_tipo_negocio !== undefined) updates.id_tipo_negocio = id_tipo_negocio ? parseInt(id_tipo_negocio) : null;
    if (stock !== undefined) {
      updates.stock = parseInt(stock);
      // Auto-update estado based on stock unless explicitly provided
      if (estado === undefined) {
        updates.estado = updates.stock > 0 ? 'disponible' : 'agotado';
      }
    }
    if (estado !== undefined) updates.estado = estado;

    const { data, error: err } = await supabase
      .from('productos')
      .update(updates)
      .eq('id_producto', id)
      .select()
      .maybeSingle();

    if (err) throw err;
    if (!data) {
      const e = new Error('Producto no encontrado.');
      e.statusCode = 404;
      throw e;
    }

    logger.info('Producto actualizado', { id });
    return success(res, { message: 'Producto actualizado.', data });
  } catch (err) {
    next(err);
  }
}

/* ─── DELETE /api/productos/:id ──────────────────────── */
async function eliminar(req, res, next) {
  try {
    const { id } = req.params;
    const idVendedor = req.user.id;

    // 1. Verificar que el producto existe y pertenece al vendedor autenticado
    const { data: producto, error: findErr } = await supabase
      .from('productos')
      .select('id_producto, nombre, id_vendedor')
      .eq('id_producto', id)
      .maybeSingle();

    if (findErr) throw findErr;
    if (!producto) {
      const e = new Error('Producto no encontrado.');
      e.statusCode = 404;
      throw e;
    }

    if (String(producto.id_vendedor) !== String(idVendedor)) {
      const e = new Error('No tienes permiso para eliminar este producto.');
      e.statusCode = 403;
      throw e;
    }

    // 2. Verificar si el producto está referenciado en algún pedido
    const { count: pedidosConProducto } = await supabase
      .from('detalle_pedido')
      .select('*', { count: 'exact', head: true })
      .eq('id_producto', id);

    if (pedidosConProducto > 0) {
      const e = new Error(
        `No se puede eliminar "${producto.nombre}" porque está en ${pedidosConProducto} pedido(s). Puedes marcarlo como "agotado" en su lugar.`
      );
      e.statusCode = 409;
      throw e;
    }

    // 3. Eliminar el producto
    const { error: err } = await supabase
      .from('productos')
      .delete()
      .eq('id_producto', id);

    if (err) throw err;

    logger.info('Producto eliminado', { id, nombre: producto.nombre });
    return success(res, { message: `Producto "${producto.nombre}" eliminado correctamente.` });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
