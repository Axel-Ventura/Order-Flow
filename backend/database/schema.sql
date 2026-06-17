-- =====================================================
-- OrderFlow - Base de datos inicial para Supabase
-- Issue #20: DB — Modelos y datos iniciales
-- =====================================================

-- =========================
-- TABLA: roles
-- =========================
CREATE TABLE roles (
  id_rol BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- TABLA: tipos_negocio
-- Sirve para adaptar el sistema según el giro del negocio
-- Ejemplo: alimentos, ropa, electronica, servicios
-- =========================
CREATE TABLE tipos_negocio (
  id_tipo_negocio BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- TABLA: canales_venta
-- En el MVP puede usarse manual
-- =========================
CREATE TABLE canales_venta (
  id_canal BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT
);

-- =========================
-- TABLA: usuarios
-- Incluye comprador y vendedor
-- =========================
CREATE TABLE usuarios (
  id_usuario BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_rol BIGINT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  direccion VARCHAR(255),
  correo VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  fecha_registro TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_usuario_rol
    FOREIGN KEY (id_rol)
    REFERENCES roles(id_rol)
    ON DELETE RESTRICT
);

-- =========================
-- TABLA: productos
-- Productos registrados por el vendedor
-- =========================
CREATE TABLE productos (
  id_producto BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_vendedor BIGINT NOT NULL,
  id_tipo_negocio BIGINT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  imagen_url VARCHAR(255),
  estado VARCHAR(20) NOT NULL DEFAULT 'disponible'
    CHECK (estado IN ('disponible', 'agotado')),
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_producto_vendedor
    FOREIGN KEY (id_vendedor)
    REFERENCES usuarios(id_usuario)
    ON DELETE CASCADE,

  CONSTRAINT fk_producto_tipo_negocio
    FOREIGN KEY (id_tipo_negocio)
    REFERENCES tipos_negocio(id_tipo_negocio)
    ON DELETE RESTRICT,

  CONSTRAINT producto_unico_por_vendedor
    UNIQUE (id_vendedor, nombre)
);

-- =========================
-- TABLA: pedidos
-- Guarda el pedido general
-- =========================
CREATE TABLE pedidos (
  id_pedido BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_comprador BIGINT NOT NULL,
  id_vendedor BIGINT NOT NULL,
  id_canal BIGINT NOT NULL,
  fecha_pedido TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  estado VARCHAR(30) NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'en_proceso', 'completado', 'cancelado')),
  observaciones TEXT,
  total DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),

  CONSTRAINT fk_pedido_comprador
    FOREIGN KEY (id_comprador)
    REFERENCES usuarios(id_usuario)
    ON DELETE CASCADE,

  CONSTRAINT fk_pedido_vendedor
    FOREIGN KEY (id_vendedor)
    REFERENCES usuarios(id_usuario)
    ON DELETE CASCADE,

  CONSTRAINT fk_pedido_canal
    FOREIGN KEY (id_canal)
    REFERENCES canales_venta(id_canal)
    ON DELETE RESTRICT
);

-- =========================
-- TABLA: detalle_pedido
-- Guarda los productos incluidos dentro de un pedido
-- =========================
CREATE TABLE detalle_pedido (
  id_detalle BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_pedido BIGINT NOT NULL,
  id_producto BIGINT NOT NULL,
  cantidad INT NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
  subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,

  CONSTRAINT fk_detalle_pedido
    FOREIGN KEY (id_pedido)
    REFERENCES pedidos(id_pedido)
    ON DELETE CASCADE,

  CONSTRAINT fk_detalle_producto
    FOREIGN KEY (id_producto)
    REFERENCES productos(id_producto)
    ON DELETE RESTRICT,

  CONSTRAINT producto_no_repetido_en_pedido
    UNIQUE (id_pedido, id_producto)
);

-- =========================
-- ÍNDICES
-- =========================
CREATE INDEX idx_productos_vendedor ON productos(id_vendedor);
CREATE INDEX idx_productos_tipo_negocio ON productos(id_tipo_negocio);
CREATE INDEX idx_pedidos_comprador ON pedidos(id_comprador);
CREATE INDEX idx_pedidos_vendedor ON pedidos(id_vendedor);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_detalle_pedido ON detalle_pedido(id_pedido);






