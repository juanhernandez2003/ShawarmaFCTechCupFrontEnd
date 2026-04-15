import apiClient from './apiClient'
import {
  type ArbitroLineups,
  type MatchSummary,
  alineaciones as fallbackLineups,
} from '../features/arbitro/arbitroData'

interface FetchLineupsResult {
  lineups: ArbitroLineups
  fromBackend: boolean
}

interface FetchArbitratedMatchesResult {
  matches: MatchSummary[]
  fromBackend: boolean
}

type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null

const asNonEmptyString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() !== '' ? value.trim() : null

const getRecordField = (record: UnknownRecord, keys: string[]): unknown => {
  for (const key of keys) {
    if (key in record) {
      return record[key]
    }
  }
  return null
}

const normalizePlayerName = (value: unknown, index: number): string => {
  if (typeof value === 'string' && value.trim() !== '') {
    return value.trim()
  }

  if (isRecord(value)) {
    const candidate = getRecordField(value, [
      'nombre',
      'name',
      'fullName',
      'jugador',
      'displayName',
      'correo',
      'email',
    ])
    const parsed = asNonEmptyString(candidate)
    if (parsed) return parsed
  }

  return `Jugador ${index + 1}`
}

const normalizePlayers = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((player, index) => normalizePlayerName(player, index))
  }
  return []
}

const normalizeTeamName = (value: unknown, fallback: string): string => {
  if (isRecord(value)) {
    const name = getRecordField(value, ['equipo', 'nombre', 'name', 'teamName'])
    return asNonEmptyString(name) ?? fallback
  }
  return asNonEmptyString(value) ?? fallback
}

const normalizeTeamLineup = (
  teamValue: unknown,
  fallbackTeamName: string
): { equipo: string; jugadores: string[] } | null => {
  if (!isRecord(teamValue)) return null

  const equipo = normalizeTeamName(teamValue, fallbackTeamName)
  const playersRaw = getRecordField(teamValue, ['jugadores', 'players', 'lineup', 'alineacion'])
  const jugadores = normalizePlayers(playersRaw)

  if (jugadores.length === 0) return null

  return { equipo, jugadores }
}

const normalizeFromDirectShape = (payload: unknown): ArbitroLineups | null => {
  if (!isRecord(payload)) return null

  const localTeam = normalizeTeamLineup(payload.local, 'Equipo local')
  const visitanteTeam = normalizeTeamLineup(payload.visitante, 'Equipo visitante')

  if (localTeam && visitanteTeam) {
    return {
      local: localTeam,
      visitante: visitanteTeam,
    }
  }

  return null
}

const normalizeFromHomeAwayShape = (payload: unknown): ArbitroLineups | null => {
  if (!isRecord(payload)) return null

  const home = normalizeTeamLineup(
    getRecordField(payload, ['homeTeam', 'localTeam', 'equipoLocal']),
    'Equipo local'
  )
  const away = normalizeTeamLineup(
    getRecordField(payload, ['awayTeam', 'visitorTeam', 'equipoVisitante']),
    'Equipo visitante'
  )

  if (home && away) {
    return {
      local: home,
      visitante: away,
    }
  }

  return null
}

const resolveRole = (team: UnknownRecord): 'LOCAL' | 'VISITANTE' | 'UNKNOWN' => {
  const roleValue = getRecordField(team, ['rol', 'role', 'side', 'tipo'])
  const role = asNonEmptyString(roleValue)?.toUpperCase() ?? ''

  if (role.includes('LOCAL') || role.includes('HOME')) return 'LOCAL'
  if (role.includes('VISIT') || role.includes('AWAY')) return 'VISITANTE'
  return 'UNKNOWN'
}

const normalizeFromTeamsArray = (payload: unknown): ArbitroLineups | null => {
  if (!isRecord(payload)) return null

  const teamsRaw = getRecordField(payload, ['teams', 'equipos', 'participants'])
  if (!Array.isArray(teamsRaw) || teamsRaw.length < 2) return null

  const teams = teamsRaw.filter(isRecord)
  if (teams.length < 2) return null

  let localCandidate: UnknownRecord | null = null
  let visitanteCandidate: UnknownRecord | null = null

  for (const team of teams) {
    const role = resolveRole(team)
    if (role === 'LOCAL' && !localCandidate) localCandidate = team
    if (role === 'VISITANTE' && !visitanteCandidate) visitanteCandidate = team
  }

  const fallbackLocal = localCandidate ?? teams[0]
  const fallbackVisitante = visitanteCandidate ?? teams[1]

  const local = normalizeTeamLineup(fallbackLocal, 'Equipo local')
  const visitante = normalizeTeamLineup(fallbackVisitante, 'Equipo visitante')

  if (local && visitante) {
    return {
      local,
      visitante,
    }
  }

  return null
}

const normalizePayload = (payload: unknown): ArbitroLineups | null => {
  const candidates: unknown[] = [payload]

  if (isRecord(payload)) {
    const nested = [payload.data, payload.content, payload.result]
    for (const item of nested) {
      if (item !== undefined && item !== null) {
        candidates.push(item)
      }
    }
  }

  for (const candidate of candidates) {
    const direct = normalizeFromDirectShape(candidate)
    if (direct) return direct

    const homeAway = normalizeFromHomeAwayShape(candidate)
    if (homeAway) return homeAway

    const teamsArray = normalizeFromTeamsArray(candidate)
    if (teamsArray) return teamsArray
  }

  return null
}

