import apiClient from './apiClient'

export interface PerfilDeportivo {
  id: string
  jugadorId: string
  posiciones: string[]
  dorsal: number
  edad: number
  genero: string
  semestre: number
}

export interface InvitacionEnviada {
  id: string
  jugadorId: string
  equipoId: string
  posicion: string
  fecha: string
  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA'
}

export async function buscarJugadores(
  correoCapitan: string,
  filtros: {
    posicion?: string
    semestre?: string
    genero?: string
    edad?: string
    nombre?: string
  }
): Promise<PerfilDeportivo[]> {
  const params: Record<string, string> = {}
  if (filtros.posicion) params.posicion = filtros.posicion
  if (filtros.semestre) params.semestre = filtros.semestre
  if (filtros.genero) params.genero = filtros.genero
  if (filtros.edad) params.edad = filtros.edad
  if (filtros.nombre) params.nombre = filtros.nombre

  const res = await apiClient.get<PerfilDeportivo[]>(
    `/api/users/captains/${correoCapitan}/search-players/advanced`,
    { params }
  )
  return res.data
}

export async function enviarInvitacion(
  jugadorId: string,
  equipoId: string,
  posicion: string
): Promise<void> {
  await apiClient.post('/api/invitations', { jugadorId, equipoId, posicion })
}

export async function obtenerInvitacionesEquipo(equipoId: string): Promise<InvitacionEnviada[]> {
  const res = await apiClient.get<InvitacionEnviada[]>(`/api/invitations/team/${equipoId}`)
  return res.data
}

export async function subirComprobante(teamId: string, comprobante: string): Promise<void> {
  await apiClient.post(`/api/payments/team/${teamId}/receipt`, null, { params: { comprobante } })
}
