import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores'
import { gameAPI } from '../utils/api'

const Cart = () => {
  const { items, removeFromCart, clearCart, getTotalPrice } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const total = getTotalPrice()

  const handleRemoveFromCart = (gameId) => {
    removeFromCart(gameId)
  }

  const handleCheckout = async () => {
    setLoading(true)
    setError('')
    
    try {
      for (const game of items) {
        await gameAPI.purchaseGame(game._id)
      }
      
      clearCart()
      navigate('/profile')
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudo completar la compra. Por favor, inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
          <p className="opacity-70 mb-8">Agrega algunos juegos increíbles a tu carrito para comenzar a jugar!</p>
          <Link to="/games" className="btn btn-primary">
            Explorar Juegos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>
      
      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((game) => (
              <div key={game._id} className="card card-side bg-base-100 shadow-xl">
                <figure className="w-32 h-32">
                  <img 
                    src={game.icon} 
                    alt={game.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02NCAzMkw5NiA2NEg2NFY5NkgzMlY2NEg2NFYzMloiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+Cg=='
                    }}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{game.name}</h2>
                  <p className="text-sm opacity-70">{game.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-secondary">${game.price}</span>
                    <button 
                      onClick={() => handleRemoveFromCart(game._id)}
                      className="btn btn-error btn-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-xl sticky top-4">
            <div className="card-body">
              <h3 className="card-title">Resumen de la Compra</h3>
              
              <div className="space-y-2 mt-4">
                <div className="flex justify-between">
                  <span>Artículos ({items.length}):</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-secondary">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="card-actions mt-6">
                <button 
                  onClick={handleCheckout}
                  className={`btn btn-primary btn-block ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Pagar'}
                </button>
                <button 
                  onClick={clearCart}
                  className="btn btn-outline btn-error btn-block"
                >
                  Vaciar carrito
                </button>
              </div>
              
              <div className="text-center mt-4">
                <Link to="/games" className="link link-primary">
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
