import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  extractApiErrorMessage,
  listarTorneosOrganizador,
  obtenerResumenOrganizador,
  type OrganizerSummary,
  type OrganizerTournament,
} from '../../services/organizerService'
import {
  formatDate,
  paymentStatusLabel,
  stateClassName,
  tournamentStatusLabel,
} from './organizerUtils'
import './organizer.css'

type MessageType = 'success' | 'error' | null

const emptySummary: OrganizerSummary = {
  torneosActivos: 0,
  equiposInscritos: 0,
  partidosJugados: 0,
  pagosPendientes: 0,
}

const OrganizerDashboardPage = () => {
  const [summary, setSummary] = useState<OrganizerSummary>(emptySummary)
  const [tournaments, setTournaments] = useState<OrganizerTournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<MessageType>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [summaryData, tournamentsData] = await Promise.all([
        obtenerResumenOrganizador(),
        listarTorneosOrganizador(),
      ])
      setSummary(summaryData)
      setTournaments(tournamentsData)
    } catch (err) {
      setError(extractApiErrorMessage(err, 'No se pudo cargar el modulo del organizador.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  useEffect(() => {
    const locationState = location.state as { message?: string; type?: MessageType } | null
    if (!locationState?.message) {
      return
    }

    setMessage(locationState.message)
    setMessageType(locationState.type ?? 'success')
    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navigate])

  const selectedTournament = useMemo(
    () => tournaments.find(item => item.estado !== 'FINALIZADO') ?? tournaments[0] ?? null,
    [tournaments]
  )

  const recentPayments = useMemo(
    () =>
      tournaments
        .filter(item => item.pagosPendientes > 0)
        .slice(0, 5)
        .map(item => ({
          id: item.id,
          equipo: item.nombre,
          monto: item.pagosPendientes,
          estado: 'PENDIENTE',
        })),
    [tournaments]
  )

  return (
    <div className="organizer-page">
      <section className="organizer-banner">
        <h1>Panel de Control</h1>
        <p>Organizador</p>
      </section>

      <section className="organizer-container">
        {message && (
          <div
            className={`organizer-message ${
              messageType === 'error' ? 'organizer-message-error' : 'organizer-message-success'
            }`}
          >
            {message}
          </div>
        )}

        {loading && <div className="organizer-empty">Cargando informacion del organizador...</div>}

        {error && !loading && (
          <div className="organizer-message organizer-message-error">{error}</div>
        )}

        {!loading && !error && (
          <>
            <div className="organizer-summary-grid">
              <article className="organizer-summary-card">
                <p className="organizer-summary-title">Torneos activos</p>
                <p className="organizer-summary-value">{summary.torneosActivos}</p>
              </article>
              <article className="organizer-summary-card">
                <p className="organizer-summary-title">Equipos inscritos</p>
                <p className="organizer-summary-value">{summary.equiposInscritos}</p>
              </article>
              <article className="organizer-summary-card">
                <p className="organizer-summary-title">Partidos jugados</p>
                <p className="organizer-summary-value">{summary.partidosJugados}</p>
              </article>
              <article className="organizer-summary-card">
                <p className="organizer-summary-title">Pagos pendientes</p>
                <p className="organizer-summary-value">{summary.pagosPendientes}</p>
              </article>
            </div>

            <div className="organizer-actions">
              <button
                className="organizer-btn organizer-btn-primary"
                onClick={() => navigate('/organizador/torneos/crear')}
              >
                Crear Torneo
              </button>
              <button
                className="organizer-btn organizer-btn-primary"
                onClick={() =>
                  selectedTournament &&
                  navigate(`/organizador/torneos/${selectedTournament.id}?tab=partidos`)
                }
                disabled={!selectedTournament}
              >
                Registrar Partido
              </button>
              <button
                className="organizer-btn organizer-btn-primary"
                onClick={() =>
                  selectedTournament &&
                  navigate(`/organizador/torneos/${selectedTournament.id}?tab=configuracion`)
                }
                disabled={!selectedTournament}
              >
                Configurar Torneo
              </button>
              <button
                className="organizer-btn organizer-btn-primary"
                onClick={() =>
                  selectedTournament &&
                  navigate(`/organizador/torneos/${selectedTournament.id}?tab=pagos`)
                }
                disabled={!selectedTournament}
              >
                Revisar Pagos
              </button>
            </div>

            <div className="organizer-grid-2">
              <section className="organizer-panel">
                <div className="organizer-header-row">
                  <h2>Mis torneos</h2>
                  <button
                    className="organizer-btn organizer-btn-muted"
                    onClick={() => void loadData()}
                  >
                    Actualizar
                  </button>
                </div>

                {tournaments.length === 0 ? (
                  <div className="organizer-empty">
                    No hay torneos registrados. Crea tu primer torneo para empezar.
                  </div>
                ) : (
                  <table className="organizer-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Fechas</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournaments.map(tournament => (
                        <tr key={tournament.id}>
                          <td>{tournament.nombre}</td>
                          <td>
                            {formatDate(tournament.fechaInicio)} - {formatDate(tournament.fechaFin)}
                          </td>
                          <td>
                            <span
                              className={`organizer-badge ${stateClassName(tournament.estado)}`}
                            >
                              {tournamentStatusLabel(tournament.estado)}
                            </span>
                          </td>
                          <td>
                            <button
                              className="organizer-btn organizer-btn-muted"
                              onClick={() => navigate(`/organizador/torneos/${tournament.id}`)}
                            >
                              Gestionar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>

              <aside className="organizer-panel">
                <h3>Pagos recientes</h3>
                {recentPayments.length === 0 ? (
                  <div className="organizer-empty">No hay pagos pendientes.</div>
                ) : (
                  <table className="organizer-table">
                    <thead>
                      <tr>
                        <th>Equipo</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayments.map(payment => (
                        <tr key={payment.id}>
                          <td>
                            <div>{payment.equipo}</div>
                            <small>{payment.monto} pendiente(s)</small>
                          </td>
                          <td>
                            <span className={`organizer-badge ${stateClassName(payment.estado)}`}>
                              {paymentStatusLabel(payment.estado)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </aside>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default OrganizerDashboardPage