const extractDateValue = (payload: UnknownRecord): string => {
  const value = getRecordField(payload, [
    'fecha',
    'date',
    'fechaPartido',
    'matchDate',
    'scheduledAt',
    'createdAt',
  ])
  return asNonEmptyString(value) ?? 'Sin fecha'
}

const extractFieldValue = (payload: UnknownRecord): string => {
  const direct = getRecordField(payload, ['cancha', 'field', 'venue', 'canchaNombre'])
  if (asNonEmptyString(direct)) {
    return asNonEmptyString(direct) ?? 'Sin cancha'
  }

  if (isRecord(direct)) {
    const nested = getRecordField(direct, ['nombre', 'name'])
    return asNonEmptyString(nested) ?? 'Sin cancha'
  }

  return 'Sin cancha'
}

const extractTeamName = (payload: unknown, fallback: string): string => {
  if (isRecord(payload)) {
    const value = getRecordField(payload, ['nombre', 'name', 'equipo', 'teamName'])
    return asNonEmptyString(value) ?? fallback
  }

  return asNonEmptyString(payload) ?? fallback
}

const extractScore = (payload: UnknownRecord): string => {
  const direct = getRecordField(payload, ['marcador', 'score', 'resultado'])
  if (asNonEmptyString(direct)) {
    return asNonEmptyString(direct) ?? 'Pendiente'
  }

  if (isRecord(direct)) {
    const localScore = getRecordField(direct, ['local', 'home', 'golesLocal', 'homeScore'])
    const awayScore = getRecordField(direct, ['visitante', 'away', 'golesVisitante', 'awayScore'])

    const local = Number(localScore)
    const away = Number(awayScore)
    if (!Number.isNaN(local) && !Number.isNaN(away)) {
      return `${local} - ${away}`
    }
  }

  const homeScore = Number(getRecordField(payload, ['homeScore', 'golesLocal']))
  const awayScore = Number(getRecordField(payload, ['awayScore', 'golesVisitante']))
  if (!Number.isNaN(homeScore) && !Number.isNaN(awayScore)) {
    return `${homeScore} - ${awayScore}`
  }

  return 'Pendiente'
}

const normalizeMatch = (item: unknown, index: number): MatchSummary | null => {
  if (!isRecord(item)) return null

  const local = extractTeamName(
    getRecordField(item, ['local', 'homeTeam', 'equipoLocal', 'teamHome']),
    'Equipo local'
  )
  const visitante = extractTeamName(
    getRecordField(item, ['visitante', 'awayTeam', 'equipoVisitante', 'teamAway']),
    'Equipo visitante'
  )

  const idValue = getRecordField(item, ['id', 'matchId', 'partidoId'])
  const id = asNonEmptyString(idValue) ?? `match-${index + 1}`

  return {
    id,
    local,
    visitante,
    fecha: extractDateValue(item),
    cancha: extractFieldValue(item),
    marcador: extractScore(item),
  }
}

const normalizeMatchesPayload = (payload: unknown): MatchSummary[] | null => {
  const candidates: unknown[] = [payload]

  if (isRecord(payload)) {
    const nestedCandidates = [
      payload.data,
      payload.content,
      payload.result,
      payload.matches,
      payload.partidos,
    ]
    for (const nested of nestedCandidates) {
      if (nested !== undefined && nested !== null) {
        candidates.push(nested)
      }
    }
  }

  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) continue

    const normalized = candidate
      .map((item, index) => normalizeMatch(item, index))
      .filter((value): value is MatchSummary => value !== null)
    return normalized
  }

  return null
}

export const obtenerAlineacionesArbitro = async (matchId?: string): Promise<FetchLineupsResult> => {
  const endpoints: string[] = []

  if (matchId) {
    endpoints.push(
      `/api/matches/${matchId}/lineups`,
      `/api/matches/${matchId}/alineaciones`,
      `/api/partidos/${matchId}/alineaciones`
    )
  }

  endpoints.push(
    '/api/referees/me/next-match/lineups',
    '/api/arbitro/partidos/proximo/alineaciones'
  )

  for (const endpoint of endpoints) {
    try {
      const response = await apiClient.get<unknown>(endpoint)
      const normalized = normalizePayload(response.data)

      if (normalized) {
        return {
          lineups: normalized,
          fromBackend: true,
        }
      }
    } catch {
      // Try next candidate endpoint.
    }
  }

  return {
    lineups: fallbackLineups,
    fromBackend: false,
  }
}

export const obtenerHistorialPartidosArbitrados =
  async (): Promise<FetchArbitratedMatchesResult> => {
    const endpoints = [
      '/api/referees/me/matches/arbitrated',
      '/api/referees/me/matches?status=FINISHED',
      '/api/arbitro/partidos/arbitrados',
      '/api/partidos/arbitrados',
      '/api/matches',
    ]

    for (const endpoint of endpoints) {
      try {
        const response = await apiClient.get<unknown>(endpoint)
        const normalized = normalizeMatchesPayload(response.data)

        if (normalized !== null) {
          return {
            matches: normalized,
            fromBackend: true,
          }
        }
      } catch {
        // Try next candidate endpoint.
      }
    }

    return {
      matches: [],
      fromBackend: false,
    }
  }
