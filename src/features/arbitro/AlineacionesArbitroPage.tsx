import { useEffect, useState, type CSSProperties } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import { obtenerAlineacionesArbitro } from '../../services/arbitroService'
import ArbitroQuickActions from './ArbitroQuickActions'
import { type ArbitroLineups, alineaciones } from './arbitroData'

interface FieldPoint {
  x: number
  y: number
}

interface TeamFieldProps {
  equipo: string
  jugadores: string[]
  colorJugador: string
}

const panelStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  padding: '1rem',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
}

const fieldShapeStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '390px',
  borderRadius: '12px',
  background:
    'linear-gradient(180deg, rgba(24,135,70,1) 0%, rgba(20,120,62,1) 50%, rgba(16,105,55,1) 100%)',
  border: '3px solid #0E6E32',
  overflow: 'hidden',
}

const FUTBOL_7_TITULARES = 7

const formation231: FieldPoint[] = [
  { x: 50, y: 90 }, // GK
  { x: 30, y: 72 },
  { x: 70, y: 72 },
  { x: 20, y: 53 },
  { x: 50, y: 49 },
  { x: 80, y: 53 },
  { x: 50, y: 30 },
]

const getShortName = (name: string): string => {
  const parts = name.trim().split(' ')
  if (parts.length <= 1) return parts[0]
  return `${parts[0]} ${parts[1][0]}.`
}

const TeamField = ({ equipo, jugadores, colorJugador }: TeamFieldProps) => {
  return (
    <div style={panelStyle}>
      <div
        style={{
          marginBottom: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1rem', color: '#111827' }}>{equipo}</h2>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#0E6E32',
            backgroundColor: '#E8F7EE',
            padding: '0.2rem 0.5rem',
            borderRadius: '999px',
          }}
        >
          Formacion 2-3-1 (futbol 7)
        </span>
      </div>

      <div style={fieldShapeStyle}>
        <div
          style={{
            position: 'absolute',
            inset: '8px',
            border: '2px solid rgba(255, 255, 255, 0.72)',
            borderRadius: '8px',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '8px',
            bottom: '8px',
            width: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.72)',
            transform: 'translateX(-50%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '84px',
            height: '84px',
            border: '2px solid rgba(255, 255, 255, 0.72)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '22%',
            right: '22%',
            height: '18%',
            border: '2px solid rgba(255, 255, 255, 0.72)',
            borderTop: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '22%',
            right: '22%',
            height: '18%',
            border: '2px solid rgba(255, 255, 255, 0.72)',
            borderBottom: 'none',
          }}
        />

        {formation231.map((position, index) => {
          const playerName = jugadores[index] ?? `Jugador ${index + 1}`
          return (
            <div
              key={`${equipo}-${playerName}`}
              style={{
                position: 'absolute',
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                width: '74px',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  backgroundColor: colorJugador,
                  border: '2px solid #FFFFFF',
                  color: '#FFFFFF',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.22)',
                }}
              >
                {index + 1}
              </div>
              <div
                style={{
                  marginTop: '0.2rem',
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  color: '#0F172A',
                  backgroundColor: 'rgba(255, 255, 255, 0.88)',
                  borderRadius: '4px',
                  padding: '0.06rem 0.2rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={playerName}
              >
                {getShortName(playerName)}
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ margin: '0.65rem 0 0', color: '#6B7280', fontSize: '0.76rem' }}>
        Organizacion titular visual del equipo (7 jugadores en cancha).
      </p>
    </div>
  )
}

const AlineacionesArbitroPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [lineups, setLineups] = useState<ArbitroLineups>(alineaciones)
  const [loading, setLoading] = useState<boolean>(true)
  const [fromBackend, setFromBackend] = useState<boolean>(false)

  const matchId = searchParams.get('matchId') ?? undefined

  useEffect(() => {
    let isMounted = true

    const loadLineups = async () => {
      setLoading(true)
      try {
        const result = await obtenerAlineacionesArbitro(matchId)
        if (!isMounted) return
        setLineups(result.lineups)
        setFromBackend(result.fromBackend)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadLineups()

    return () => {
      isMounted = false
    }
  }, [matchId])

  return (
    <div>
      <PageHeader
        title="Ver Alineaciones"
        subtitle={`${lineups.local.equipo} vs ${lineups.visitante.equipo}`}
      />

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ marginBottom: '0.75rem', fontSize: '0.8rem', color: '#4B5563' }}>
          {loading && 'Cargando alineaciones...'}
          {!loading && fromBackend && 'Datos cargados desde backend.'}
          {!loading &&
            !fromBackend &&
            'No se encontraron alineaciones en backend. Mostrando datos de respaldo.'}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '0.75rem',
          }}
        >
          <TeamField
            equipo={lineups.local.equipo}
            jugadores={lineups.local.jugadores.slice(0, FUTBOL_7_TITULARES)}
            colorJugador="#2563EB"
          />
          <TeamField
            equipo={lineups.visitante.equipo}
            jugadores={lineups.visitante.jugadores.slice(0, FUTBOL_7_TITULARES)}
            colorJugador="#0E7490"
          />
        </div>

        <ArbitroQuickActions active="alineaciones" />

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

export default AlineacionesArbitroPage
