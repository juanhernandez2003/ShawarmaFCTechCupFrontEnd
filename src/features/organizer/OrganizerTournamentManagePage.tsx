import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import DatePickerInput from '../../components/common/DatePickerInput'
import TimePickerInput from '../../components/common/TimePickerInput'
import {
  agregarGoleadorPartido,
  agregarSancionPartido,
  aprobarPago,
  canStartTournament,
  canFinishTournament,
  extractApiErrorMessage,
  finalizarTorneo,
  formatDate,
  formatDateTime,
  guardarResultadoPartido,
  guardarConfiguracionTorneo,
  iniciarTorneo,
  listarPagosPendientes,
  listarPartidosTorneo,
  obtenerDetallePartido,
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
  MatchDetail,
  MatchGoalPayload,
  MatchSanctionPayload,
  OrganizerTournament,
  PendingPayment,
  TournamentConfiguration,
} from '../../services/organizerService'
import { marcarPagoEnRevision, rechazarPago } from '../../services/organizerService'
import { listarEquipos, type Equipo } from '../../services/teamService'
import './organizer.css'

type MessageType = 'success' | 'error'
type ManageTab = 'configuracion' | 'partidos' | 'pagos'
type PaymentFilter = 'TODOS' | 'PENDIENTE' | 'EN_REVISION' | 'APROBADO' | 'RECHAZADO'
type TeamSide = 'LOCAL' | 'VISITANTE'

interface ConfigurationForm {
  reglamento: string
  fechasImportantes: string[]
  nuevaFechaImportante: string
  cierreFecha: string
  cierreHora: string
  horariosPartidos: string[]
  nuevoHorarioPartido: string
  canchas: string[]
  sanciones: string[]
  nuevaSancion: string
}

type MatchForm = CreateMatchPayload

interface GoalDraft {
  equipo: TeamSide
  jugadorId: string
  minuto: number
}

interface SanctionDraft {
  equipo: TeamSide
  jugadorId: string
  minuto: number
  tipoSancion: 'AMARILLA' | 'ROJA'
}

const initialConfigurationForm: ConfigurationForm = {
  reglamento: '',
  fechasImportantes: [],
  nuevaFechaImportante: '',
  cierreFecha: '',
  cierreHora: '',
  horariosPartidos: [],
  nuevoHorarioPartido: '',
  canchas: [],
  sanciones: [],
  nuevaSancion: '',
}

const initialMatchForm: MatchForm = {
  equipoLocal: '',
  equipoVisitante: '',
  fechaHora: '',
  cancha: '',
}

const AVAILABLE_COURTS = ['Cancha 1', 'Cancha 2', 'Cancha 3', 'Cancha 4', 'Cancha 5']

const uniqueValues = (values: string[]) => Array.from(new Set(values.filter(Boolean)))
const normalizeStatus = (value: string) => value.trim().toUpperCase().replace(/\s+/g, '_')
const paymentFilterOptions: { key: PaymentFilter; label: string }[] = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'PENDIENTE', label: 'Pendiente' },
  { key: 'EN_REVISION', label: 'En Revision' },
  { key: 'APROBADO', label: 'Aprobado' },
  { key: 'RECHAZADO', label: 'Rechazado' },
]

