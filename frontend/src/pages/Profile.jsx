import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores'
import { gameAPI } from '../utils/api'

const Profile = () => {
  const { user } = useAuthStore()
  const [ownedGames, setOwnedGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('games')

  useEffect(() => {
    const fetchUserGames = async () => {
      try {
        const response = await gameAPI.getUserGames()
        setOwnedGames(response.data?.games || [])
      } catch (error) {
        console.error('Error al recuperar juegos de usuario:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserGames()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex items-center gap-6">
            <div className="avatar">
              <div className="w-24 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                <span className="text-3xl">{user?.fullName?.charAt(0)?.toUpperCase()}</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user?.fullName}</h1>
              <p className="text-lg opacity-70">{user?.email}</p>
              <div className="badge badge-primary mt-2">{user?.role}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="tabs tabs-boxed mb-6">
        <button 
          className={`tab ${activeTab === 'games' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          Mis Juegos ({ownedGames.length})
        </button>
        <button 
          className={`tab ${activeTab === 'stats' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Estadísticas
        </button>
      </div>

      {activeTab === 'games' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownedGames.map((game) => (
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
                <h3 className="card-title">{game.name}</h3>
                <p className="text-sm opacity-70 line-clamp-2">{game.description}</p>
                <div className="flex gap-2 mb-4">
                  <span className="badge badge-outline">{game.category}</span>
                  <span className="badge badge-outline capitalize">{game.gameType}</span>
                </div>
                <div className="card-actions">
                  <Link 
                    to={`/games/${game._id}`} 
                    className="btn btn-primary btn-sm"
                  >
                    Ver detalles
                  </Link>
                  <Link 
                    to={`/play/${game.gameType}/${game._id}`} 
                    className="btn btn-secondary btn-sm"
                  >
                    Jugar ahora
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-title">Juegos comprados</div>
            <div className="stat-value text-primary">{ownedGames.length}</div>
          </div>
          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-title">Total gastado</div>
            <div className="stat-value text-secondary">
              ${ownedGames.reduce((total, game) => total + game.price, 0).toFixed(2)}
            </div>
          </div>
          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-title">Tipo de cuenta</div>
            <div className="stat-value text-accent capitalize">{user?.role}</div>
          </div>
          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-title">Fecha de registro</div>
            <div className="stat-value text-info">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Desconocido'}
            </div>
          </div>
        </div>
      )}

      {ownedGames.length === 0 && activeTab === 'games' && (
        <div className="text-center py-12">
          <p className="text-xl opacity-70 mb-4">No tienes juegos aún</p>
          <Link to="/games" className="btn btn-primary">
            Explorar juegos
          </Link>
        </div>
      )}
    </div>
  )
}

export default Profile
