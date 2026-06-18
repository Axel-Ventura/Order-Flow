-- =====================================================
-- OrderFlow - Datos iniciales para pruebas
-- Issue #20
-- =====================================================

-- =========================
-- ROLES
-- =========================
INSERT INTO roles (nombre, descripcion)
VALUES
('comprador', 'Usuario que puede realizar pedidos'),
('vendedor', 'Usuario que puede registrar productos y gestionar pedidos'),
('admin', 'Usuario administrador del sistema')
ON CONFLICT (nombre) DO NOTHING;

-- =========================
-- TIPOS DE NEGOCIO
-- =========================
INSERT INTO tipos_negocio (nombre, descripcion)
VALUES
('Alimentos', 'Comida, bebidas, postres o antojitos'),
('Moda', 'Ropa, calzado o accesorios de moda'),
('Electrónica', 'Productos y componentes electrónicos'),
('Hogar', 'Artículos para el hogar y decoración'),
('Belleza y Salud', 'Productos de cuidado personal, salud y estética'),
('Mascotas', 'Alimentos, accesorios y servicios para mascotas'),
('Deportes', 'Equipamiento y accesorios deportivos'),
('Automotriz', 'Repuestos y accesorios para vehículos'),
('Servicios', 'Servicios profesionales y técnicos'),
('Educación', 'Material de enseñanza, cursos y tutorías'),
('Artesanías', 'Productos hechos a mano y tradicionales'),
('Otros', 'Otros tipos de negocio y giros comerciales')
ON CONFLICT (nombre) DO NOTHING;

-- =========================
-- CANALES DE VENTA
-- =========================
INSERT INTO canales_venta (nombre, descripcion)
VALUES
('manual', 'Pedido registrado manualmente desde el sistema'),
('whatsapp', 'Pedido recibido desde WhatsApp Business'),
('facebook', 'Pedido recibido desde Facebook'),
('instagram', 'Pedido recibido desde Instagram')
ON CONFLICT (nombre) DO NOTHING;

-- =========================
-- USUARIO COMPRADOR
-- =========================
INSERT INTO usuarios (
  id_rol,
  nombre,
  telefono,
  direccion,
  correo,
  password_hash
)
VALUES (
  (SELECT id_rol FROM roles WHERE nombre = 'comprador'),
  'Juan Pérez',
  '2381234567',
  'Tehuacán, Puebla',
  'comprador@test.com',
  'password_de_prueba_hash'
)
ON CONFLICT (correo) DO NOTHING;

-- =========================
-- USUARIO VENDEDOR
-- =========================
INSERT INTO usuarios (
  id_rol,
  nombre,
  telefono,
  direccion,
  correo,
  password_hash
)
VALUES (
  (SELECT id_rol FROM roles WHERE nombre = 'vendedor'),
  'María López',
  '2387654321',
  'San Gabriel Chilac, Puebla',
  'vendedor@test.com',
  'password_de_prueba_hash'
)
ON CONFLICT (correo) DO NOTHING;

-- =========================
-- PRODUCTOS DE PRUEBA
-- Tipo de negocio: alimentos
-- =========================
INSERT INTO productos (
  id_vendedor,
  id_tipo_negocio,
  nombre,
  descripcion,
  precio,
  stock,
  imagen_url,
  estado
)
VALUES
(
  (SELECT id_usuario FROM usuarios WHERE correo = 'vendedor@test.com'),
  (SELECT id_tipo_negocio FROM tipos_negocio WHERE nombre = 'Alimentos'),
  'Hamburguesa sencilla',
  'Hamburguesa con carne, queso y verduras',
  55.00,
  20,
  'hamburguesa.jpg',
  'disponible'
),
(
  (SELECT id_usuario FROM usuarios WHERE correo = 'vendedor@test.com'),
  (SELECT id_tipo_negocio FROM tipos_negocio WHERE nombre = 'Alimentos'),
  'Papas a la francesa',
  'Orden de papas crujientes',
  35.00,
  30,
  'papas.jpg',
  'disponible'
),
(
  (SELECT id_usuario FROM usuarios WHERE correo = 'vendedor@test.com'),
  (SELECT id_tipo_negocio FROM tipos_negocio WHERE nombre = 'Alimentos'),
  'Refresco 600ml',
  'Bebida embotellada',
  22.00,
  40,
  'refresco.jpg',
  'disponible'
),
(
  (SELECT id_usuario FROM usuarios WHERE correo = 'vendedor@test.com'),
  (SELECT id_tipo_negocio FROM tipos_negocio WHERE nombre = 'Alimentos'),
  'Pastel de chocolate',
  'Rebanada de pastel de chocolate',
  45.00,
  12,
  'pastel.jpg',
  'disponible'
)
ON CONFLICT (id_vendedor, nombre) DO NOTHING;

-- =========================
-- PEDIDO DE PRUEBA
-- =========================
INSERT INTO pedidos (
  id_comprador,
  id_vendedor,
  id_canal,
  estado,
  observaciones,
  total
)
SELECT
  comprador.id_usuario,
  vendedor.id_usuario,
  canal.id_canal,
  'pendiente',
  'Pedido de prueba inicial',
  112.00
FROM usuarios comprador
CROSS JOIN usuarios vendedor
CROSS JOIN canales_venta canal
WHERE comprador.correo = 'comprador@test.com'
AND vendedor.correo = 'vendedor@test.com'
AND canal.nombre = 'manual'
AND NOT EXISTS (
  SELECT 1
  FROM pedidos
  WHERE observaciones = 'Pedido de prueba inicial'
);

-- =========================
-- DETALLE DEL PEDIDO
-- =========================
INSERT INTO detalle_pedido (
  id_pedido,
  id_producto,
  cantidad,
  precio_unitario
)
SELECT
  pedido.id_pedido,
  producto.id_producto,
  1,
  producto.precio
FROM pedidos pedido
JOIN productos producto
  ON producto.nombre IN (
    'Hamburguesa sencilla',
    'Papas a la francesa',
    'Refresco 600ml'
  )
WHERE pedido.observaciones = 'Pedido de prueba inicial'
ON CONFLICT (id_pedido, id_producto) DO NOTHING;