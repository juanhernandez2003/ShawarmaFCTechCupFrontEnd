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

const readStoredUser = (): User | null => {
  const rawUser = localStorage.getItem('user')
  if (!rawUser) return null
  try {
    const parsed = JSON.parse(rawUser) as Partial<User>
    if (typeof parsed?.correo !== 'string' || typeof parsed?.rol !== 'string') {
      localStorage.removeItem('user')
      return null
    }
    return { correo: parsed.correo, rol: parsed.rol }
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

const readStoredToken = (): string | null => {
  const rawToken = localStorage.getItem('token')
  if (!rawToken) return null
  const normalizedToken = rawToken.trim()
  if (!normalizedToken) {
    localStorage.removeItem('token')
    return null
  }
  return normalizedToken
}

const useAuthStore = create<AuthState>((set, get) => ({
  token: readStoredToken(),
  user: readStoredUser(),
  login: (token, user) => {
    localStorage.setItem('token', token)
    set({ token, user })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },
  isAuthenticated: () => {
    return get().token !== null
  },
}))

export default useAuthStore
