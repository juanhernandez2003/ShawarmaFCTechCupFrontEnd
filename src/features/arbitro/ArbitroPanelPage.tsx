import { useEffect, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import {
  obtenerHistorialPartidosArbitrados,
  obtenerPartidosAsignadosArbitro,
  type RefereeMatch,
} from '../../services/arbitroService'
import ArbitroQuickActions from './ArbitroQuickActions'
import { notificaciones } from './arbitroData'

const cardStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  padding: '1.2rem',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
}

const ArbitroPanelPage = () => {
  const navigate = useNavigate()
  const [partidosAsignadosLista, setPartidosAsignadosLista] = useState<RefereeMatch[]>([])
  const [loadingAsignados, setLoadingAsignados] = useState<boolean>(true)
  const [errorAsignados, setErrorAsignados] = useState<string | null>(null)
  const [historialPartidos, setHistorialPartidos] = useState<RefereeMatch[]>([])
  const [loadingHistorial, setLoadingHistorial] = useState<boolean>(true)
  const [fromBackendHistorial, setFromBackendHistorial] = useState<boolean>(false)
  const [errorHistorial, setErrorHistorial] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadPanelData = async () => {
      setLoadingAsignados(true)
      setLoadingHistorial(true)
      setErrorAsignados(null)
      setErrorHistorial(null)

      const [asignadosResult, historialResult] = await Promise.all([
        obtenerPartidosAsignadosArbitro(),
        obtenerHistorialPartidosArbitrados(),
      ])

      if (!isMounted) return

      setPartidosAsignadosLista(asignadosResult.matches)
      setErrorAsignados(asignadosResult.error)
      setLoadingAsignados(false)

      setHistorialPartidos(historialResult.matches)
      setFromBackendHistorial(historialResult.fromBackend)
      setErrorHistorial(historialResult.error)
      setLoadingHistorial(false)
    }

    void loadPanelData()

    return () => {
      isMounted = false
    }
  }, [])

  const partidosAsignadosResumen = partidosAsignadosLista.length
  const partidosArbitrados = historialPartidos.length
  const proximoPartidoData = partidosAsignadosLista[0] ?? null
  const proximoPartidoResumen = proximoPartidoData
    ? `${proximoPartidoData.local} vs ${proximoPartidoData.visitante}`
    : '0'
  const canchaAsignadaResumen = proximoPartidoData?.cancha ?? 'Sin cancha'

  return (
    <div>
      <PageHeader title="Panel de Control" subtitle="Arbitro" />

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ marginBottom: '0.8rem' }}>
          <h2 style={{ margin: 0, color: '#111827', fontSize: '1.1rem' }}>Resumen del arbitro</h2>
          <p
            style={{
              margin: '0.15rem 0 0',
              color: '#6B7280',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
            }}
          >
            Arbitro
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.75rem',
          }}
        >
          <div style={cardStyle}>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.78rem' }}>Partidos Asignados</p>
            <p
              style={{
                margin: '0.4rem 0 0',
                fontSize: '1.8rem',
                fontWeight: 700,
                color: '#111827',
              }}
            >
              {partidosAsignadosResumen}
            </p>
          </div>
          <div style={cardStyle}>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.78rem' }}>Partidos Arbitrados</p>
            <p
              style={{
                margin: '0.4rem 0 0',
                fontSize: '1.8rem',
                fontWeight: 700,
                color: '#111827',
              }}
            >
              {partidosArbitrados}
            </p>
          </div>
          <div style={cardStyle}>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.78rem' }}>Proximo Partido</p>
            <p
              style={{
                margin: '0.4rem 0 0',
                fontSize: '1.8rem',
                fontWeight: 700,
                color: '#111827',
              }}
            >
              {proximoPartidoResumen}
            </p>
          </div>
          <div style={cardStyle}>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.78rem' }}>Cancha Asignada</p>
            <p
              style={{
                margin: '0.4rem 0 0',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#111827',
              }}
            >
              {canchaAsignadaResumen}
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: '0.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '0.75rem',
          }}
        >
          <div style={cardStyle}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#111827' }}>Proximo Partido</h3>
            {!loadingAsignados && !proximoPartidoData && (
              <p style={{ margin: '0.9rem 0 0', color: '#6B7280', fontSize: '0.8rem' }}>
                No tienes un proximo partido asignado.
              </p>
            )}
            {proximoPartidoData && (
              <>
                <p style={{ margin: '0.9rem 0 0.25rem', color: '#6B7280', fontSize: '0.8rem' }}>
                  {proximoPartidoData.fecha}
                </p>
                <p style={{ margin: 0, color: '#6B7280', fontSize: '0.8rem' }}>
                  {proximoPartidoData.cancha}
                </p>
                <p style={{ margin: '0.7rem 0 0', color: '#111827', fontWeight: 700 }}>
                  {proximoPartidoData.local} vs {proximoPartidoData.visitante}
                </p>
              </>
            )}
          </div>

          <div style={cardStyle}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#111827' }}>Notificaciones</h3>
            <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.65rem' }}>
              {notificaciones.map(notificacion => (
                <div
                  key={notificacion}
                  style={{
                    paddingBottom: '0.65rem',
                    borderBottom: '1px solid #E5E7EB',
                    fontSize: '0.8rem',
                    color: '#374151',
                  }}
                >
                  {notificacion}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, marginTop: '0.75rem', overflowX: 'auto' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#111827' }}>Partidos Asignados</h3>
          {loadingAsignados && (
            <p style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: '#6B7280' }}>
              Cargando partidos asignados...
            </p>
          )}
          {!loadingAsignados && errorAsignados && (
            <p style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: '#B91C1C' }}>
              Error al cargar partidos asignados: {errorAsignados}
            </p>
          )}
          {!loadingAsignados && partidosAsignadosLista.length === 0 && (
            <p style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: '#6B7280' }}>
              No tienes partidos asignados por ahora.
            </p>
          )}
          {!loadingAsignados && partidosAsignadosLista.length > 0 && (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '0.75rem',
                minWidth: '760px',
              }}
            >
              <thead>
                <tr>
                  {['Fecha', 'Equipos', 'Cancha', 'Estado', 'Acciones'].map(col => (
                    <th
                      key={col}
                      style={{
                        textAlign: 'left',
                        padding: '0.55rem',
                        borderBottom: '1px solid #E5E7EB',
                        fontSize: '0.78rem',
                        color: '#374151',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {partidosAsignadosLista.map(partido => (
                  <tr key={partido.id}>
                    <td style={{ padding: '0.55rem', fontSize: '0.78rem' }}>{partido.fecha}</td>
                    <td style={{ padding: '0.55rem', fontSize: '0.78rem' }}>
                      {partido.local} vs {partido.visitante}
                    </td>
                    <td style={{ padding: '0.55rem', fontSize: '0.78rem' }}>{partido.cancha}</td>
                    <td style={{ padding: '0.55rem', fontSize: '0.78rem', fontWeight: 600 }}>
                      {partido.status}
                    </td>
                    <td style={{ padding: '0.55rem' }}>
                      <button
                        onClick={() =>
                          navigate(`/arbitro/partidos?matchId=${encodeURIComponent(partido.id)}`)
                        }
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#11823B',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          padding: 0,
                        }}
                      >
                        Gestionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ ...cardStyle, marginTop: '0.75rem', overflowX: 'auto' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#111827' }}>
            Historial de Partidos Arbitrados
          </h3>
          {loadingHistorial && (
            <p style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: '#6B7280' }}>
              Cargando partidos arbitrados...
            </p>
          )}
          {!loadingHistorial && errorHistorial && (
            <p style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: '#B91C1C' }}>
              Error al cargar historial de partidos arbitrados: {errorHistorial}
            </p>
          )}
          {!loadingHistorial && historialPartidos.length === 0 && (
            <p style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: '#6B7280' }}>
              {fromBackendHistorial
                ? 'Aun no hay partidos arbitrados registrados en la base de datos.'
                : 'No hay datos de partidos arbitrados disponibles por ahora.'}
            </p>
          )}
          {!loadingHistorial && historialPartidos.length > 0 && (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '0.75rem',
                minWidth: '760px',
              }}
            >
              <thead>
                <tr>
                  {['Fecha', 'Equipos', 'Cancha', 'Marcador', 'Acciones'].map(col => (
                    <th
                      key={col}
                      style={{
                        textAlign: 'left',
                        padding: '0.55rem',
                        borderBottom: '1px solid #E5E7EB',
                        fontSize: '0.78rem',
                        color: '#374151',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historialPartidos.map(partido => (
                  <tr key={partido.id}>
                    <td style={{ padding: '0.55rem', fontSize: '0.78rem' }}>{partido.fecha}</td>
                    <td style={{ padding: '0.55rem', fontSize: '0.78rem' }}>
                      {partido.local} vs {partido.visitante}
                    </td>
                    <td style={{ padding: '0.55rem', fontSize: '0.78rem' }}>{partido.cancha}</td>
                    <td style={{ padding: '0.55rem', fontSize: '0.78rem', fontWeight: 700 }}>
                      {partido.marcador}
                    </td>
                    <td style={{ padding: '0.55rem' }}>
                      <button
                        onClick={() =>
                          navigate(
                            `/arbitro/alineaciones?matchId=${encodeURIComponent(partido.id)}`
                          )
                        }
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#11823B',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          padding: 0,
                        }}
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <ArbitroQuickActions />
      </div>
    </div>
  )
}

export default ArbitroPanelPage
