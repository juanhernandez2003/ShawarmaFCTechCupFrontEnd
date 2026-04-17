import apiClient from './apiClient'

export interface Torneo {
  id: string
  nombre: string
  fechaInicio: string
  fechaFin: string
  cantidadEquipos: number
  costo: number
  estado: 'CREADO' | 'EN_CURSO' | 'FINALIZADO'
  reglamento?: string
  cierreInscripciones?: string
  canchas?: string
  horarios?: string
  sanciones?: string
  campeonId?: string
}

export interface PosicionTabla {
  equipo: string
  pj: number
  pg: number
  pe: number
  pp: number
  gf: number
  gc: number
  dg: number
  pts: number
}

export interface Goleador {
  jugadorId: string
  nombre: string
  goles: number
}

export async function listarTorneos(): Promise<Torneo[]> {
  const response = await apiClient.get('/api/tournaments')
  return response.data
}

export async function obtenerTorneo(id: string): Promise<Torneo> {
  const response = await apiClient.get(`/api/tournaments/${id}`)
  return response.data
}

export async function obtenerTabla(id: string): Promise<PosicionTabla[]> {
  const response = await apiClient.get(`/api/tournaments/${id}/positions`)
  return response.data
}

export async function obtenerGoleadores(id: string): Promise<Goleador[]> {
  const response = await apiClient.get(`/api/tournaments/${id}/top-scorers`)
  return response.data
}
