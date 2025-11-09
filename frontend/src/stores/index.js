import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      
      updateUser: (userData) => set({ user: { ...get().user, ...userData } }),
      
      getAuthHeaders: () => {
        const token = get().token
        return token ? { Authorization: `Bearer ${token}` } : {}
      }
    }),
    {
      name: 'auth-storage',
    }
  )
)

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (game) => set((state) => {
        const existingItem = state.items.find(item => item._id === game._id)
        if (existingItem) {
          return state
        }
        return { items: [...state.items, game] }
      }),
      
      removeFromCart: (gameId) => set((state) => ({
        items: state.items.filter(item => item._id !== gameId)
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price, 0)
      },
      
      getItemCount: () => get().items.length,
      
      isInCart: (gameId) => {
        return get().items.some(item => item._id === gameId)
      }
    }),
    {
      name: 'cart-storage',
    }
  )
)

const useGameStore = create((set, get) => ({
  games: [],
  loading: false,
  error: null,
  
  setGames: (games) => set({ games }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  addGame: (game) => set((state) => ({
    games: [...state.games, game]
  })),
  
  updateGame: (gameId, updatedGame) => set((state) => ({
    games: state.games.map(game => 
      game._id === gameId ? { ...game, ...updatedGame } : game
    )
  })),
  
  deleteGame: (gameId) => set((state) => ({
    games: state.games.filter(game => game._id !== gameId)
  })),
  
  getGameById: (gameId) => {
    return get().games.find(game => game._id === gameId)
  }
}))

export { useAuthStore, useCartStore, useGameStore }