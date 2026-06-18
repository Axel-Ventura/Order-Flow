// ============================================================
// OrderFlow — Datos Mock
// Simula las respuestas del backend para desarrollo del front
// ============================================================

export const categorias = [
  { id: 'todos', label: 'Todos' },
  { id: 'comida', label: 'Comida' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'postres', label: 'Postres' },
  { id: 'snacks', label: 'Snacks' },
]

export const productos = [
  {
    id: 'p1',
    nombre: 'Hamburguesa Sencilla',
    descripcion: 'Hamburguesa con carne 100% res, queso americano, lechuga, tomate y aderezo especial.',
    precio: 55.00,
    stock: 20,
    categoria: 'comida',
    estado: 'disponible',
    emoji: '🍔',
    imagen: null,
  },
  {
    id: 'p2',
    nombre: 'Papas a la Francesa',
    descripcion: 'Orden generosa de papas crujientes por dentro y doradas por fuera. Con aderezo a elegir.',
    precio: 35.00,
    stock: 30,
    categoria: 'snacks',
    estado: 'disponible',
    emoji: '🍟',
    imagen: null,
  },
  {
    id: 'p3',
    nombre: 'Refresco 600ml',
    descripcion: 'Bebida embotellada bien fría. Sabores: Cola, Naranja, Lima-Limón o Uva.',
    precio: 22.00,
    stock: 40,
    categoria: 'bebidas',
    estado: 'disponible',
    emoji: '🥤',
    imagen: null,
  },
  {
    id: 'p4',
    nombre: 'Pastel de Chocolate',
    descripcion: 'Rebanada húmeda de pastel de chocolate con ganache y crema batida.',
    precio: 45.00,
    stock: 12,
    categoria: 'postres',
    estado: 'disponible',
    emoji: '🍰',
    imagen: null,
  },
  {
    id: 'p5',
    nombre: 'Agua Natural 500ml',
    descripcion: 'Agua purificada en presentación de 500ml. Perfecta para acompañar tu orden.',
    precio: 15.00,
    stock: 60,
    categoria: 'bebidas',
    estado: 'disponible',
    emoji: '💧',
    imagen: null,
  },
  {
    id: 'p6',
    nombre: 'Alitas BBQ (6 pzas)',
    descripcion: 'Seis alitas bañadas en salsa BBQ ahumada. Incluye celery y aderezo ranch.',
    precio: 75.00,
    stock: 15,
    categoria: 'comida',
    estado: 'disponible',
    emoji: '🍗',
    imagen: null,
  },
  {
    id: 'p7',
    nombre: 'Brownie de Nuez',
    descripcion: 'Brownie artesanal con nueces, fudge de chocolate y un toque de vainilla.',
    precio: 38.00,
    stock: 8,
    categoria: 'postres',
    estado: 'disponible',
    emoji: '🍫',
    imagen: null,
  },
  {
    id: 'p8',
    nombre: 'Hot Dog Especial',
    descripcion: 'Salchicha de puerco en pan brioche con mostaza, catsup, cebolla y jalapeños.',
    precio: 42.00,
    stock: 0,
    categoria: 'comida',
    estado: 'agotado',
    emoji: '🌭',
    imagen: null,
  },
]

export const clientes = [
  {
    id: 'c1',
    nombre: 'Juan Pérez',
    correo: 'comprador@test.com',
    telefono: '2381234567',
    direccion: 'Tehuacán, Puebla',
    totalPedidos: 4,
    estado: 'activo',
    fechaRegistro: '2026-01-15',
  },
  {
    id: 'c2',
    nombre: 'Laura Gómez',
    correo: 'laura.gomez@email.com',
    telefono: '2389876543',
    direccion: 'Puebla, Puebla',
    totalPedidos: 2,
    estado: 'activo',
    fechaRegistro: '2026-02-20',
  },
  {
    id: 'c3',
    nombre: 'Carlos Ramírez',
    correo: 'carlos.r@email.com',
    telefono: '2381122334',
    direccion: 'San Martín Texmelucan, Puebla',
    totalPedidos: 7,
    estado: 'activo',
    fechaRegistro: '2026-01-05',
  },
  {
    id: 'c4',
    nombre: 'María Torres',
    correo: 'maria.torres@email.com',
    telefono: '2385566778',
    direccion: 'Atlixco, Puebla',
    totalPedidos: 1,
    estado: 'inactivo',
    fechaRegistro: '2026-03-10',
  },
  {
    id: 'c5',
    nombre: 'Roberto Sánchez',
    correo: 'r.sanchez@email.com',
    telefono: '2388899001',
    direccion: 'Izúcar de Matamoros, Puebla',
    totalPedidos: 3,
    estado: 'activo',
    fechaRegistro: '2026-02-01',
  },
]

