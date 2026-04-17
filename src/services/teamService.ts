import apiClient from './apiClient'

export interface Equipo {
  id: string
  nombre: string
  escudo: string
  colorPrincipal: string
  colorSecundario: string
  capitanId: string
  jugadores: string[]
}

export const listarEquipos = async (): Promise<Equipo[]> => {
  const response = await apiClient.get('/api/teams')
  const data = response.data
  return Array.isArray(data) ? data : (data.content ?? data.equipos ?? [])
}

export const obtenerEquipo = async (id: string): Promise<Equipo> => {
  const response = await apiClient.get<Equipo>(`/api/teams/${id}`)
  return response.data
}

export async function obtenerEquipoDelCapitan(correoCapitan: string): Promise<Equipo | null> {
  const response = await apiClient.get('/api/teams')
  const equipos: Equipo[] = Array.isArray(response.data)
    ? response.data
    : (response.data?.content ?? response.data?.equipos ?? [])
  return equipos.find((e: Equipo) => e.capitanId === correoCapitan) ?? null
}

export const crearEquipo = async (equipo: {
  nombre: string
  escudo: string
  colorPrincipal: string
  colorSecundario: string
  capitanId: string
}): Promise<Equipo> => {
  const response = await apiClient.post<Equipo>('/api/teams', equipo)
  return response.data
}
