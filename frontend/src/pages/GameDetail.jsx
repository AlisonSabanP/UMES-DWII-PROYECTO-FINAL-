import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCartStore, useAuthStore } from '../stores'
import { gameAPI } from '../utils/api'

const GameDetail = () => {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rankings, setRankings] = useState([])
  const [userGames, setUserGames] = useState([])
  
  const { addToCart, isInCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const [gameResponse, rankingsResponse] = await Promise.all([
          gameAPI.getGameById(id),
          gameAPI.getRankings(id)
        ])
        
        setGame(gameResponse.data?.game || null)
        setRankings(rankingsResponse.data?.rankings || [])
        
        if (isAuthenticated) {
          const userGamesResponse = await gameAPI.getUserGames()
          setUserGames(userGamesResponse.data?.games || [])
        }
      } catch (error) {
        console.error('Error al obtener datos del juego:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGameData()
  }, [id, isAuthenticated])

  const handleAddToCart = () => {
    addToCart(game)
  }

  const handlePlayGame = () => {
    if (game?.gameType === 'balloon-pop') {
      window.location.href = `/play/balloon-pop/${id}`
    } else if (game?.gameType === 'puzzle') {
      window.location.href = `/play/puzzle/${id}`
    }
  }

  const isOwned = userGames.some(userGame => userGame._id === id)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Juego no encontrado</h1>
        <Link to="/games" className="btn btn-primary mt-4">
          Volver a Juegos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure className="lg:w-1/2">
          <img 
            src={game.icon} 
            alt={game.name}
            className="w-full h-96 object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgNzVMMzAwIDE1MEgyMDBWMjI1SDEwMFYxNTBIMjAwVjc1WiIgZmlsbD0iIzlCOUJBMCIvPgo8L3N2Zz4K'
            }}
          />
        </figure>
        <div className="card-body lg:w-1/2">
          <h1 className="card-title text-3xl">{game.name}</h1>
          <p className="text-lg opacity-70">{game.description}</p>
          <div className="flex gap-2 my-4">
            <span className="badge badge-lg badge-secondary">${game.price}</span>
            <span className="badge badge-lg badge-outline">{game.category}</span>
            <span className="badge badge-lg badge-outline capitalize">{game.gameType}</span>
          </div>
          
          <div className="card-actions justify-start">
            {isAuthenticated ? (
              isOwned ? (
                <button onClick={handlePlayGame} className="btn btn-primary btn-lg">
                  Jugar ahora
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleAddToCart}
                    className={`btn btn-lg ${isInCart(id) ? 'btn-success' : 'btn-secondary'}`}
                    disabled={isInCart(id)}
                  >
                    {isInCart(id) ? 'En carrito' : 'Agregar al carrito'}
                  </button>
                  <Link to="/cart" className="btn btn-outline btn-lg">
                    Ver Carrito
                  </Link>
                </>
              )
            ) : (
              <Link to="/login" className="btn btn-primary btn-lg">
                Iniciar Sesión para Jugar 
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">Tabla de clasificación</h2>
          {rankings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Puesto</th>
                    <th>Jugador</th>
                    <th>Puntuación</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((ranking, index) => (
                    <tr key={ranking._id} className={index < 3 ? 'bg-base-200' : ''}>
                      <td>
                        <div className="flex items-center gap-2">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && index + 1}
                        </div>
                      </td>
                      <td>{ranking.user.fullName}</td>
                      <td>{ranking.score.toLocaleString()}</td>
                      <td>{new Date(ranking.achievedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center opacity-70">Aún no hay puntuaciones. ¡Sé el primero en jugar!</p>
          )}
        </div>
      </div>

      <div className="text-center">
        <Link to="/games" className="btn btn-outline">
          ← Volver a Juegos
        </Link>
      </div>
    </div>
  )
}

export default GameDetail
