import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import PageHeader from '../../components/common/PageHeader'

interface PartidoBracket {
  partidoId: string
  local: string
  visitante: string
  marcador: string
  estado: string
}

interface Bracket {
  CUARTOS?: PartidoBracket[]
  SEMIFINAL?: PartidoBracket[]
  FINAL?: PartidoBracket[]
}

const EquipoBox = ({ nombre, esGanador }: { nombre: string; esGanador?: boolean }) => (
  <div
    style={{
      backgroundColor: '#ffffff',
      border: `1px solid ${esGanador ? '#11823B' : '#D9D9D9'}`,
      borderRadius: '4px',
      padding: '0.4rem 0.75rem',
      fontSize: '0.78rem',
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: esGanador ? 'bold' : 'normal',
      color: esGanador ? '#11823B' : '#000',
      minWidth: '120px',
      whiteSpace: 'nowrap' as const,
    }}
  >
    {nombre}
  </div>
)

const getGanador = (partido: PartidoBracket): string | null => {
  if (partido.estado !== 'FINALIZADO') return null
  const partes = partido.marcador.split(' - ')
  if (partes.length !== 2) return null
  const golesLocal = Number(partes[0])
  const golesVisitante = Number(partes[1])
  if (golesLocal > golesVisitante) return partido.local
  if (golesVisitante > golesLocal) return partido.visitante
  return null
}

const LlavesPage = () => {
  const navigate = useNavigate()
  const { id: torneoId } = useParams<{ id: string }>()
  const [bracket, setBracket] = useState<Bracket>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!torneoId) return
    apiClient
      .get(`/api/tournaments/${torneoId}/bracket`)
      .then(res => setBracket(res.data))
      .catch(() => setError('Error al cargar las llaves del torneo'))
      .finally(() => setLoading(false))
  }, [torneoId])

  const cuartos = bracket.CUARTOS || []
  const semifinal = bracket.SEMIFINAL || []
  const final_ = bracket.FINAL || []

  const cuartosIzq = cuartos.slice(0, Math.ceil(cuartos.length / 2))
  const cuartosDer = cuartos.slice(Math.ceil(cuartos.length / 2))
  const semifinalIzq = semifinal.slice(0, 1)
  const semifinalDer = semifinal.slice(1, 2)

  return (
    <div>
      <PageHeader
        title="LLAVES"
        subtitle="Consulta los enfrentamientos de las fases eliminatorias"
      />

      <div
        style={{
          backgroundColor: '#D9D9D9',
          padding: '2rem',
          minHeight: '400px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Fondo cancha decorativo */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-15deg)',
            width: '400px',
            height: '500px',
            opacity: 0.08,
            border: '4px solid #11823B',
            borderRadius: '8px',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-15deg)',
            width: '200px',
            height: '200px',
            border: '4px solid #11823B',
            borderRadius: '50%',
            opacity: 0.08,
            pointerEvents: 'none',
          }}
        />

        {loading ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem',
              color: '#737373',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Cargando llaves...
          </div>
        ) : error ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem',
              color: '#ef4444',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            {error}
          </div>
        ) : Object.keys(bracket).length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem',
              color: '#737373',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            No hay llaves generadas para este torneo todavía.
          </div>
        ) : (
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.4)',
              borderRadius: '8px',
              padding: '2rem 1.5rem',
              maxWidth: '900px',
              margin: '0 auto',
              position: 'relative',
            }}
          >
            {/* Headers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}
            >
              {['Cuartos de Final', 'Semifinal', 'Final', 'Semifinal', 'Cuartos de Final'].map(
                (label, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 'bold',
                      color: '#11823B',
                      fontFamily: i === 2 ? 'Poppins, sans-serif' : 'Montserrat, sans-serif',
                      fontStyle: 'italic',
                    }}
                  >
                    {label}
                  </span>
                )
              )}
            </div>

            {/* Bracket */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                alignItems: 'center',
                minHeight: '220px',
              }}
            >
              {/* Cuartos izquierda */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                  paddingRight: '0.5rem',
                }}
              >
                {cuartosIzq.map((p, i) => {
                  const ganador = getGanador(p)
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <EquipoBox nombre={p.local} esGanador={ganador === p.local} />
                      <EquipoBox nombre={p.visitante} esGanador={ganador === p.visitante} />
                    </div>
                  )
                })}
              </div>

              {/* Semifinal izquierda */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  height: '100%',
                  paddingLeft: '0.5rem',
                }}
              >
                {semifinalIzq.map((p, i) => {
                  const ganador = getGanador(p)
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <EquipoBox nombre={p.local} esGanador={ganador === p.local} />
                      <EquipoBox nombre={p.visitante} esGanador={ganador === p.visitante} />
                    </div>
                  )
                })}
              </div>

              {/* Final + Trofeo */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  height: '100%',
                }}
              >
                {final_.length > 0 ? (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        width: '100%',
                      }}
                    >
                      {final_.map((p, i) => {
                        const ganador = getGanador(p)
                        return (
                          <div
                            key={i}
                            style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                          >
                            <EquipoBox nombre={p.local} esGanador={ganador === p.local} />
                            <EquipoBox nombre={p.visitante} esGanador={ganador === p.visitante} />
                          </div>
                        )
                      })}
                    </div>
                    <div style={{ fontSize: '2rem' }}>🏆</div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem' }}>🏆</div>
                    <p
                      style={{
                        fontSize: '0.7rem',
                        color: '#737373',
                        fontFamily: 'Montserrat, sans-serif',
                        marginTop: '0.5rem',
                      }}
                    >
                      Final pendiente
                    </p>
                  </div>
                )}
              </div>

              {/* Semifinal derecha */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  height: '100%',
                  paddingRight: '0.5rem',
                }}
              >
                {semifinalDer.map((p, i) => {
                  const ganador = getGanador(p)
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <EquipoBox nombre={p.local} esGanador={ganador === p.local} />
                      <EquipoBox nombre={p.visitante} esGanador={ganador === p.visitante} />
                    </div>
                  )
                })}
              </div>

              {/* Cuartos derecha */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                  paddingLeft: '0.5rem',
                }}
              >
                {cuartosDer.map((p, i) => {
                  const ganador = getGanador(p)
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <EquipoBox nombre={p.local} esGanador={ganador === p.local} />
                      <EquipoBox nombre={p.visitante} esGanador={ganador === p.visitante} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Botón volver */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            maxWidth: '900px',
            margin: '1rem auto 0',
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: '#737373',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.35rem 0.75rem',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            ←
          </button>
        </div>
      </div>
    </div>
  )
}

export default LlavesPage
