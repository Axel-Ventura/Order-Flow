/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  const addToCart = (producto, cantidad = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.producto.id === producto.id)
      if (existing) {
        return prev.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        )
      }
      return [...prev, { producto, cantidad }]
    })
    showToast(`✓ ${producto.nombre} agregado al carrito`)
  }

  const removeFromCart = (productoId) => {
    setItems((prev) => prev.filter((i) => i.producto.id !== productoId))
  }

  const updateQty = (productoId, qty) => {
    if (qty < 1) { removeFromCart(productoId); return }
    setItems((prev) =>
      prev.map((i) =>
        i.producto.id === productoId ? { ...i, cantidad: qty } : i
      )
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0)
  const subtotal   = items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0)
  const envio      = items.length > 0 ? 25 : 0
  const total      = subtotal + envio

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, subtotal, envio, total, toast }}
    >
      {children}
      {toast && <div className="toast">{toast}</div>}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
