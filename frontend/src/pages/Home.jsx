import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [featuredGames, setFeaturedGames] = useState([]);

  const fetchFeaturedGames = async () => {
    try {
      const response = await axios.get('/api/games');
      const games = response.data?.games || [];
      const featured = games.slice(0, 8);
      setFeaturedGames(featured);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  useEffect(() => {
    fetchFeaturedGames();
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Juegos destacados</h1>
        <p className="text-lg opacity-70">Juega nuestros títulos más populares</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {featuredGames.map((game) => (
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
                <span className="badge badge-secondary">${game.price}</span>
                <span className="badge badge-outline">{game.category}</span>
              </div>
              <div className="card-actions justify-center gap-2">
                <Link to={`/games/${game._id}`} className="btn btn-primary btn-sm">
                  Detalles
                </Link>
                <Link to="/games" className="btn btn-ghost btn-sm">Todos los juegos</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {featuredGames.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl opacity-70">No hay juegos destacados disponibles</p>
        </div>
      )}
    </div>
  );
}
