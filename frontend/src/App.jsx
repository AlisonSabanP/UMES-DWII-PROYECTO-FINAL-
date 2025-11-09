import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Games from './pages/Games'
import GameDetail from './pages/GameDetail'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import BalloonPopGame from './pages/games/BalloonPopGame'
import PuzzleGame from './pages/games/PuzzleGame'
import './index.css'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <Router>
      <div className="min-h-screen bg-base-200 text-base-content">
        <Navbar />
      <main className="container mx-auto max-w-screen-2xl px-8 py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/:id" element={<GameDetail />} />
            <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/play/balloon-pop/:id" element={isAuthenticated ? <BalloonPopGame /> : <Navigate to="/login" />} />
            <Route path="/play/puzzle/:id" element={isAuthenticated ? <PuzzleGame /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
