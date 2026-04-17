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

const decodeBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return atob(padded)
}

export const decodeToken = (token: string): DecodedToken => {
  const payload = token.split('.')[1]
  return JSON.parse(decodeBase64Url(payload)) as DecodedToken
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/api/access/login', data)
  return response.data
}
