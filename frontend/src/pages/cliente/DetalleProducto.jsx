import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react'
import { productosApi } from '../../services/productosApi'
import { inferEmoji } from './Catalogo'
import { useCart } from '../../context/CartContext'

export default function DetalleProducto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [cantidad, setCantidad] = useState(1)
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    productosApi.obtener(id)
      .then((data) => setProducto({
        id:          data.id_producto,
        nombre:      data.nombre,
        descripcion: data.descripcion || '',
        precio:      parseFloat(data.precio),
        stock:       data.stock,
        estado:      data.estado,
        emoji:       inferEmoji(data.nombre, data.tipos_negocio?.nombre),
        imagen_url:  data.imagen_url,
        vendedor:    data.usuarios?.nombre || 'Establecimiento',
      }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="empty-state"><div className="empty-icon">⏳</div><p>Cargando producto...</p></div>

  if (error || !producto) {
    return (
      <div className="empty-state">
        <div className="empty-icon">😕</div>
        <h3>Producto no encontrado</h3>
        <button className="btn btn-secondary mt-4" onClick={() => navigate('/')}>
          Volver al catálogo
        </button>
      </div>
    )
  }

  const agotado = producto.estado === 'agotado' || producto.stock === 0

  const handleAgregar = () => {
    addToCart(producto, cantidad)
    navigate('/')
  }

  return (
    <div>
      <button
        className="btn btn-ghost mb-4"
        style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 0 }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        Regresar
      </button>

      <div className="card" style={{ maxWidth: 740, margin: '0 auto' }}>
        <div className="detalle-grid">
          {/* Imagen */}
          <div className="detalle-img" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--gray-50)',
            fontSize: '6rem',
            minHeight: 320,
            borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)',
          }}>
            {producto.imagen_url
              ? <img src={producto.imagen_url} alt={producto.nombre} style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)' }} />
              : producto.emoji
            }
          </div>

          {/* Info */}
          <div style={{ padding: '32px 28px' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', background: 'var(--primary-50)', color: 'var(--primary-700)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                🏬 {producto.vendedor}
              </span>
              {agotado && <span className="badge badge-danger" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>Agotado</span>}
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>{producto.nombre}</h1>
            <p style={{ fontSize: '0.9rem', marginBottom: 20, lineHeight: 1.6 }}>{producto.descripcion}</p>

            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-600)', marginBottom: 24 }}>
              ${producto.precio.toFixed(2)}
            </div>

            {!agotado && (
              <>
                {/* Cantidad */}
                <div className="form-group" style={{ marginBottom: 24 }}>
                  <label className="form-label">Cantidad</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: 'fit-content' }}>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => setCantidad(Math.max(1, cantidad - 1))}>
                        <Minus size={14} />
                      </button>
                      <div className="qty-value">{cantidad}</div>
                      <button className="qty-btn" onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {producto.stock} disponibles
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                  Subtotal: <strong style={{ color: 'var(--text-primary)' }}>
                    ${(producto.precio * cantidad).toFixed(2)}
                  </strong>
                </div>

                <button className="btn btn-primary btn-full btn-lg" onClick={handleAgregar}>
                  <ShoppingCart size={18} />
                  Agregar al Carrito
                </button>
              </>
            )}

            {agotado && (
              <button className="btn btn-secondary btn-full" disabled>
                Producto agotado
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
