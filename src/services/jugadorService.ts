import apiClient from './apiClient'

export interface Jugador {
  id: string
  nombre: string
  email: string
  tipoUsuario: string
  numeroCamiseta: number
  posicion: string
  disponible: boolean
}

export interface Sancion {
  id: string
  tipoSancion: 'TARJETA_ROJA' | 'TARJETA_AMARILLA' | 'AGRESION_VERBAL' | 'AGRESION_FISICA'
  descripcion: string
}

export interface Invitacion {
  id: string
  jugadorId: string
  equipoId: string
  posicion: string
  fecha: string
  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA'
}

export async function obtenerJugador(id: string): Promise<Jugador> {
  const response = await apiClient.get(`/api/users/players/${id}`)
  return response.data
}

export async function obtenerSanciones(id: string): Promise<Sancion[]> {
  const response = await apiClient.get(`/api/users/players/${id}/sanciones`)
  return response.data
}

export async function toggleDisponibilidad(id: string): Promise<string> {
  const response = await apiClient.patch(`/api/users/players/${id}/availability`)
  return response.data
}

export async function obtenerInvitacionesJugador(jugadorId: string): Promise<Invitacion[]> {
  const response = await apiClient.get(`/api/invitations/player/${jugadorId}`)
  return response.data
}

export async function aceptarInvitacion(id: string): Promise<Invitacion> {
  const response = await apiClient.patch(`/api/invitations/${id}/accept`)
  return response.data
}

export async function rechazarInvitacion(id: string): Promise<Invitacion> {
  const response = await apiClient.patch(`/api/invitations/${id}/reject`)
  return response.data
}

export async function obtenerJugadorPorCorreo(correo: string): Promise<Jugador | null> {
  const response = await apiClient.get('/api/users/players')
  const jugadores: Jugador[] = response.data
  return jugadores.find(j => j.email === correo) ?? null
}
