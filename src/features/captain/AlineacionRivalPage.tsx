import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'

interface PosicionCampo {
  bottom?: string
  top?: string
  left: string
  color: string
  label: string
}

interface JugadorRival {
  nombre: string
  posicion: string
  numero: string
}

const posicionesRival: PosicionCampo[] = [
  { bottom: '8%', left: '50%', color: '#FFA500', label: 'PO' },
  { bottom: '28%', left: '25%', color: '#2196F3', label: 'DF' },
  { bottom: '28%', left: '75%', color: '#2196F3', label: 'DF' },
  { top: '40%', left: '30%', color: '#4CAF50', label: 'MC' },
  { top: '40%', left: '70%', color: '#4CAF50', label: 'MC' },
  { top: '15%', left: '50%', color: '#E53E3E', label: 'DL' },
]

const leyenda = [
  { color: '#FFA500', label: 'Portero' },
  { color: '#2196F3', label: 'Defensa' },
  { color: '#4CAF50', label: 'Mediocampista' },
  { color: '#E53E3E', label: 'Delantero' },
]

const jugadoresRival: JugadorRival[] = [
  { nombre: '--', posicion: '--', numero: '--' },
  { nombre: '--', posicion: '--', numero: '--' },
  { nombre: '--', posicion: '--', numero: '--' },
  { nombre: '--', posicion: '--', numero: '--' },
  { nombre: '--', posicion: '--', numero: '--' },
  { nombre: '--', posicion: '--', numero: '--' },
]

const AlineacionRivalPage = () => {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader title="Alineacion Rival" subtitle="Formacion equipo contrario" />

      <div style={{ backgroundColor: '#D9D9D9', padding: '1.5rem' }}>
        {/* Botón volver */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: '#737373',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.4rem 0.9rem',
              cursor: 'pointer',
            }}
          >
            ←
          </button>
        </div>

        {/* Layout principal */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Columna izquierda — Campo de Juego */}
          <div
            style={{
              backgroundColor: '#2d6a4f',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <p style={{ fontSize: '0.8rem', color: 'white', margin: '0 0 1rem 0' }}>
              Campo de Juego · Formación Rival --
            </p>

            {/* Campo */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '300px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '4px',
                backgroundColor: '#2d6a4f',
              }}
            >
              {/* Línea del medio */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  width: '100%',
                  height: '1px',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                }}
              />
              {/* Círculo central */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              />

              {/* Jugadores */}
              {posicionesRival.map((p, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    bottom: p.bottom,
                    top: p.top,
                    left: p.left,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: p.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    color: 'white',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {p.label}
                </div>
              ))}
            </div>

            {/* Leyenda */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              {leyenda.map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'white' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Columna derecha — Jugadores del rival */}
          <div>
            {/* Card info del equipo rival */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Equipo Rival</span>
                <span style={{ fontSize: '0.8rem', color: '#737373' }}>Formación: --</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#D9D9D9',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                  }}
                >
                  🛡️
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: '0.9rem', margin: 0 }}>--</p>
                  <p style={{ fontSize: '0.75rem', color: '#737373', margin: 0 }}>
                    Nombre del equipo
                  </p>
                </div>
              </div>
            </div>

            {/* Card lista de jugadores */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Jugadores</span>
                <span style={{ fontSize: '0.8rem', color: '#737373' }}>
                  {jugadoresRival.length} registrados
                </span>
              </div>

              {jugadoresRival.map((j, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem 0',
                    borderBottom: i < jugadoresRival.length - 1 ? '1px solid #D9D9D9' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#D9D9D9',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.85rem', margin: 0 }}>{j.nombre}</p>
                    <p style={{ fontSize: '0.75rem', color: '#737373', margin: 0 }}>{j.posicion}</p>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#737373' }}>{j.numero}</span>
                </div>
              ))}
            </div>

            {/* Card estadísticas del rival */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '1rem',
              }}
            >
              <p style={{ fontWeight: 'bold', fontSize: '0.9rem', margin: '0 0 0.75rem 0' }}>
                Estadísticas del Rival
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                  textAlign: 'center',
                }}
              >
                {[
                  { label: 'PG', value: '--' },
                  { label: 'PE', value: '--' },
                  { label: 'PP', value: '--' },
                ].map(item => (
                  <div key={item.label}>
                    <p
                      style={{
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        color: '#11823B',
                        margin: 0,
                      }}
                    >
                      {item.value}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#737373', margin: 0 }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlineacionRivalPage
