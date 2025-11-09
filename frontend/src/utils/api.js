import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage') ? 
    JSON.parse(localStorage.getItem('auth-storage')).state?.token : null
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
}

export const gameAPI = {
  getAllGames: () => api.get('/games'),
  getGameById: (id) => api.get(`/games/${id}`),
  createGame: (gameData) => api.post('/games', gameData),
  updateGame: (id, gameData) => api.put(`/games/${id}`, gameData),
  deleteGame: (id) => api.delete(`/games/${id}`),
  purchaseGame: (gameId) => api.post('/games/purchase', { gameId }),
  getUserGames: () => api.get('/games/user/library'),
  submitScore: (gameId, scoreData) => api.post('/games/submit-score', { gameId, ...scoreData }),
  getRankings: (gameId) => api.get(`/games/${gameId}/rankings`),
}

export default api
