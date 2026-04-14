import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'

interface Partido {
  equipo1: string
  equipo2: string
  ganador?: string
}

interface Bracket {
  cuartosIzq: Partido[]
  semifinalIzq: Partido
  semifinalDer: Partido
  cuartosDer: Partido[]
  final: Partido
}

const bracket: Bracket = {
  cuartosIzq: [
    { equipo1: 'FC Dynamo', equipo2: 'United FC', ganador: 'FC Dynamo' },
    { equipo1: 'Silver Stars', equipo2: 'Red Dragons', ganador: 'Red Dragons' },
  ],
  semifinalIzq: { equipo1: 'FC Dynamo', equipo2: 'Red Dragons', ganador: 'FC Dynamo' },
  semifinalDer: {
    equipo1: 'Forest Rangers',
    equipo2: 'Desert Scorpions',
    ganador: 'Forest Rangers',
  },
  cuartosDer: [
    { equipo1: 'Green Giants', equipo2: 'Forest Rangers', ganador: 'Forest Rangers' },
    { equipo1: 'Sporting Lions', equipo2: 'Desert Scorpions', ganador: 'Desert Scorpions' },
  ],
  final: { equipo1: 'FC Dynamo', equipo2: 'Forest Rangers' },
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

const LlavesPage = () => {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="LLAVES"
        subtitle="Consulta los enfrentamientos de las fases eliminatorias"
      />

      {/* Contenedor principal con fondo de cancha */}
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

        {/* Bracket */}
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
          {/* Headers de rondas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 'bold',
                color: '#11823B',
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'italic',
              }}
            >
              Cuartos de Final
            </span>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 'bold',
                color: '#11823B',
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'italic',
              }}
            >
              Semifinal
            </span>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 'bold',
                color: '#11823B',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'italic',
              }}
            >
              Final
            </span>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 'bold',
                color: '#11823B',
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'italic',
              }}
            >
              Semifinal
            </span>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 'bold',
                color: '#11823B',
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'italic',
              }}
            >
              Cuartos de Final
            </span>
          </div>

          {/* Bracket principal */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
              alignItems: 'center',
              gap: '0',
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
              {bracket.cuartosIzq.map((partido, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <EquipoBox
                    nombre={partido.equipo1}
                    esGanador={partido.ganador === partido.equipo1}
                  />
                  <EquipoBox
                    nombre={partido.equipo2}
                    esGanador={partido.ganador === partido.equipo2}
                  />
                </div>
              ))}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <EquipoBox
                  nombre={bracket.semifinalIzq.equipo1}
                  esGanador={bracket.semifinalIzq.ganador === bracket.semifinalIzq.equipo1}
                />
                <EquipoBox
                  nombre={bracket.semifinalIzq.equipo2}
                  esGanador={bracket.semifinalIzq.ganador === bracket.semifinalIzq.equipo2}
                />
              </div>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                <EquipoBox
                  nombre={bracket.final.equipo1}
                  esGanador={bracket.final.ganador === bracket.final.equipo1}
                />
                <EquipoBox
                  nombre={bracket.final.equipo2}
                  esGanador={bracket.final.ganador === bracket.final.equipo2}
                />
              </div>
              {/* Trofeo */}
              <div style={{ fontSize: '2rem', textAlign: 'center' }}>🏆</div>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <EquipoBox
                  nombre={bracket.semifinalDer.equipo1}
                  esGanador={bracket.semifinalDer.ganador === bracket.semifinalDer.equipo1}
                />
                <EquipoBox
                  nombre={bracket.semifinalDer.equipo2}
                  esGanador={bracket.semifinalDer.ganador === bracket.semifinalDer.equipo2}
                />
              </div>
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
              {bracket.cuartosDer.map((partido, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <EquipoBox
                    nombre={partido.equipo1}
                    esGanador={partido.ganador === partido.equipo1}
                  />
                  <EquipoBox
                    nombre={partido.equipo2}
                    esGanador={partido.ganador === partido.equipo2}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

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
