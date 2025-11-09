import { useState, useEffect } from 'react'
import { gameAPI } from '../utils/api'

const AdminDashboard = () => {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingGame, setEditingGame] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    icon: '',
    gameType: 'balloon-pop',
  })

  useEffect(() => {
    fetchGames()
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const gameData = {
        ...formData,
        price: parseFloat(formData.price),
      }

      if (editingGame) {
        await gameAPI.updateGame(editingGame._id, gameData)
      } else {
        await gameAPI.createGame(gameData)
      }
      
      resetForm()
      fetchGames()
    } catch (error) {
      console.error('Error al guardar el juego:', error)
    }
  }

  const handleEdit = (game) => {
    setEditingGame(game)
    setFormData({
      name: game.name,
      description: game.description,
      price: game.price.toString(),
      category: game.category,
      icon: game.icon,
      gameType: game.gameType,
    })
    setShowForm(true)
  }

  const handleDelete = async (gameId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este juego?')) {
      try {
        await gameAPI.deleteGame(gameId)
        fetchGames()
      } catch (error) {
        console.error('Error al eliminar el juego:', error)
      }
    }
  }

  const resetForm = () => {
    setEditingGame(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      icon: '',
      gameType: 'balloon-pop',
    })
    setShowForm(false)
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancelar' : 'Agregar nuevo juego'}
        </button>
      </div>

      {showForm && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              {editingGame ? 'Editar juego' : 'Agregar nuevo juego'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nombre del juego</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input input-bordered"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Categoria</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="select select-bordered"
                    required
                  >
                    <option value="action">Acción</option>
                    <option value="puzzle">Rompecabezas</option>
                    <option value="strategy">Estrategia</option>
                    <option value="adventure">Aventura</option>
                    <option value="arcade">Arcade</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Precio (Q)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="input input-bordered"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Tipo de Juego</span>
                  </label>
                  <select
                    value={formData.gameType}
                    onChange={(e) => setFormData({...formData, gameType: e.target.value})}
                    className="select select-bordered"
                  >
                    <option value="balloon-pop">Balloon Pop</option>
                    <option value="puzzle">Rompecabezas</option>
                  </select>
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Descripción</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="textarea textarea-bordered h-24"
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">URL de ícono</span>
                </label>
                <input
                  type="url"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="input input-bordered"
                  placeholder="https://example.com/game-icon.png"
                />
              </div>
              
              <div className="card-actions justify-end">
                <button type="button" onClick={resetForm} className="btn btn-ghost">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingGame ? 'Actualizar Juego' : 'Crear Juego'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Administrar Juegos</h2>    
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Icono</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Tipo</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr key={game._id}>
                    <td>
                      <div className="avatar">
                        <div className="w-12 rounded">
                          <img 
                            src={game.icon} 
                            alt={game.name}
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAxMkwxMiAyNEgyNFYzNkgzNlYyNEgyNFYxMloiIGZpbGw9IiM5QjlCQTAiLz4KPC9zdmc+Cg=='}
                            }
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-bold">{game.name}</div>
                      <div className="text-sm opacity-50">{game.description.substring(0, 30)}...</div>
                    </td>
                    <td>{game.category}</td>
                    <td className="capitalize">{game.gameType}</td>
                    <td>${game.price}</td>
                    <td>
                      <div className={`badge ${game.isActive ? 'badge-success' : 'badge-error'}`}>
                        {game.isActive ? 'Activo' : 'Inactivo'}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(game)}
                          className="btn btn-sm btn-info"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(game._id)}
                          className="btn btn-sm btn-error"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {games.length === 0 && (
            <div className="text-center py-8">
              <p className="text-lg opacity-70">No se encontraron juegos. ¡Crea tu primer juego!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
