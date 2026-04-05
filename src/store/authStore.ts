import { create } from 'zustand'

interface User {
  id: number
  nombre: string
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

const useAuthStore = create<AuthState>(set => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') ?? 'null') as User | null,

  login: (token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ token, user })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null })
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
}))

export default useAuthStore
