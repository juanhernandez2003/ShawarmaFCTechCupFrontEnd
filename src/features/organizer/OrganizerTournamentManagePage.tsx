import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  aprobarPago,
  canStartTournament,
  canFinishTournament,
  extractApiErrorMessage,
  finalizarTorneo,
  formatCurrencyCop,
  formatDate,
  formatDateTime,
  guardarConfiguracionTorneo,
  iniciarTorneo,
  listarPagosPendientes,
  listarPartidosTorneo,
  obtenerConfiguracionTorneo,
  obtenerTorneo,
  paymentStatusLabel,
  registrarPartido,
  stateClassName,
  tournamentStatusLabel,
} from './organizerPageHelpers'
import type {
  CreateMatchPayload,
  Match,
  OrganizerTournament,
  PendingPayment,
  TournamentConfiguration,
} from '../../services/organizerService'
import { rechazarPago } from '../../services/organizerService'
import './organizer.css'

type MessageType = 'success' | 'error'
type ManageTab = 'configuracion' | 'partidos' | 'pagos'

interface ConfigurationForm {
  reglamento: string
  cierreInscripciones: string
  canchas: string
  horarios: string
  sanciones: string
}

type MatchForm = CreateMatchPayload

const initialConfigurationForm: ConfigurationForm = {
  reglamento: '',
  cierreInscripciones: '',
  canchas: '',
  horarios: '',
  sanciones: '',
}

const initialMatchForm: MatchForm = {
  equipoLocal: '',
  equipoVisitante: '',
  fechaHora: '',
  cancha: '',
}

const splitLines = (value: string) =>
  value
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean)

const OrganizerTournamentManagePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [tournament, setTournament] = useState<OrganizerTournament | null>(null)
  const [tournamentLoading, setTournamentLoading] = useState(true)
  const [tournamentError, setTournamentError] = useState<string | null>(null)
  const [configurationForm, setConfigurationForm] =
    useState<ConfigurationForm>(initialConfigurationForm)
  const [configurationErrors, setConfigurationErrors] = useState<Record<string, string>>({})
  const [configurationLoading, setConfigurationLoading] = useState(true)
  const [configurationError, setConfigurationError] = useState<string | null>(null)
  const [savingConfiguration, setSavingConfiguration] = useState(false)
  const [matches, setMatches] = useState<Match[]>([])
  const [matchForm, setMatchForm] = useState<MatchForm>(initialMatchForm)
  const [matchErrors, setMatchErrors] = useState<Record<string, string>>({})
  const [matchesLoading, setMatchesLoading] = useState(true)
  const [matchesError, setMatchesError] = useState<string | null>(null)
  const [savingMatch, setSavingMatch] = useState(false)
  const [payments, setPayments] = useState<PendingPayment[]>([])
  const [paymentsLoading, setPaymentsLoading] = useState(true)
  const [paymentsError, setPaymentsError] = useState<string | null>(null)
  const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null)
  const [processingTournamentAction, setProcessingTournamentAction] = useState(false)

  const activeTab: ManageTab = useMemo(() => {
    const tab = searchParams.get('tab')
    if (tab === 'partidos' || tab === 'pagos') return tab
    return 'configuracion'
  }, [searchParams])

  const setTab = (tab: ManageTab) => {
    setSearchParams({ tab })
  }

  const pushMessage = (type: MessageType, text: string) => {
    setMessage({ type, text })
  }

  const loadTournament = async (tournamentId: string) => {
    setTournamentLoading(true)
    setTournamentError(null)
    try {
      const tournamentData = await obtenerTorneo(tournamentId)
      setTournament(tournamentData)
    } catch (error) {
      setTournamentError(extractApiErrorMessage(error, 'No se pudo cargar el torneo.'))
    } finally {
      setTournamentLoading(false)
    }
  }

  const loadConfiguration = async (tournamentId: string) => {
    setConfigurationLoading(true)
    setConfigurationError(null)
    try {
      const configuration = await obtenerConfiguracionTorneo(tournamentId)
      setConfigurationForm({
        reglamento: configuration.reglamento,
        cierreInscripciones: configuration.cierreInscripciones,
        canchas: configuration.canchas.join('\n'),
        horarios: configuration.horarios.join('\n'),
        sanciones: configuration.sanciones.join('\n'),
      })
    } catch (error) {
      setConfigurationError(
        extractApiErrorMessage(error, 'No se pudo cargar la configuracion del torneo.')
      )
    } finally {
      setConfigurationLoading(false)
    }
  }

  const loadMatches = async (tournamentId: string) => {
    setMatchesLoading(true)
    setMatchesError(null)
    try {
      const items = await listarPartidosTorneo(tournamentId)
      setMatches(items)
    } catch (error) {
      setMatchesError(extractApiErrorMessage(error, 'No se pudieron cargar los partidos.'))
    } finally {
      setMatchesLoading(false)
    }
  }

  const loadPayments = async (tournamentId: string) => {
    setPaymentsLoading(true)
    setPaymentsError(null)
    try {
      const items = await listarPagosPendientes(tournamentId)
      setPayments(items)
    } catch (error) {
      setPaymentsError(extractApiErrorMessage(error, 'No se pudieron cargar los pagos pendientes.'))
    } finally {
      setPaymentsLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    void Promise.all([loadTournament(id), loadConfiguration(id), loadMatches(id), loadPayments(id)])
  }, [id])

  const validateConfiguration = () => {
    const next: Record<string, string> = {}
    if (!configurationForm.reglamento.trim()) {
      next.reglamento = 'El reglamento es obligatorio.'
    }
    if (!configurationForm.cierreInscripciones) {
      next.cierreInscripciones = 'Debe definir el cierre de inscripciones.'
    }
    if (splitLines(configurationForm.canchas).length === 0) {
      next.canchas = 'Debe registrar al menos una cancha.'
    }
    if (splitLines(configurationForm.horarios).length === 0) {
      next.horarios = 'Debe registrar al menos un horario.'
    }
    if (splitLines(configurationForm.sanciones).length === 0) {
      next.sanciones = 'Debe registrar al menos una sancion.'
    }
    return next
  }

  const saveConfiguration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!id) return

    const nextErrors = validateConfiguration()
    setConfigurationErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      pushMessage('error', 'Hay datos obligatorios sin completar en la configuracion.')
      return
    }

    const payload: TournamentConfiguration = {
      reglamento: configurationForm.reglamento.trim(),
      cierreInscripciones: configurationForm.cierreInscripciones,
      canchas: splitLines(configurationForm.canchas),
      horarios: splitLines(configurationForm.horarios),
      sanciones: splitLines(configurationForm.sanciones),
    }

    setSavingConfiguration(true)
    try {
      await guardarConfiguracionTorneo(id, payload)
      pushMessage('success', 'Configuracion guardada correctamente.')
      await loadTournament(id)
    } catch (error) {
      pushMessage('error', extractApiErrorMessage(error, 'No se pudo guardar la configuracion.'))
    } finally {
      setSavingConfiguration(false)
    }
  }

  const triggerStartTournament = async () => {
    if (!id || !tournament) return
    if (!canStartTournament(tournament.estado)) {
      pushMessage('error', 'Este torneo no se puede iniciar por su estado actual.')
      return
    }

    setProcessingTournamentAction(true)
    try {
      await iniciarTorneo(id)
      pushMessage('success', 'Torneo iniciado correctamente.')
      await loadTournament(id)
    } catch (error) {
      pushMessage('error', extractApiErrorMessage(error, 'No se pudo iniciar el torneo.'))
    } finally {
      setProcessingTournamentAction(false)
    }
  }

  const triggerFinishTournament = async () => {
    if (!id || !tournament) return
    if (!canFinishTournament(tournament.estado)) {
      pushMessage('error', 'Este torneo no se puede finalizar por su estado actual.')
      return
    }

    setProcessingTournamentAction(true)
    try {
      await finalizarTorneo(id)
      pushMessage('success', 'Torneo finalizado correctamente.')
      await loadTournament(id)
    } catch (error) {
      pushMessage('error', extractApiErrorMessage(error, 'No se pudo finalizar el torneo.'))
    } finally {
      setProcessingTournamentAction(false)
    }
  }

  const validateMatch = () => {
    const next: Record<string, string> = {}
    if (!matchForm.equipoLocal.trim()) next.equipoLocal = 'Equipo local obligatorio.'
    if (!matchForm.equipoVisitante.trim()) next.equipoVisitante = 'Equipo visitante obligatorio.'
    if (
      matchForm.equipoLocal.trim() &&
      matchForm.equipoVisitante.trim() &&
      matchForm.equipoLocal.trim().toLowerCase() === matchForm.equipoVisitante.trim().toLowerCase()
    ) {
      next.equipoVisitante = 'El visitante debe ser diferente del local.'
    }
    if (!matchForm.fechaHora) next.fechaHora = 'Debe definir fecha y hora.'
    if (!matchForm.cancha.trim()) next.cancha = 'La cancha es obligatoria.'
    return next
  }

  const saveMatch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!id || !tournament) return

    if (tournament.estado === 'FINALIZADO' || tournament.estado === 'CANCELADO') {
      pushMessage('error', 'No se pueden registrar partidos para un torneo cerrado.')
      return
    }

    const nextErrors = validateMatch()
    setMatchErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      pushMessage('error', 'Hay datos obligatorios sin completar para registrar el partido.')
      return
    }

    setSavingMatch(true)
    try {
      await registrarPartido(id, matchForm)
      pushMessage('success', 'Partido registrado correctamente.')
      setMatchForm(initialMatchForm)
      await Promise.all([loadMatches(id), loadTournament(id)])
    } catch (error) {
      pushMessage('error', extractApiErrorMessage(error, 'No se pudo registrar el partido.'))
    } finally {
      setSavingMatch(false)
    }
  }

  const resolvePayment = async (paymentId: string, action: 'approve' | 'reject') => {
    if (!id) return

    setProcessingPaymentId(paymentId)
    try {
      if (action === 'approve') {
        await aprobarPago(id, paymentId)
      } else {
        await rechazarPago(id, paymentId)
      }
      pushMessage(
        'success',
        action === 'approve' ? 'Pago aprobado correctamente.' : 'Pago rechazado correctamente.'
      )
      await Promise.all([loadPayments(id), loadTournament(id)])
    } catch (error) {
      pushMessage(
        'error',
        extractApiErrorMessage(error, 'Ocurrio un error al procesar el pago. Intenta de nuevo.')
      )
    } finally {
      setProcessingPaymentId(null)
    }
  }

  return (
    <div className="organizer-page">
      <section className="organizer-banner">
        <h1>{tournament?.nombre ?? 'Gestion de torneo'}</h1>
        <p>Configura, opera y controla pagos del torneo</p>
      </section>

      <section className="organizer-container">
        {message && (
          <div
            className={`organizer-message ${
              message.type === 'error' ? 'organizer-message-error' : 'organizer-message-success'
            }`}
          >
            {message.text}
          </div>
        )}

        {tournamentLoading && !tournament && (
          <div className="organizer-empty">Cargando informacion del torneo...</div>
        )}

        {tournamentError && (
          <div className="organizer-message organizer-message-error">{tournamentError}</div>
        )}

        {tournament && (
          <article className="organizer-panel" style={{ marginBottom: '1rem' }}>
            <div className="organizer-header-row">
              <div>
                <h2 style={{ marginBottom: '0.25rem' }}>{tournament.nombre}</h2>
                <p style={{ margin: 0, color: '#636363', fontSize: '0.86rem' }}>
                  {formatDate(tournament.fechaInicio)} - {formatDate(tournament.fechaFin)}
                </p>
              </div>
              <div className="organizer-inline-actions">
                <span className={`organizer-badge ${stateClassName(tournament.estado)}`}>
                  {tournamentStatusLabel(tournament.estado)}
                </span>
                <button
                  className="organizer-btn organizer-btn-primary"
                  onClick={() => void triggerStartTournament()}
                  disabled={processingTournamentAction || !canStartTournament(tournament.estado)}
                >
                  Iniciar
                </button>
                <button
                  className="organizer-btn organizer-btn-secondary"
                  onClick={() => void triggerFinishTournament()}
                  disabled={processingTournamentAction || !canFinishTournament(tournament.estado)}
                >
                  Finalizar
                </button>
                <button
                  className="organizer-btn organizer-btn-muted"
                  onClick={() => navigate('/organizador')}
                >
                  Volver
                </button>
              </div>
            </div>
            <p style={{ margin: 0, color: '#454545', fontSize: '0.9rem' }}>
              {tournament.descripcion || 'Sin descripcion registrada.'}
            </p>
          </article>
        )}

        <div className="organizer-tabs">
          <button
            className={`organizer-tab ${activeTab === 'configuracion' ? 'organizer-tab-active' : ''}`}
            onClick={() => setTab('configuracion')}
          >
            Configuracion
          </button>
          <button
            className={`organizer-tab ${activeTab === 'partidos' ? 'organizer-tab-active' : ''}`}
            onClick={() => setTab('partidos')}
          >
            Partidos
          </button>
          <button
            className={`organizer-tab ${activeTab === 'pagos' ? 'organizer-tab-active' : ''}`}
            onClick={() => setTab('pagos')}
          >
            Pagos
          </button>
        </div>

        {activeTab === 'configuracion' && (
          <article className="organizer-panel">
            <h3>Configuracion del torneo</h3>
            {configurationError && (
              <div className="organizer-message organizer-message-error">{configurationError}</div>
            )}
            {configurationLoading ? (
              <div className="organizer-empty">Cargando configuracion...</div>
            ) : (
              <form className="organizer-form" onSubmit={saveConfiguration}>
                <div className="organizer-field">
                  <label htmlFor="reglamento">Reglamento</label>
                  <textarea
                    id="reglamento"
                    value={configurationForm.reglamento}
                    onChange={event =>
                      setConfigurationForm(prev => ({ ...prev, reglamento: event.target.value }))
                    }
                    className={configurationErrors.reglamento ? 'organizer-input-error' : ''}
                  />
                  {configurationErrors.reglamento && (
                    <p className="organizer-error-text">{configurationErrors.reglamento}</p>
                  )}
                </div>

                <div className="organizer-field">
                  <label htmlFor="cierreInscripciones">Cierre de inscripciones</label>
                  <input
                    id="cierreInscripciones"
                    type="date"
                    value={configurationForm.cierreInscripciones}
                    onChange={event =>
                      setConfigurationForm(prev => ({
                        ...prev,
                        cierreInscripciones: event.target.value,
                      }))
                    }
                    className={
                      configurationErrors.cierreInscripciones ? 'organizer-input-error' : ''
                    }
                  />
                  {configurationErrors.cierreInscripciones && (
                    <p className="organizer-error-text">
                      {configurationErrors.cierreInscripciones}
                    </p>
                  )}
                </div>

                <div className="organizer-form-grid">
                  <div className="organizer-field">
                    <label htmlFor="canchas">Canchas (una por linea)</label>
                    <textarea
                      id="canchas"
                      value={configurationForm.canchas}
                      onChange={event =>
                        setConfigurationForm(prev => ({ ...prev, canchas: event.target.value }))
                      }
                      className={configurationErrors.canchas ? 'organizer-input-error' : ''}
                    />
                    {configurationErrors.canchas && (
                      <p className="organizer-error-text">{configurationErrors.canchas}</p>
                    )}
                  </div>

                  <div className="organizer-field">
                    <label htmlFor="horarios">Horarios (una por linea)</label>
                    <textarea
                      id="horarios"
                      value={configurationForm.horarios}
                      onChange={event =>
                        setConfigurationForm(prev => ({ ...prev, horarios: event.target.value }))
                      }
                      className={configurationErrors.horarios ? 'organizer-input-error' : ''}
                    />
                    {configurationErrors.horarios && (
                      <p className="organizer-error-text">{configurationErrors.horarios}</p>
                    )}
                  </div>
                </div>

                <div className="organizer-field">
                  <label htmlFor="sanciones">Sanciones (una por linea)</label>
                  <textarea
                    id="sanciones"
                    value={configurationForm.sanciones}
                    onChange={event =>
                      setConfigurationForm(prev => ({ ...prev, sanciones: event.target.value }))
                    }
                    className={configurationErrors.sanciones ? 'organizer-input-error' : ''}
                  />
                  {configurationErrors.sanciones && (
                    <p className="organizer-error-text">{configurationErrors.sanciones}</p>
                  )}
                </div>

                <div className="organizer-inline-actions">
                  <button
                    type="submit"
                    className="organizer-btn organizer-btn-primary"
                    disabled={savingConfiguration}
                  >
                    {savingConfiguration ? 'Guardando...' : 'Guardar configuracion'}
                  </button>
                </div>
              </form>
            )}
          </article>
        )}

        {activeTab === 'partidos' && (
          <div className="organizer-grid-2">
            <article className="organizer-panel">
              <h3>Registrar partido</h3>
              <form className="organizer-form" onSubmit={saveMatch}>
                <div className="organizer-form-grid">
                  <div className="organizer-field">
                    <label htmlFor="equipoLocal">Equipo local</label>
                    <input
                      id="equipoLocal"
                      value={matchForm.equipoLocal}
                      onChange={event =>
                        setMatchForm(prev => ({ ...prev, equipoLocal: event.target.value }))
                      }
                      className={matchErrors.equipoLocal ? 'organizer-input-error' : ''}
                    />
                    {matchErrors.equipoLocal && (
                      <p className="organizer-error-text">{matchErrors.equipoLocal}</p>
                    )}
                  </div>

                  <div className="organizer-field">
                    <label htmlFor="equipoVisitante">Equipo visitante</label>
                    <input
                      id="equipoVisitante"
                      value={matchForm.equipoVisitante}
                      onChange={event =>
                        setMatchForm(prev => ({ ...prev, equipoVisitante: event.target.value }))
                      }
                      className={matchErrors.equipoVisitante ? 'organizer-input-error' : ''}
                    />
                    {matchErrors.equipoVisitante && (
                      <p className="organizer-error-text">{matchErrors.equipoVisitante}</p>
                    )}
                  </div>
                </div>

                <div className="organizer-form-grid">
                  <div className="organizer-field">
                    <label htmlFor="fechaHora">Fecha y hora</label>
                    <input
                      id="fechaHora"
                      type="datetime-local"
                      value={matchForm.fechaHora}
                      onChange={event =>
                        setMatchForm(prev => ({ ...prev, fechaHora: event.target.value }))
                      }
                      className={matchErrors.fechaHora ? 'organizer-input-error' : ''}
                    />
                    {matchErrors.fechaHora && (
                      <p className="organizer-error-text">{matchErrors.fechaHora}</p>
                    )}
                  </div>

                  <div className="organizer-field">
                    <label htmlFor="cancha">Cancha</label>
                    <input
                      id="cancha"
                      value={matchForm.cancha}
                      onChange={event =>
                        setMatchForm(prev => ({ ...prev, cancha: event.target.value }))
                      }
                      className={matchErrors.cancha ? 'organizer-input-error' : ''}
                    />
                    {matchErrors.cancha && (
                      <p className="organizer-error-text">{matchErrors.cancha}</p>
                    )}
                  </div>
                </div>

                <div className="organizer-inline-actions">
                  <button
                    type="submit"
                    className="organizer-btn organizer-btn-primary"
                    disabled={savingMatch}
                  >
                    {savingMatch ? 'Registrando...' : 'Registrar partido'}
                  </button>
                </div>
              </form>
            </article>

            <article className="organizer-panel">
              <h3>Partidos del torneo</h3>
              {matchesError && (
                <div className="organizer-message organizer-message-error">{matchesError}</div>
              )}
              {matchesLoading ? (
                <div className="organizer-empty">Cargando partidos...</div>
              ) : matches.length === 0 ? (
                <div className="organizer-empty">No hay partidos registrados.</div>
              ) : (
                <table className="organizer-table">
                  <thead>
                    <tr>
                      <th>Encuentro</th>
                      <th>Fecha</th>
                      <th>Cancha</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map(match => (
                      <tr key={match.id}>
                        <td>
                          {match.equipoLocal} vs {match.equipoVisitante}
                        </td>
                        <td>{formatDateTime(match.fechaHora)}</td>
                        <td>{match.cancha}</td>
                        <td>
                          <span className={`organizer-badge ${stateClassName(match.estado)}`}>
                            {match.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </article>
          </div>
        )}

        {activeTab === 'pagos' && (
          <article className="organizer-panel">
            <h3>Pagos pendientes</h3>
            {paymentsError && (
              <div className="organizer-message organizer-message-error">{paymentsError}</div>
            )}
            {paymentsLoading ? (
              <div className="organizer-empty">Cargando pagos pendientes...</div>
            ) : payments.length === 0 ? (
              <div className="organizer-empty">No existen pagos pendientes por validar.</div>
            ) : (
              <table className="organizer-table">
                <thead>
                  <tr>
                    <th>Equipo</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.id}>
                      <td>{payment.equipo}</td>
                      <td>{formatCurrencyCop(payment.monto)}</td>
                      <td>{formatDate(payment.fechaSolicitud)}</td>
                      <td>
                        <span className={`organizer-badge ${stateClassName(payment.estado)}`}>
                          {paymentStatusLabel(payment.estado)}
                        </span>
                      </td>
                      <td>
                        <div className="organizer-inline-actions">
                          <button
                            className="organizer-btn organizer-btn-primary"
                            disabled={processingPaymentId === payment.id}
                            onClick={() => void resolvePayment(payment.id, 'approve')}
                          >
                            Aprobar
                          </button>
                          <button
                            className="organizer-btn organizer-btn-secondary"
                            disabled={processingPaymentId === payment.id}
                            onClick={() => void resolvePayment(payment.id, 'reject')}
                          >
                            Rechazar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </article>
        )}
      </section>
    </div>
  )
}

export default OrganizerTournamentManagePage
