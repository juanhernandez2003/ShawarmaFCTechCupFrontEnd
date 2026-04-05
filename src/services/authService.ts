import axios from 'axios'

export interface LoginRequest {
  correo: string
  contraseña: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    nombre: string
    correo: string
    rol: string
  }
}

const API_URL = import.meta.env.VITE_API_URL

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, credentials)
  return response.data
}