export const pedidos = [
  {
    id: 'ORD-001',
    cliente: clientes[0],
    productos: [
      { producto: productos[0], cantidad: 2, subtotal: 110.00 },
      { producto: productos[1], cantidad: 1, subtotal: 35.00 },
    ],
    estado: 'completado',
    total: 145.00,
    fecha: '2026-06-10',
    observaciones: 'Sin cebolla en las hamburguesas',
    canal: 'manual',
  },
  {
    id: 'ORD-002',
    cliente: clientes[1],
    productos: [
      { producto: productos[5], cantidad: 1, subtotal: 75.00 },
      { producto: productos[2], cantidad: 2, subtotal: 44.00 },
    ],
    estado: 'en_proceso',
    total: 119.00,
    fecha: '2026-06-12',
    observaciones: '',
    canal: 'manual',
  },
  {
    id: 'ORD-003',
    cliente: clientes[2],
    productos: [
      { producto: productos[0], cantidad: 1, subtotal: 55.00 },
      { producto: productos[3], cantidad: 2, subtotal: 90.00 },
    ],
    estado: 'pendiente',
    total: 145.00,
    fecha: '2026-06-17',
    observaciones: 'Entregar después de las 3pm',
    canal: 'manual',
  },
  {
    id: 'ORD-004',
    cliente: clientes[3],
    productos: [
      { producto: productos[1], cantidad: 2, subtotal: 70.00 },
    ],
    estado: 'cancelado',
    total: 70.00,
    fecha: '2026-06-09',
    observaciones: '',
    canal: 'manual',
  },
  {
    id: 'ORD-005',
    cliente: clientes[4],
    productos: [
      { producto: productos[6], cantidad: 3, subtotal: 114.00 },
      { producto: productos[4], cantidad: 1, subtotal: 15.00 },
    ],
    estado: 'completado',
    total: 129.00,
    fecha: '2026-06-14',
    observaciones: '',
    canal: 'manual',
  },
]

export const reportesMensuales = [
  { mes: 'Ene', ventas: 3200, pedidos: 28 },
  { mes: 'Feb', ventas: 4100, pedidos: 35 },
  { mes: 'Mar', ventas: 3750, pedidos: 31 },
  { mes: 'Abr', ventas: 5200, pedidos: 44 },
  { mes: 'May', ventas: 4800, pedidos: 40 },
  { mes: 'Jun', ventas: 6100, pedidos: 52 },
]

export const estadisticasDashboard = {
  totalPedidos: 52,
  ingresosMes: 6100,
  totalClientes: 5,
  pedidosPendientes: 3,
  cambiosPedidos: '+12%',
  cambiosIngresos: '+8.5%',
  cambiosClientes: '+2',
  cambiosPendientes: '-1',
}

export const usuariosMock = [
  {
    id: 'u1',
    nombre: 'Juan Pérez',
    correo: 'comprador@test.com',
    password: '123456',
    rol: 'cliente',
    telefono: '2381234567',
    direccion: 'Tehuacán, Puebla',
  },
  {
    id: 'u2',
    nombre: 'María López',
    correo: 'vendedor@test.com',
    password: '123456',
    rol: 'admin',
    telefono: '2387654321',
    direccion: 'San Gabriel Chilac, Puebla',
  },
]

// Helpers
export const getBadgeClass = (estado) => {
  const map = {
    completado: 'badge-success',
    entregado:  'badge-success',
    activo:     'badge-success',
    en_proceso: 'badge-info',
    pendiente:  'badge-warning',
    cancelado:  'badge-danger',
    inactivo:   'badge-gray',
    disponible: 'badge-success',
    agotado:    'badge-danger',
  }
  return map[estado] || 'badge-gray'
}

export const getBadgeLabel = (estado) => {
  const map = {
    completado: 'Completado',
    entregado:  'Entregado',
    en_proceso: 'En Proceso',
    pendiente:  'Pendiente',
    cancelado:  'Cancelado',
    activo:     'Activo',
    inactivo:   'Inactivo',
    disponible: 'Disponible',
    agotado:    'Agotado',
  }
  return map[estado] || estado
}

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)

export const formatDate = (dateStr) =>
  new Date(dateStr + 'T12:00:00').toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
