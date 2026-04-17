import { useEffect, useState, type CSSProperties, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import {
  finalizarPartidoArbitro,
  iniciarPartidoArbitro,
  obtenerDetallePartidoArbitro,
  obtenerPartidosAsignadosArbitro,
  registrarGoleadorArbitro,
  registrarResultadoArbitro,
  registrarSancionArbitro,
  type GoalPayload,
  type RefereeMatch,
  type RefereeMatchDetail,
  type RefereeMatchStatus,
  type ResultPayload,
  type SanctionPayload,
  type ServiceActionResult,
  type TeamSide,
} from '../../services/arbitroService'
import ArbitroQuickActions from './ArbitroQuickActions'

interface FeedbackState {
  type: 'success' | 'error'
  message: string
}

const cardStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  padding: '1rem',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
}

const inputStyle: CSSProperties = {
  width: '100%',
  border: '1px solid #D1D5DB',
  borderRadius: '6px',
  padding: '0.45rem 0.55rem',
  fontSize: '0.85rem',
}

const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: '0.2rem',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: '#374151',
}

const getStatusLabel = (status: RefereeMatchStatus): string => {
  if (status === 'ASSIGNED') return 'Asignado'
  if (status === 'IN_PROGRESS') return 'En curso'
  if (status === 'FINISHED') return 'Finalizado'
  return 'Desconocido'
}

const getStatusColors = (status: RefereeMatchStatus): { bg: string; color: string } => {
  if (status === 'ASSIGNED') return { bg: '#EFF6FF', color: '#1D4ED8' }
  if (status === 'IN_PROGRESS') return { bg: '#FEF3C7', color: '#92400E' }
  if (status === 'FINISHED') return { bg: '#ECFDF5', color: '#065F46' }
  return { bg: '#F3F4F6', color: '#374151' }
}

const toIntOrNaN = (value: string): number => {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? Number.NaN : parsed
}

const PartidosArbitroPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [matches, setMatches] = useState<RefereeMatch[]>([])
  const [loadingMatches, setLoadingMatches] = useState<boolean>(true)
  const [matchesError, setMatchesError] = useState<string | null>(null)
  const [selectedMatchId, setSelectedMatchId] = useState<string>('')

  const [matchDetail, setMatchDetail] = useState<RefereeMatchDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState<number>(0)

  const [resultLocal, setResultLocal] = useState<string>('')
  const [resultVisitante, setResultVisitante] = useState<string>('')
  const [goalJugador, setGoalJugador] = useState<string>('')
  const [goalEquipo, setGoalEquipo] = useState<TeamSide>('LOCAL')
  const [goalMinuto, setGoalMinuto] = useState<string>('')
  const [sanctionJugador, setSanctionJugador] = useState<string>('')
  const [sanctionTipo, setSanctionTipo] = useState<SanctionPayload['tipo']>('AMARILLA')
  const [sanctionMinuto, setSanctionMinuto] = useState<string>('')
  const [sanctionMotivo, setSanctionMotivo] = useState<string>('')

  const matchIdQuery = searchParams.get('matchId') ?? ''

  useEffect(() => {
    let isMounted = true

    const loadMatches = async () => {
      setLoadingMatches(true)
      setMatchesError(null)

      const result = await obtenerPartidosAsignadosArbitro()
      if (!isMounted) return

      setMatches(result.matches)
      setMatchesError(result.error)
      setSelectedMatchId(current => {
        const preferred = current || matchIdQuery
        if (preferred && result.matches.some(match => match.id === preferred)) return preferred
        return result.matches[0]?.id ?? ''
      })
      setLoadingMatches(false)
    }

    void loadMatches()

    return () => {
      isMounted = false
    }
  }, [reloadKey, matchIdQuery])

  useEffect(() => {
    if (!selectedMatchId) {
      return
    }

    let isMounted = true

    const loadDetail = async () => {
      setLoadingDetail(true)
      setDetailError(null)

      const result = await obtenerDetallePartidoArbitro(selectedMatchId)
      if (!isMounted) return

      setMatchDetail(result.match)
      setDetailError(result.error)
      setLoadingDetail(false)
    }

    void loadDetail()

    return () => {
      isMounted = false
    }
  }, [selectedMatchId, reloadKey])

  const ejecutarAccion = async (
    actionKey: string,
    successMessage: string,
    action: () => Promise<ServiceActionResult>,
    onSuccess?: () => void
  ) => {
    setFeedback(null)
    setActionLoading(actionKey)

    const result = await action()
    if (result.ok) {
      setFeedback({ type: 'success', message: successMessage })
      onSuccess?.()
      setReloadKey(current => current + 1)
    } else {
      setFeedback({
        type: 'error',
        message: result.error ?? 'No fue posible completar la accion en este momento.',
      })
    }

    setActionLoading(null)
  }

  const handleResultSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload: ResultPayload = {
      golesLocal: toIntOrNaN(resultLocal),
      golesVisitante: toIntOrNaN(resultVisitante),
    }

    void ejecutarAccion('result', 'Resultado registrado correctamente.', () =>
      registrarResultadoArbitro(matchDetail, payload)
    )
  }

  const handleGoalSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload: GoalPayload = {
      jugador: goalJugador,
      equipo: goalEquipo,
      minuto: toIntOrNaN(goalMinuto),
    }

    void ejecutarAccion('goal', 'Goleador registrado correctamente.', () =>
      registrarGoleadorArbitro(matchDetail, payload)
    )
  }

  const handleSanctionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload: SanctionPayload = {
      jugador: sanctionJugador,
      tipo: sanctionTipo,
      minuto: toIntOrNaN(sanctionMinuto),
      motivo: sanctionMotivo.trim() || undefined,
    }

    void ejecutarAccion('sanction', 'Sancion registrada correctamente.', () =>
      registrarSancionArbitro(matchDetail, payload)
    )
  }

  return (
    <div>
      <PageHeader
        title="Gestionar Partidos"
        subtitle="Control de resultado, goleadores y sanciones"
      />

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '1rem' }}>
        {feedback && (
          <div
            style={{
              ...cardStyle,
              marginBottom: '0.75rem',
              backgroundColor: feedback.type === 'success' ? '#ECFDF5' : '#FEF2F2',
              color: feedback.type === 'success' ? '#065F46' : '#991B1B',
              border: `1px solid ${feedback.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
            }}
          >
            {feedback.message}
          </div>
        )}

        <section style={cardStyle}>
          <h2 style={{ margin: 0, color: '#111827', fontSize: '1rem' }}>Partidos asignados</h2>

          {loadingMatches && (
            <p style={{ margin: '0.7rem 0 0', color: '#6B7280', fontSize: '0.85rem' }}>
              Cargando partidos asignados...
            </p>
          )}

          {!loadingMatches && matchesError && (
            <p style={{ margin: '0.7rem 0 0', color: '#B91C1C', fontSize: '0.85rem' }}>
              Error al cargar partidos asignados: {matchesError}
            </p>
          )}

          {!loadingMatches && matches.length === 0 && (
            <div
              style={{
                marginTop: '0.8rem',
                border: '1px dashed #D1D5DB',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#F9FAFB',
              }}
            >
              <p style={{ margin: 0, color: '#374151', fontWeight: 600, fontSize: '0.9rem' }}>
                No tienes partidos asignados.
              </p>
              <p style={{ margin: '0.35rem 0 0', color: '#6B7280', fontSize: '0.82rem' }}>
                Cuando el sistema te asigne un partido, aparecera aqui para que lo gestiones.
              </p>
            </div>
          )}

          {!loadingMatches && matches.length > 0 && (
            <div style={{ marginTop: '0.8rem', display: 'grid', gap: '0.45rem' }}>
              {matches.map(match => {
                const isSelected = match.id === selectedMatchId
                const statusColors = getStatusColors(match.status)
                return (
                  <button
                    key={match.id}
                    onClick={() => setSelectedMatchId(match.id)}
                    style={{
                      border: `1px solid ${isSelected ? '#11823B' : '#E5E7EB'}`,
                      backgroundColor: isSelected ? '#F0FFF4' : '#FFFFFF',
                      borderRadius: '8px',
                      padding: '0.65rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', gap: '0.8rem' }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.86rem',
                          color: '#111827',
                          fontWeight: 600,
                        }}
                      >
                        {match.local} vs {match.visitante}
                      </p>
                      <span
                        style={{
                          alignSelf: 'flex-start',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          borderRadius: '999px',
                          padding: '0.12rem 0.45rem',
                          backgroundColor: statusColors.bg,
                          color: statusColors.color,
                        }}
                      >
                        {getStatusLabel(match.status)}
                      </span>
                    </div>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#6B7280' }}>
                      {match.fecha} | {match.cancha}
                    </p>
                  </button>
                )
              })}
            </div>
          )}
        </section>

        {selectedMatchId && (
          <section style={{ ...cardStyle, marginTop: '0.75rem' }}>
            <h2 style={{ margin: 0, color: '#111827', fontSize: '1rem' }}>Detalle del partido</h2>

            {loadingDetail && (
              <p style={{ margin: '0.7rem 0 0', color: '#6B7280', fontSize: '0.85rem' }}>
                Cargando detalle del partido...
              </p>
            )}

            {!loadingDetail && detailError && (
              <p style={{ margin: '0.7rem 0 0', color: '#B91C1C', fontSize: '0.85rem' }}>
                Error al cargar detalle: {detailError}
              </p>
            )}

            {!loadingDetail && !detailError && !matchDetail && (
              <p style={{ margin: '0.7rem 0 0', color: '#6B7280', fontSize: '0.85rem' }}>
                No se pudo obtener el detalle del partido seleccionado.
              </p>
            )}

            {!loadingDetail && matchDetail && (
              <div style={{ marginTop: '0.85rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.8rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <p
                      style={{ margin: 0, fontWeight: 700, color: '#111827', fontSize: '0.92rem' }}
                    >
                      {matchDetail.local} vs {matchDetail.visitante}
                    </p>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#6B7280' }}>
                      {matchDetail.fecha} | {matchDetail.cancha}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#374151' }}>
                    Marcador actual: <strong>{matchDetail.marcador}</strong>
                  </p>
                </div>

                <div
                  style={{
                    marginTop: '0.75rem',
                    display: 'flex',
                    gap: '0.55rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    onClick={() =>
                      void ejecutarAccion('start', 'Partido iniciado correctamente.', () =>
                        iniciarPartidoArbitro(matchDetail)
                      )
                    }
                    disabled={actionLoading !== null}
                    style={{
                      backgroundColor: '#11823B',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.42rem 0.75rem',
                      fontSize: '0.8rem',
                      opacity: actionLoading !== null ? 0.7 : 1,
                    }}
                  >
                    Iniciar partido
                  </button>

                  <button
                    onClick={() =>
                      void ejecutarAccion('finish', 'Partido finalizado correctamente.', () =>
                        finalizarPartidoArbitro(matchDetail)
                      )
                    }
                    disabled={actionLoading !== null}
                    style={{
                      backgroundColor: '#1F2937',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.42rem 0.75rem',
                      fontSize: '0.8rem',
                      opacity: actionLoading !== null ? 0.7 : 1,
                    }}
                  >
                    Finalizar partido
                  </button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gap: '0.75rem',
                    marginTop: '0.85rem',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  }}
                >
                  <form onSubmit={handleResultSubmit} style={{ ...cardStyle, boxShadow: 'none' }}>
                    <h3 style={{ margin: 0, fontSize: '0.92rem', color: '#111827' }}>
                      Registrar resultado
                    </h3>
                    <div
                      style={{
                        marginTop: '0.6rem',
                        display: 'grid',
                        gap: '0.5rem',
                        gridTemplateColumns: 'repeat(2, minmax(100px, 1fr))',
                      }}
                    >
                      <div>
                        <label style={labelStyle}>Goles local</label>
                        <input
                          type="number"
                          min={0}
                          value={resultLocal}
                          onChange={event => setResultLocal(event.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Goles visitante</label>
                        <input
                          type="number"
                          min={0}
                          value={resultVisitante}
                          onChange={event => setResultVisitante(event.target.value)}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={actionLoading !== null}
                      style={{
                        marginTop: '0.7rem',
                        backgroundColor: '#0E7490',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.4rem 0.72rem',
                        fontSize: '0.8rem',
                        opacity: actionLoading !== null ? 0.7 : 1,
                      }}
                    >
                      Guardar resultado
                    </button>
                  </form>

                  <form onSubmit={handleGoalSubmit} style={{ ...cardStyle, boxShadow: 'none' }}>
                    <h3 style={{ margin: 0, fontSize: '0.92rem', color: '#111827' }}>
                      Registrar goleador
                    </h3>
                    <div style={{ marginTop: '0.6rem', display: 'grid', gap: '0.5rem' }}>
                      <div>
                        <label style={labelStyle}>Jugador</label>
                        <input
                          type="text"
                          value={goalJugador}
                          onChange={event => setGoalJugador(event.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div
                        style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr 1fr' }}
                      >
                        <div>
                          <label style={labelStyle}>Equipo</label>
                          <select
                            value={goalEquipo}
                            onChange={event => setGoalEquipo(event.target.value as TeamSide)}
                            style={inputStyle}
                          >
                            <option value="LOCAL">Local</option>
                            <option value="VISITANTE">Visitante</option>
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Minuto</label>
                          <input
                            type="number"
                            min={0}
                            max={90}
                            value={goalMinuto}
                            onChange={event => setGoalMinuto(event.target.value)}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={actionLoading !== null}
                      style={{
                        marginTop: '0.7rem',
                        backgroundColor: '#1D4ED8',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.4rem 0.72rem',
                        fontSize: '0.8rem',
                        opacity: actionLoading !== null ? 0.7 : 1,
                      }}
                    >
                      Guardar goleador
                    </button>
                  </form>

                  <form onSubmit={handleSanctionSubmit} style={{ ...cardStyle, boxShadow: 'none' }}>
                    <h3 style={{ margin: 0, fontSize: '0.92rem', color: '#111827' }}>
                      Registrar sancion
                    </h3>
                    <div style={{ marginTop: '0.6rem', display: 'grid', gap: '0.5rem' }}>
                      <div>
                        <label style={labelStyle}>Jugador</label>
                        <input
                          type="text"
                          value={sanctionJugador}
                          onChange={event => setSanctionJugador(event.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div
                        style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr 1fr' }}
                      >
                        <div>
                          <label style={labelStyle}>Tipo</label>
                          <select
                            value={sanctionTipo}
                            onChange={event =>
                              setSanctionTipo(event.target.value as SanctionPayload['tipo'])
                            }
                            style={inputStyle}
                          >
                            <option value="AMARILLA">Amarilla</option>
                            <option value="ROJA">Roja</option>
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Minuto</label>
                          <input
                            type="number"
                            min={0}
                            max={90}
                            value={sanctionMinuto}
                            onChange={event => setSanctionMinuto(event.target.value)}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Motivo (opcional)</label>
                        <input
                          type="text"
                          value={sanctionMotivo}
                          onChange={event => setSanctionMotivo(event.target.value)}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={actionLoading !== null}
                      style={{
                        marginTop: '0.7rem',
                        backgroundColor: '#B45309',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.4rem 0.72rem',
                        fontSize: '0.8rem',
                        opacity: actionLoading !== null ? 0.7 : 1,
                      }}
                    >
                      Guardar sancion
                    </button>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

        <ArbitroQuickActions active="partidos" />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
          <button
            onClick={() => navigate('/arbitro')}
            style={{
              backgroundColor: '#737373',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.85rem',
            }}
          >
            {'<-'} Volver al panel
          </button>
        </div>
      </div>
    </div>
  )
}

export default PartidosArbitroPage
