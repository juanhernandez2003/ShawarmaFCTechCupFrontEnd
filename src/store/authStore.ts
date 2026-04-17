import { create } from 'zustand'

interface User {
  correo: string
  rol: string
}

interface AuthState {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: () => boolean
}

const decodeUserFromToken = (token: string): User | null => {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload)) as { sub: string; rol: string }
    return { correo: decoded.sub, rol: decoded.rol }
  } catch {
    return null
  }
}

const storedToken = localStorage.getItem('token') || null

const useAuthStore = create<AuthState>(set => ({
  token: storedToken,
  user: storedToken ? decodeUserFromToken(storedToken) : null,

  login: (token, user) => {
    localStorage.setItem('token', token)
    set({ token, user })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },

  isAuthenticated: () => {
    return localStorage.getItem('token') !== null
  },
}))

export default useAuthStore
