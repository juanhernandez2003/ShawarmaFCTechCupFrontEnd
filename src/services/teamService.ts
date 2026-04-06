import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export interface Equipo {
  id: string
  nombre: string
  escudo: string
  colorPrincipal: string
  colorSecundario: string
  capitanId: string
  jugadores: string[]
}

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})

export const listarEquipos = async (): Promise<Equipo[]> => {
  const response = await axios.get(`${API_URL}/api/teams`, getAuthHeader())
  const data = response.data
  return Array.isArray(data) ? data : (data.content ?? data.equipos ?? [])
}

export const obtenerEquipo = async (id: string): Promise<Equipo> => {
  const response = await axios.get<Equipo>(`${API_URL}/api/teams/${id}`, getAuthHeader())
  return response.data
}