const parseCloseDateTime = (value: string, date?: string, hour?: string) => {
  if (date && hour) {
    return { cierreFecha: date, cierreHora: hour }
  }

  if (!value) {
    return { cierreFecha: '', cierreHora: '' }
  }

  const normalizedValue =
    value.includes(' ') && !value.includes('T') ? value.replace(' ', 'T') : value
  const parsedDate = new Date(normalizedValue)
  if (!Number.isNaN(parsedDate.getTime())) {
    return {
      cierreFecha: parsedDate.toISOString().slice(0, 10),
      cierreHora: parsedDate.toTimeString().slice(0, 5),
    }
  }

  if (value.includes('T')) {
    const [rawDate, rawHour] = value.split('T')
    return {
      cierreFecha: rawDate ?? '',
      cierreHora: (rawHour ?? '').slice(0, 5),
    }
  }

  return { cierreFecha: value, cierreHora: '' }
}

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
  const [teamOptions, setTeamOptions] = useState<Equipo[]>([])
  const [teamsLoading, setTeamsLoading] = useState(true)
  const [payments, setPayments] = useState<PendingPayment[]>([])
  const [paymentsLoading, setPaymentsLoading] = useState(true)
  const [paymentsError, setPaymentsError] = useState<string | null>(null)
  const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(null)
  const [paymentSearch, setPaymentSearch] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('TODOS')
  const [selectedMatchId, setSelectedMatchId] = useState('')
  const [selectedMatchDetail, setSelectedMatchDetail] = useState<MatchDetail | null>(null)
  const [selectedMatchLoading, setSelectedMatchLoading] = useState(false)
  const [selectedMatchError, setSelectedMatchError] = useState<string | null>(null)
  const [resultLocal, setResultLocal] = useState('0')
  const [resultVisitante, setResultVisitante] = useState('0')
  const [goalTeamSide, setGoalTeamSide] = useState<TeamSide>('LOCAL')
  const [goalPlayerId, setGoalPlayerId] = useState('')
  const [goalMinute, setGoalMinute] = useState('')
  const [goalDrafts, setGoalDrafts] = useState<GoalDraft[]>([])
  const [yellowTeamSide, setYellowTeamSide] = useState<TeamSide>('LOCAL')
  const [yellowPlayerId, setYellowPlayerId] = useState('')
  const [yellowMinute, setYellowMinute] = useState('')
  const [yellowDrafts, setYellowDrafts] = useState<SanctionDraft[]>([])
  const [redTeamSide, setRedTeamSide] = useState<TeamSide>('LOCAL')
  const [redPlayerId, setRedPlayerId] = useState('')
  const [redMinute, setRedMinute] = useState('')
  const [redDrafts, setRedDrafts] = useState<SanctionDraft[]>([])
  const [savingMatchRecord, setSavingMatchRecord] = useState(false)
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

  const goToOrganizerPanel = () => {
    navigate('/organizador')
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
      const closeDateTime = parseCloseDateTime(
        configuration.cierreInscripciones,
        configuration.cierreInscripcionesFecha,
        configuration.cierreInscripcionesHora
      )

      setConfigurationForm({
        reglamento: configuration.reglamento,
        fechasImportantes: uniqueValues(configuration.fechasImportantes ?? []),
        nuevaFechaImportante: '',
        cierreFecha: closeDateTime.cierreFecha,
        cierreHora: closeDateTime.cierreHora,
        horariosPartidos: uniqueValues(configuration.horarios),
        nuevoHorarioPartido: '',
        canchas: uniqueValues(configuration.canchas),
        sanciones: uniqueValues(configuration.sanciones),
        nuevaSancion: '',
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

  const loadTeams = async () => {
    setTeamsLoading(true)
    try {
      const teams = await listarEquipos()
      setTeamOptions(teams)
    } catch {
      setTeamOptions([])
    } finally {
      setTeamsLoading(false)
    }
  }

  const loadSelectedMatchDetail = async (matchId: string) => {
    setSelectedMatchLoading(true)
    setSelectedMatchError(null)
    try {
      const detail = await obtenerDetallePartido(matchId)
      setSelectedMatchDetail(detail)
      setResultLocal(String(detail.golesLocal ?? 0))
      setResultVisitante(String(detail.golesVisitante ?? 0))
    } catch (error) {
      setSelectedMatchDetail(null)
      setSelectedMatchError(
        extractApiErrorMessage(error, 'No se pudo cargar el detalle del partido seleccionado.')
      )
    } finally {
      setSelectedMatchLoading(false)
    }
  }

  const loadPayments = async (tournamentId: string) => {
    setPaymentsLoading(true)
    setPaymentsError(null)
    try {
      const items = await listarPagosPendientes(tournamentId)
      setPayments(
        [...items].sort((a, b) => {
          const left = a.fechaSolicitud ? new Date(a.fechaSolicitud).getTime() : 0
          const right = b.fechaSolicitud ? new Date(b.fechaSolicitud).getTime() : 0
          return right - left
        })
      )
    } catch (error) {
      setPaymentsError(extractApiErrorMessage(error, 'No se pudieron cargar los pagos pendientes.'))
    } finally {
      setPaymentsLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    void Promise.all([
      loadTournament(id),
      loadConfiguration(id),
      loadMatches(id),
      loadPayments(id),
      loadTeams(),
    ])
  }, [id])

  useEffect(() => {
    if (matches.length === 0) {
      setSelectedMatchId('')
      setSelectedMatchDetail(null)
      return
    }

    setSelectedMatchId(current => {
      if (current && matches.some(match => match.id === current)) {
        return current
      }
      return matches[0].id
    })
  }, [matches])

  useEffect(() => {
    if (!selectedMatchId) return
    void loadSelectedMatchDetail(selectedMatchId)
  }, [selectedMatchId])

  const validateConfiguration = () => {
    const next: Record<string, string> = {}
    if (!configurationForm.reglamento.trim()) {
      next.reglamento = 'El reglamento es obligatorio.'
    }
    if (configurationForm.fechasImportantes.length === 0) {
      next.fechasImportantes = 'Debe registrar al menos una fecha importante.'
    }
    if (!configurationForm.cierreFecha) {
      next.cierreFecha = 'Debe definir la fecha de cierre.'
    }
    if (!configurationForm.cierreHora) {
      next.cierreHora = 'Debe definir la hora de cierre.'
    }
    if (configurationForm.canchas.length === 0) {
      next.canchas = 'Debe registrar al menos una cancha.'
    }
    if (configurationForm.horariosPartidos.length === 0) {
      next.horariosPartidos = 'Debe registrar al menos un horario de partido.'
    }
    if (configurationForm.sanciones.length === 0) {
      next.sanciones = 'Debe registrar al menos una sancion.'
    }
    return next
  }

  const addImportantDate = () => {
    if (!configurationForm.nuevaFechaImportante) return
    setConfigurationForm(prev => ({
      ...prev,
      fechasImportantes: uniqueValues([...prev.fechasImportantes, prev.nuevaFechaImportante]),
      nuevaFechaImportante: '',
    }))
  }

  const removeImportantDate = (value: string) => {
    setConfigurationForm(prev => ({
      ...prev,
      fechasImportantes: prev.fechasImportantes.filter(item => item !== value),
    }))
  }

  const addMatchSchedule = () => {
    if (!configurationForm.nuevoHorarioPartido.trim()) return
    setConfigurationForm(prev => ({
      ...prev,
      horariosPartidos: uniqueValues([...prev.horariosPartidos, prev.nuevoHorarioPartido.trim()]),
      nuevoHorarioPartido: '',
    }))
  }

  const removeMatchSchedule = (value: string) => {
    setConfigurationForm(prev => ({
      ...prev,
      horariosPartidos: prev.horariosPartidos.filter(item => item !== value),
    }))
  }

  const addSanction = () => {
    if (!configurationForm.nuevaSancion.trim()) return
    setConfigurationForm(prev => ({
      ...prev,
      sanciones: uniqueValues([...prev.sanciones, prev.nuevaSancion.trim()]),
      nuevaSancion: '',
    }))
  }

  const removeSanction = (value: string) => {
    setConfigurationForm(prev => ({
      ...prev,
      sanciones: prev.sanciones.filter(item => item !== value),
    }))
  }

  const toggleCourt = (court: string) => {
    setConfigurationForm(prev => ({
      ...prev,
      canchas: prev.canchas.includes(court)
        ? prev.canchas.filter(item => item !== court)
        : [...prev.canchas, court],
    }))
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
      cierreInscripciones: `${configurationForm.cierreFecha}T${configurationForm.cierreHora}`,
      cierreInscripcionesFecha: configurationForm.cierreFecha,
      cierreInscripcionesHora: configurationForm.cierreHora,
      fechasImportantes: configurationForm.fechasImportantes,
      canchas: configurationForm.canchas,
      horarios: configurationForm.horariosPartidos,
      sanciones: configurationForm.sanciones,
    }

    setSavingConfiguration(true)
    try {
      await guardarConfiguracionTorneo(id, payload)
      navigate('/organizador', {
        state: {
          message: 'Configuracion guardada correctamente.',
          type: 'success',
        },
      })
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

  const resolvePayment = async (paymentId: string, action: 'approve' | 'reject' | 'review') => {
    if (!id) return

    setProcessingPaymentId(paymentId)
    try {
      if (action === 'approve') {
        await aprobarPago(id, paymentId)
      } else if (action === 'review') {
        await marcarPagoEnRevision(id, paymentId)
      } else {
        await rechazarPago(id, paymentId)
      }
      if (action === 'approve') {
        pushMessage('success', 'Pago aprobado correctamente.')
      } else if (action === 'reject') {
        pushMessage('success', 'Pago rechazado correctamente.')
      } else {
        pushMessage('success', 'Pago movido a En Revision correctamente.')
      }
      await Promise.all([loadPayments(id), loadTournament(id)])
    } catch (error) {
      if (action === 'review') {
        setPayments(prev =>
          prev.map(payment =>
            payment.id === paymentId ? { ...payment, estado: 'EN_REVISION' } : payment
          )
        )
        pushMessage(
          'success',
          'Pago marcado en En Revision de forma local. El backend no expone esta accion aun.'
        )
        return
      }
      pushMessage(
        'error',
        extractApiErrorMessage(error, 'Ocurrio un error al procesar el pago. Intenta de nuevo.')
      )
    } finally {
      setProcessingPaymentId(null)
    }
  }

  const selectedMatchSummary = useMemo(
    () => matches.find(match => match.id === selectedMatchId) ?? null,
    [matches, selectedMatchId]
  )

  const playersByTeamId = useMemo(() => {
    const map = new Map<string, string[]>()
    teamOptions.forEach(team => {
      map.set(team.id, team.jugadores ?? [])
    })
    return map
  }, [teamOptions])

  const resolveTeamForSide = (side: TeamSide): Equipo | null => {
    if (!selectedMatchDetail) return null

    const targetId =
      side === 'LOCAL' ? selectedMatchDetail.equipoLocalId : selectedMatchDetail.equipoVisitanteId
    if (targetId) {
      return teamOptions.find(team => team.id === targetId) ?? null
    }

    const targetName =
      side === 'LOCAL' ? selectedMatchDetail.equipoLocal : selectedMatchDetail.equipoVisitante
    return teamOptions.find(team => team.nombre === targetName) ?? null
  }

  const playerOptionsBySide = (side: TeamSide): string[] => {
    const team = resolveTeamForSide(side)
    if (!team) return []
    return playersByTeamId.get(team.id) ?? []
  }

  const addGoalDraft = () => {
    const minute = Number(goalMinute)
    if (!goalPlayerId.trim() || Number.isNaN(minute) || minute < 0) {
      pushMessage('error', 'Completa jugador y minuto valido para agregar el goleador.')
      return
    }

    setGoalDrafts(prev => [
      ...prev,
      { equipo: goalTeamSide, jugadorId: goalPlayerId.trim(), minuto: minute },
    ])
    setGoalPlayerId('')
    setGoalMinute('')
  }

  const addSanctionDraft = (type: 'AMARILLA' | 'ROJA') => {
    const side = type === 'AMARILLA' ? yellowTeamSide : redTeamSide
    const playerId = type === 'AMARILLA' ? yellowPlayerId : redPlayerId
    const minuteValue = type === 'AMARILLA' ? yellowMinute : redMinute
    const minute = Number(minuteValue)

    if (!playerId.trim() || Number.isNaN(minute) || minute < 0) {
      pushMessage('error', `Completa jugador y minuto valido para agregar tarjeta ${type}.`)
      return
    }

    const nextDraft: SanctionDraft = {
      equipo: side,
      jugadorId: playerId.trim(),
      minuto: minute,
      tipoSancion: type,
    }

    if (type === 'AMARILLA') {
      setYellowDrafts(prev => [...prev, nextDraft])
      setYellowPlayerId('')
      setYellowMinute('')
      return
    }

    setRedDrafts(prev => [...prev, nextDraft])
    setRedPlayerId('')
    setRedMinute('')
  }

  const saveMatchRecord = async () => {
    if (!id || !selectedMatchId || !selectedMatchDetail) {
      pushMessage('error', 'Selecciona un partido antes de guardar el registro.')
      return
    }

    const localGoals = Number(resultLocal)
    const awayGoals = Number(resultVisitante)
    if (Number.isNaN(localGoals) || localGoals < 0 || Number.isNaN(awayGoals) || awayGoals < 0) {
      pushMessage('error', 'El marcador debe contener numeros enteros validos.')
      return
    }

    const goalPayloads: MatchGoalPayload[] = goalDrafts.map(item => ({
      jugadorId: item.jugadorId,
      minuto: item.minuto,
    }))
    const sanctionPayloads: MatchSanctionPayload[] = [...yellowDrafts, ...redDrafts].map(item => ({
      jugadorId: item.jugadorId,
      minuto: item.minuto,
      tipoSancion: item.tipoSancion,
      descripcion: `Tarjeta ${item.tipoSancion.toLowerCase()} registrada por organizador`,
    }))

    setSavingMatchRecord(true)
    try {
      await guardarResultadoPartido(id, selectedMatchId, {
        golesLocal: localGoals,
        golesVisitante: awayGoals,
      })

      const endpointWarnings: string[] = []

      for (const goal of goalPayloads) {
        try {
          await agregarGoleadorPartido(id, selectedMatchId, goal)
        } catch (error) {
          endpointWarnings.push(extractApiErrorMessage(error, 'No se pudo registrar goleadores.'))
          break
        }
      }

      for (const sanction of sanctionPayloads) {
        try {
          await agregarSancionPartido(id, selectedMatchId, sanction)
        } catch (error) {
          endpointWarnings.push(extractApiErrorMessage(error, 'No se pudo registrar sanciones.'))
          break
        }
      }

      await Promise.all([
        loadMatches(id),
        loadSelectedMatchDetail(selectedMatchId),
        loadTournament(id),
      ])
      setGoalDrafts([])
      setYellowDrafts([])
      setRedDrafts([])

      if (endpointWarnings.length > 0) {
        pushMessage(
          'error',
          `${endpointWarnings[0]} Revisa los endpoints de registro de goleadores y sanciones para organizador.`
        )
      } else {
        pushMessage('success', 'Registro del partido guardado correctamente.')
      }
    } catch (error) {
      pushMessage(
        'error',
        extractApiErrorMessage(error, 'No se pudo guardar el registro del partido.')
      )
    } finally {
      setSavingMatchRecord(false)
    }
  }

  const visibleGoals = useMemo(() => {
    const persisted =
      selectedMatchDetail?.goles.map(goal => ({
        key: `persisted-${goal.id}`,
        label: `${goal.jugador} - Min ${goal.minuto}`,
      })) ?? []

    const drafts = goalDrafts.map((goal, index) => ({
      key: `draft-goal-${index}-${goal.jugadorId}-${goal.minuto}`,
      label: `${goal.jugadorId} - Min ${goal.minuto} (${goal.equipo.toLowerCase()})`,
    }))

    return [...persisted, ...drafts]
  }, [goalDrafts, selectedMatchDetail])

  const visibleYellowCards = useMemo(() => {
    const persisted =
      selectedMatchDetail?.sanciones
        .filter(item => item.tipo === 'AMARILLA')
        .map(item => ({
          key: `persisted-yellow-${item.id}`,
          label: `${item.jugador} - Min ${item.minuto}`,
        })) ?? []

    const drafts = yellowDrafts.map((item, index) => ({
      key: `draft-yellow-${index}-${item.jugadorId}-${item.minuto}`,
      label: `${item.jugadorId} - Min ${item.minuto} (${item.equipo.toLowerCase()})`,
    }))

    return [...persisted, ...drafts]
  }, [selectedMatchDetail, yellowDrafts])

  const visibleRedCards = useMemo(() => {
    const persisted =
      selectedMatchDetail?.sanciones
        .filter(item => item.tipo === 'ROJA')
        .map(item => ({
          key: `persisted-red-${item.id}`,
          label: `${item.jugador} - Min ${item.minuto}`,
        })) ?? []

    const drafts = redDrafts.map((item, index) => ({
      key: `draft-red-${index}-${item.jugadorId}-${item.minuto}`,
      label: `${item.jugadorId} - Min ${item.minuto} (${item.equipo.toLowerCase()})`,
    }))

    return [...persisted, ...drafts]
  }, [redDrafts, selectedMatchDetail])

  const filteredPayments = useMemo(() => {
    const query = paymentSearch.trim().toLowerCase()
    return payments.filter(payment => {
      const normalizedState = normalizeStatus(payment.estado)
      const matchesFilter = paymentFilter === 'TODOS' || normalizedState === paymentFilter
      if (!matchesFilter) return false
      if (!query) return true

      return (
        payment.equipo.toLowerCase().includes(query) ||
        payment.capitan.toLowerCase().includes(query)
      )
    })
  }, [paymentFilter, paymentSearch, payments])

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
                    placeholder="Escribe las reglas del torneo..."
                  />
                  {configurationErrors.reglamento && (
                    <p className="organizer-error-text">{configurationErrors.reglamento}</p>
                  )}
                </div>

                <div className="organizer-field">
                  <label htmlFor="nuevaFechaImportante">Fechas importantes</label>
                  <div className="organizer-list-input">
                    <DatePickerInput
                      id="nuevaFechaImportante"
                      value={configurationForm.nuevaFechaImportante}
                      onChange={value =>
                        setConfigurationForm(prev => ({
                          ...prev,
                          nuevaFechaImportante: value,
                        }))
                      }
                      placeholder="Selecciona fecha"
                    />
                    <button
                      type="button"
                      className="organizer-btn organizer-btn-primary"
                      onClick={addImportantDate}
                    >
                      Añadir fecha
                    </button>
                  </div>
                  {configurationErrors.fechasImportantes && (
                    <p className="organizer-error-text">{configurationErrors.fechasImportantes}</p>
                  )}
                  <div className="organizer-chip-list">
                    {configurationForm.fechasImportantes.map(date => (
                      <span key={date} className="organizer-chip">
                        {formatDate(date)}
                        <button
                          type="button"
                          onClick={() => removeImportantDate(date)}
                          className="organizer-chip-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="organizer-form-grid">
                  <div className="organizer-field">
                    <label htmlFor="cierreFecha">Cierre de inscripciones - Fecha de cierre</label>
                    <DatePickerInput
                      id="cierreFecha"
                      value={configurationForm.cierreFecha}
                      onChange={value =>
                        setConfigurationForm(prev => ({ ...prev, cierreFecha: value }))
                      }
                      hasError={Boolean(configurationErrors.cierreFecha)}
                      placeholder="Seleccionar fecha"
                    />
                    {configurationErrors.cierreFecha && (
                      <p className="organizer-error-text">{configurationErrors.cierreFecha}</p>
                    )}
                  </div>

                  <div className="organizer-field">
                    <label htmlFor="cierreHora">Cierre de inscripciones - Hora de cierre</label>
                    <TimePickerInput
                      id="cierreHora"
                      value={configurationForm.cierreHora}
                      onChange={value =>
                        setConfigurationForm(prev => ({ ...prev, cierreHora: value }))
                      }
                      hasError={Boolean(configurationErrors.cierreHora)}
                      placeholder="Seleccionar hora"
                    />
                    {configurationErrors.cierreHora && (
                      <p className="organizer-error-text">{configurationErrors.cierreHora}</p>
                    )}
                  </div>
                </div>

                <div className="organizer-field">
                  <label htmlFor="nuevoHorarioPartido">Horarios de partidos</label>
                  <div className="organizer-list-input">
                    <input
                      id="nuevoHorarioPartido"
                      value={configurationForm.nuevoHorarioPartido}
                      onChange={event =>
                        setConfigurationForm(prev => ({
                          ...prev,
                          nuevoHorarioPartido: event.target.value,
                        }))
                      }
                      placeholder="Ej: Sabado 08:00 - Jornada 1"
                    />
                    <button
                      type="button"
                      className="organizer-btn organizer-btn-primary"
                      onClick={addMatchSchedule}
                    >
                      Añadir partido
                    </button>
                  </div>
                  {configurationErrors.horariosPartidos && (
                    <p className="organizer-error-text">{configurationErrors.horariosPartidos}</p>
                  )}
                  <div className="organizer-chip-list">
                    {configurationForm.horariosPartidos.map(schedule => (
                      <span key={schedule} className="organizer-chip">
                        {schedule}
                        <button
                          type="button"
                          onClick={() => removeMatchSchedule(schedule)}
                          className="organizer-chip-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="organizer-field">
                  <label>Canchas</label>
                  <div className="organizer-checkbox-grid">
                    {AVAILABLE_COURTS.map(court => (
                      <label key={court} className="organizer-checkbox-item">
                        <input
                          type="checkbox"
                          checked={configurationForm.canchas.includes(court)}
                          onChange={() => toggleCourt(court)}
                        />
                        <span>{court}</span>
                      </label>
                    ))}
                  </div>
                  {configurationErrors.canchas && (
                    <p className="organizer-error-text">{configurationErrors.canchas}</p>
                  )}
                </div>

                <div className="organizer-field">
                  <label htmlFor="nuevaSancion">Sanciones</label>
                  <div className="organizer-list-input">
                    <input
                      id="nuevaSancion"
                      value={configurationForm.nuevaSancion}
                      onChange={event =>
                        setConfigurationForm(prev => ({
                          ...prev,
                          nuevaSancion: event.target.value,
                        }))
                      }
                      placeholder="Ej: Tarjeta roja directa = 1 fecha"
                    />
                    <button
                      type="button"
                      className="organizer-btn organizer-btn-primary"
                      onClick={addSanction}
                    >
                      Añadir sancion
                    </button>
                  </div>
                  {configurationErrors.sanciones && (
                    <p className="organizer-error-text">{configurationErrors.sanciones}</p>
                  )}
                  <div className="organizer-chip-list">
                    {configurationForm.sanciones.map(sanction => (
                      <span key={sanction} className="organizer-chip">
                        {sanction}
                        <button
                          type="button"
                          onClick={() => removeSanction(sanction)}
                          className="organizer-chip-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="organizer-inline-actions">
                  <button
                    type="submit"
                    className="organizer-btn organizer-btn-primary"
                    disabled={savingConfiguration}
                  >
                    {savingConfiguration
                      ? 'Guardando configuracion...'
                      : 'Guardar configuracion y volver al panel'}
                  </button>
                </div>
              </form>
            )}
          </article>
        )}

        {activeTab === 'partidos' && (
          <div className="organizer-match-layout">
            <article className="organizer-panel organizer-match-full">
              <h3>Registro de partidos</h3>
              <p className="organizer-match-subtitle">Registre el resultado del partido</p>

              {matchesError && (
                <div className="organizer-message organizer-message-error">{matchesError}</div>
              )}

              <div className="organizer-field">
                <label htmlFor="selectedMatch">Seleccionar partido</label>
                <select
                  id="selectedMatch"
                  value={selectedMatchId}
                  onChange={event => setSelectedMatchId(event.target.value)}
                  disabled={matchesLoading || matches.length === 0}
                >
                  {matches.length === 0 ? (
                    <option value="">No hay partidos registrados</option>
                  ) : (
                    matches.map(match => (
                      <option key={match.id} value={match.id}>
                        {match.equipoLocal} vs {match.equipoVisitante} -{' '}
                        {formatDateTime(match.fechaHora)}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {matchesLoading ? (
                <div className="organizer-empty">Cargando partidos...</div>
              ) : matches.length === 0 ? (
                <div className="organizer-empty">No hay partidos registrados para este torneo.</div>
              ) : (
                <>
                  <div className="organizer-match-grid">
                    <section className="organizer-panel organizer-match-card">
                      <h4>Marcador</h4>
                      {selectedMatchLoading ? (
                        <div className="organizer-empty">Cargando detalle del partido...</div>
                      ) : selectedMatchError ? (
                        <div className="organizer-message organizer-message-error">
                          {selectedMatchError}
                        </div>
                      ) : (
                        <>
                          <div className="organizer-scoreboard">
                            <div className="organizer-score-side">
                              <p>{selectedMatchSummary?.equipoLocal ?? 'Equipo local'}</p>
                              <input
                                type="number"
                                min={0}
                                value={resultLocal}
                                onChange={event => setResultLocal(event.target.value)}
                              />
                            </div>
                            <span className="organizer-score-vs">VS</span>
                            <div className="organizer-score-side">
                              <p>{selectedMatchSummary?.equipoVisitante ?? 'Equipo visitante'}</p>
                              <input
                                type="number"
                                min={0}
                                value={resultVisitante}
                                onChange={event => setResultVisitante(event.target.value)}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </section>

                    <section className="organizer-panel organizer-match-card">
                      <h4>Tarjetas Amarillas</h4>
                      <div className="organizer-match-form-grid">
                        <select
                          value={yellowTeamSide}
                          onChange={event => setYellowTeamSide(event.target.value as TeamSide)}
                        >
                          <option value="LOCAL">Equipo local</option>
                          <option value="VISITANTE">Equipo visitante</option>
                        </select>

                        {playerOptionsBySide(yellowTeamSide).length > 0 ? (
                          <select
                            value={yellowPlayerId}
                            onChange={event => setYellowPlayerId(event.target.value)}
                          >
                            <option value="">Jugador (ID)</option>
                            {playerOptionsBySide(yellowTeamSide).map(playerId => (
                              <option key={`yellow-${yellowTeamSide}-${playerId}`} value={playerId}>
                                {playerId}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            placeholder="Jugador (ID)"
                            value={yellowPlayerId}
                            onChange={event => setYellowPlayerId(event.target.value)}
                          />
                        )}

                        <input
                          type="number"
                          min={0}
                          placeholder="Min"
                          value={yellowMinute}
                          onChange={event => setYellowMinute(event.target.value)}
                        />
                        <button
                          type="button"
                          className="organizer-btn organizer-btn-primary"
                          onClick={() => addSanctionDraft('AMARILLA')}
                        >
                          Agregar
                        </button>
                      </div>

                      <div className="organizer-match-list-box">
                        {visibleYellowCards.length === 0 ? (
                          <p>No hay tarjetas amarillas en el partido.</p>
                        ) : (
                          visibleYellowCards.map(item => <p key={item.key}>{item.label}</p>)
                        )}
                      </div>
                    </section>

                    <section className="organizer-panel organizer-match-card">
                      <h4>Goleadores</h4>
                      <div className="organizer-match-form-grid">
                        <select
                          value={goalTeamSide}
                          onChange={event => setGoalTeamSide(event.target.value as TeamSide)}
                        >
                          <option value="LOCAL">Equipo local</option>
                          <option value="VISITANTE">Equipo visitante</option>
                        </select>

                        {playerOptionsBySide(goalTeamSide).length > 0 ? (
                          <select
                            value={goalPlayerId}
                            onChange={event => setGoalPlayerId(event.target.value)}
                          >
                            <option value="">Jugador (ID)</option>
                            {playerOptionsBySide(goalTeamSide).map(playerId => (
                              <option key={`goal-${goalTeamSide}-${playerId}`} value={playerId}>
                                {playerId}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            placeholder="Jugador (ID)"
                            value={goalPlayerId}
                            onChange={event => setGoalPlayerId(event.target.value)}
                          />
                        )}

                        <input
                          type="number"
                          min={0}
                          placeholder="Min"
                          value={goalMinute}
                          onChange={event => setGoalMinute(event.target.value)}
                        />
                        <button
                          type="button"
                          className="organizer-btn organizer-btn-primary"
                          onClick={addGoalDraft}
                        >
                          Agregar Goleador
                        </button>
                      </div>

                      <div className="organizer-match-list-box">
                        {visibleGoals.length === 0 ? (
                          <p>No hay goleadores registrados en el partido.</p>
                        ) : (
                          visibleGoals.map(item => <p key={item.key}>{item.label}</p>)
                        )}
                      </div>
                    </section>

                    <section className="organizer-panel organizer-match-card">
                      <h4>Tarjetas Rojas</h4>
                      <div className="organizer-match-form-grid">
                        <select
                          value={redTeamSide}
                          onChange={event => setRedTeamSide(event.target.value as TeamSide)}
                        >
                          <option value="LOCAL">Equipo local</option>
                          <option value="VISITANTE">Equipo visitante</option>
                        </select>

                        {playerOptionsBySide(redTeamSide).length > 0 ? (
                          <select
                            value={redPlayerId}
                            onChange={event => setRedPlayerId(event.target.value)}
                          >
                            <option value="">Jugador (ID)</option>
                            {playerOptionsBySide(redTeamSide).map(playerId => (
                              <option key={`red-${redTeamSide}-${playerId}`} value={playerId}>
                                {playerId}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            placeholder="Jugador (ID)"
                            value={redPlayerId}
                            onChange={event => setRedPlayerId(event.target.value)}
                          />
                        )}

                        <input
                          type="number"
                          min={0}
                          placeholder="Min"
                          value={redMinute}
                          onChange={event => setRedMinute(event.target.value)}
                        />
                        <button
                          type="button"
                          className="organizer-btn organizer-btn-primary"
                          onClick={() => addSanctionDraft('ROJA')}
                        >
                          Agregar
                        </button>
                      </div>

                      <div className="organizer-match-list-box">
                        {visibleRedCards.length === 0 ? (
                          <p>No hay tarjetas rojas en el partido.</p>
                        ) : (
                          visibleRedCards.map(item => <p key={item.key}>{item.label}</p>)
                        )}
                      </div>
                    </section>
                  </div>

                  <div className="organizer-match-actions">
                    <button
                      type="button"
                      className="organizer-btn organizer-btn-muted"
                      onClick={() => {
                        setGoalDrafts([])
                        setYellowDrafts([])
                        setRedDrafts([])
                        setResultLocal(String(selectedMatchDetail?.golesLocal ?? 0))
                        setResultVisitante(String(selectedMatchDetail?.golesVisitante ?? 0))
                      }}
                      disabled={savingMatchRecord}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="organizer-btn organizer-btn-primary"
                      onClick={() => void saveMatchRecord()}
                      disabled={savingMatchRecord || selectedMatchLoading}
                    >
                      {savingMatchRecord ? 'Guardando...' : 'Guardar Registro'}
                    </button>
                  </div>
                </>
              )}
            </article>

            <article className="organizer-panel">
              <h3>Programar nuevo partido</h3>
              <form className="organizer-form" onSubmit={saveMatch}>
                <div className="organizer-form-grid">
                  <div className="organizer-field">
                    <label htmlFor="equipoLocal">Equipo local</label>
                    <select
                      id="equipoLocal"
                      value={matchForm.equipoLocal}
                      onChange={event =>
                        setMatchForm(prev => ({ ...prev, equipoLocal: event.target.value }))
                      }
                      className={matchErrors.equipoLocal ? 'organizer-input-error' : ''}
                      disabled={teamsLoading}
                    >
                      <option value="">Selecciona equipo local</option>
                      {teamOptions.map(team => (
                        <option key={`local-${team.id}`} value={team.nombre}>
                          {team.nombre}
                        </option>
                      ))}
                    </select>
                    {matchErrors.equipoLocal && (
                      <p className="organizer-error-text">{matchErrors.equipoLocal}</p>
                    )}
                  </div>

                  <div className="organizer-field">
                    <label htmlFor="equipoVisitante">Equipo visitante</label>
                    <select
                      id="equipoVisitante"
                      value={matchForm.equipoVisitante}
                      onChange={event =>
                        setMatchForm(prev => ({ ...prev, equipoVisitante: event.target.value }))
                      }
                      className={matchErrors.equipoVisitante ? 'organizer-input-error' : ''}
                      disabled={teamsLoading}
                    >
                      <option value="">Selecciona equipo visitante</option>
                      {teamOptions.map(team => (
                        <option key={`visit-${team.id}`} value={team.nombre}>
                          {team.nombre}
                        </option>
                      ))}
                    </select>
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
                    <select
                      id="cancha"
                      value={matchForm.cancha}
                      onChange={event =>
                        setMatchForm(prev => ({ ...prev, cancha: event.target.value }))
                      }
                      className={matchErrors.cancha ? 'organizer-input-error' : ''}
                    >
                      <option value="">Selecciona cancha</option>
                      {AVAILABLE_COURTS.map(court => (
                        <option key={`new-${court}`} value={court}>
                          {court}
                        </option>
                      ))}
                    </select>
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
            <div className="organizer-payment-header">
              <h3>Pagos</h3>
              <div className="organizer-payment-header-actions">
                <button
                  className="organizer-btn organizer-btn-secondary organizer-payment-refresh"
                  onClick={() => id && void loadPayments(id)}
                >
                  Actualizar
                </button>
              </div>
            </div>

            <p className="organizer-payment-subtitle">Revise sus pagos</p>

            <div className="organizer-payment-filters">
              {paymentFilterOptions.map(option => (
                <button
                  key={option.key}
                  type="button"
                  className={`organizer-payment-filter ${
                    paymentFilter === option.key ? 'active' : ''
                  }`}
                  onClick={() => setPaymentFilter(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="organizer-payment-search-row">
              <input
                value={paymentSearch}
                onChange={event => setPaymentSearch(event.target.value)}
                placeholder="Buscar por equipo o capitan..."
                className="organizer-payment-search"
              />
            </div>

            {paymentsError && (
              <div className="organizer-message organizer-message-error">{paymentsError}</div>
            )}
            {paymentsLoading ? (
              <div className="organizer-empty">Cargando pagos pendientes...</div>
            ) : payments.length === 0 ? (
              <div className="organizer-empty">No existen pagos para revisar.</div>
            ) : filteredPayments.length === 0 ? (
              <div className="organizer-empty">
                No hay pagos que coincidan con el filtro aplicado.
              </div>
            ) : (
              <table className="organizer-table organizer-payment-table">
                <thead>
                  <tr>
                    <th>Equipo</th>
                    <th>Capitan</th>
                    <th>Fecha de subida</th>
                    <th>Comprobante</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map(payment => {
                    const normalizedState = normalizeStatus(payment.estado)
                    const canUpdate =
                      normalizedState === 'PENDIENTE' || normalizedState === 'EN_REVISION'
                    const canMoveToReview = normalizedState === 'PENDIENTE'

                    return (
                      <tr key={payment.id}>
                        <td>
                          <div className="organizer-payment-team">
                            <span className="organizer-payment-team-icon" aria-hidden>
                              T
                            </span>
                            <span>{payment.equipo}</span>
                          </div>
                        </td>
                        <td>{payment.capitan}</td>
                        <td>{formatDate(payment.fechaSolicitud)}</td>
                        <td>
                          <div className="organizer-payment-receipt">
                            <button
                              type="button"
                              className="organizer-payment-receipt-btn"
                              disabled={!payment.comprobante}
                              title={
                                payment.comprobante
                                  ? 'Comprobante disponible'
                                  : 'Sin comprobante disponible en backend'
                              }
                            >
                              Ver
                            </button>
                          </div>
                        </td>
                        <td>
                          <span className={`organizer-badge ${stateClassName(payment.estado)}`}>
                            {paymentStatusLabel(payment.estado)}
                          </span>
                        </td>
                        <td>
                          <div className="organizer-payment-actions">
                            {canUpdate ? (
                              <>
                                <button
                                  className="organizer-btn organizer-btn-primary organizer-payment-action"
                                  disabled={processingPaymentId === payment.id}
                                  onClick={() => void resolvePayment(payment.id, 'approve')}
                                >
                                  Aprobar
                                </button>
                                <button
                                  className="organizer-btn organizer-btn-secondary organizer-payment-action organizer-payment-reject"
                                  disabled={processingPaymentId === payment.id}
                                  onClick={() => void resolvePayment(payment.id, 'reject')}
                                >
                                  Rechazar
                                </button>
                                {canMoveToReview && (
                                  <button
                                    className="organizer-btn organizer-payment-action organizer-payment-review"
                                    disabled={processingPaymentId === payment.id}
                                    onClick={() => void resolvePayment(payment.id, 'review')}
                                  >
                                    En Revision
                                  </button>
                                )}
                              </>
                            ) : (
                              <span className="organizer-payment-no-actions">Sin acciones</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}

            {!paymentsLoading && payments.length > 0 && (
              <p className="organizer-payment-count">
                Mostrando {filteredPayments.length} de {payments.length} pagos
              </p>
            )}
          </article>
        )}

        <div className="organizer-bottom-nav">
          <button
            type="button"
            className="organizer-arrow-btn"
            onClick={goToOrganizerPanel}
            aria-label="Volver al panel del organizador"
            title="Volver al panel"
          >
            &#8592;
          </button>
        </div>
      </section>
    </div>
  )
}

export default OrganizerTournamentManagePage
