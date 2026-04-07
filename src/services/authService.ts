import apiClient from './apiClient'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface DecodedToken {
  sub: string
  rol: string
  iat: number
  exp: number
}

export const decodeToken = (token: string): DecodedToken => {
  const payload = token.split('.')[1]
  return JSON.parse(atob(payload)) as DecodedToken
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/api/access/login', data)
  return response.data
}
