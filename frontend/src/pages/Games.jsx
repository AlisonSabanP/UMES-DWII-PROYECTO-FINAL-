import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../stores'
import { gameAPI } from '../utils/api'

const Games = () => {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const { addToCart, isInCart } = useCartStore()

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await gameAPI.getAllGames()
        setGames(response.data?.games || [])
      } catch (error) {
        console.error('Error fetching games:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  const categories = ['all', ...Array.from(new Set(games.map(game => game.category)))]

  const filteredGames = games.filter(game => {
    const matchesCategory = category === 'all' || game.category === category
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        game.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddToCart = (game) => {
    addToCart(game)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Todos los juegos</h1>
        <p className="text-lg opacity-70">Descubre nuestra colección de increíbles juegos.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="form-control">
          <input
            type="text"
            placeholder="Buscar juegos..."
            className="input input-bordered w-full md:w-96"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <select
            className="select select-bordered"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredGames.map((game) => (
          <div key={game._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <figure className="px-4 pt-4">
              <img 
                src={game.icon} 
                alt={game.name}
                className="rounded-xl h-48 w-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNTBMMTUwIDEwMEgxMDBWMTUwSDUwVjEwMEgxMDBWNTBaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo='
                }}
              />
            </figure>
            <div className="card-body items-center text-center">
              <h3 className="card-title text-lg">{game.name}</h3>
              <p className="text-sm opacity-70 line-clamp-2">{game.description}</p>
              <div className="flex gap-2 mb-4">
                <span className="badge badge-secondary">Q{game.price}</span>
                <span className="badge badge-outline">{game.category}</span>
              </div>
              <div className="card-actions justify-center gap-2">
                <Link to={`/games/${game._id}`} className="btn btn-primary btn-sm">
                  Detalles
                </Link>
                <button 
                  onClick={() => handleAddToCart(game)}
                  className={`btn btn-sm ${isInCart(game._id) ? 'btn-success' : 'btn-outline'}`}
                  disabled={isInCart(game._id)}
                >
                  {isInCart(game._id) ? 'En Carrito' : 'Agregar al Carrito'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl opacity-70">No se encontraron juegos que coincidan con sus criterios de búsqueda.</p>
        </div>
      )}
    </div>
  )
}

export default Games
