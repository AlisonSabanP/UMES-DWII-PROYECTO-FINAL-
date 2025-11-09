import { Link } from 'react-router-dom'
import { useAuthStore, useCartStore } from '../stores'
import '../index.css'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { getItemCount } = useCartStore()
  
  const cartItemCount = getItemCount()

  return (
    <nav className="navbar bg-pink-500 text-primary-content px-6">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          ARCADESTORE
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/games">Juegos</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/profile">Perfil</Link></li>    
              {user?.role === 'admin' && (
                <li><Link to="/admin">Admin</Link></li>
              )}
            </>
          )}
        </ul>
      </div>
      
      <div className="navbar-end gap-4 w-full">
        {isAuthenticated ? (
          <>
            <Link to="/cart" className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0L10 13m0 0h8.5M17 13v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="badge badge-sm indicator-item">{cartItemCount}</span>
                )}
              </div>
            </Link>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <div className="bg-neutral text-neutral-content rounded-full w-10 h-10 flex items-center justify-center">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
              </label>
              <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <Link to="/profile" className="justify-between text-black">
                    Perfil
                  </Link>
                </li>
                <li><a className="btn" onClick={logout}>Cerrar sesión</a></li>
              </ul>
            </div>
          </>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost">Iniciar sesión</Link>
            <Link to="/register" className="btn btn-ghost">Registrarse</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
