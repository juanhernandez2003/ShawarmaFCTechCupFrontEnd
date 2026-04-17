import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'

const formaciones = ['3-2-1', '3-1-2', '2-3-1', '4-1-1']

const jugadoresPlaceholder = [
  { nombre: '--', posicion: '--', numero: '--' },
  { nombre: '--', posicion: '--', numero: '--' },
  { nombre: '--', posicion: '--', numero: '--' },
  { nombre: '--', posicion: '--', numero: '--' },
  { nombre: '--', posicion: '--', numero: '--' },
]

interface PosicionJugador {
  bottom?: string
  top?: string
  left: string
  color: string
  label: string
}

const posicionesEnCampo: Record<string, PosicionJugador[]> = {
  '3-2-1': [
    { bottom: '8%', left: '50%', color: '#FFA500', label: 'PO' },
    { bottom: '28%', left: '20%', color: '#2196F3', label: 'DF' },
    { bottom: '28%', left: '50%', color: '#2196F3', label: 'DF' },
    { bottom: '28%', left: '80%', color: '#2196F3', label: 'DF' },
    { top: '40%', left: '30%', color: '#4CAF50', label: 'MC' },
    { top: '40%', left: '70%', color: '#4CAF50', label: 'MC' },
    { top: '15%', left: '50%', color: '#E53E3E', label: 'DL' },
  ],
  '3-1-2': [
    { bottom: '8%', left: '50%', color: '#FFA500', label: 'PO' },
    { bottom: '28%', left: '20%', color: '#2196F3', label: 'DF' },
    { bottom: '28%', left: '50%', color: '#2196F3', label: 'DF' },
    { bottom: '28%', left: '80%', color: '#2196F3', label: 'DF' },
    { top: '50%', left: '50%', color: '#4CAF50', label: 'MC' },
    { top: '20%', left: '30%', color: '#E53E3E', label: 'DL' },
    { top: '20%', left: '70%', color: '#E53E3E', label: 'DL' },
  ],
  '2-3-1': [
    { bottom: '8%', left: '50%', color: '#FFA500', label: 'PO' },
    { bottom: '28%', left: '30%', color: '#2196F3', label: 'DF' },
    { bottom: '28%', left: '70%', color: '#2196F3', label: 'DF' },
    { top: '45%', left: '20%', color: '#4CAF50', label: 'MC' },
    { top: '45%', left: '50%', color: '#4CAF50', label: 'MC' },
    { top: '45%', left: '80%', color: '#4CAF50', label: 'MC' },
    { top: '15%', left: '50%', color: '#E53E3E', label: 'DL' },
  ],
  '4-1-1': [
    { bottom: '8%', left: '50%', color: '#FFA500', label: 'PO' },
    { bottom: '28%', left: '15%', color: '#2196F3', label: 'DF' },
    { bottom: '28%', left: '38%', color: '#2196F3', label: 'DF' },
    { bottom: '28%', left: '62%', color: '#2196F3', label: 'DF' },
    { bottom: '28%', left: '85%', color: '#2196F3', label: 'DF' },
    { top: '45%', left: '50%', color: '#4CAF50', label: 'MC' },
    { top: '20%', left: '50%', color: '#E53E3E', label: 'DL' },
  ],
}

const leyenda = [
  { color: '#FFA500', label: 'Portero' },
  { color: '#2196F3', label: 'Defensa' },
  { color: '#4CAF50', label: 'Mediocampista' },
  { color: '#E53E3E', label: 'Delantero' },
]

const AlineacionPage = () => {
  const navigate = useNavigate()
  const [formacionActiva, setFormacionActiva] = useState('3-2-1')
  const [showPopup, setShowPopup] = useState(false)

  return (
    <>
      <div>
        <PageHeader
          title="Alineaciones"
          subtitle="Organiza tu formación antes y durante el partido"
        />

        <div style={{ backgroundColor: '#D9D9D9', padding: '1.5rem' }}>
          {/* Botones superiores */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            <button
              onClick={() => setShowPopup(true)}
              style={{
                backgroundColor: '#11823B',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              💾 Guardar Alineación
            </button>
            <button
              style={{
                backgroundColor: 'white',
                color: '#11823B',
                border: '1px solid #11823B',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              🕐 Historial
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
            {/* Columna izquierda */}
            <div>
              {/* Card Seleccionar Formación */}
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <p style={{ fontSize: '0.85rem', color: '#737373', margin: '0 0 0.75rem 0' }}>
                  Seleccionar Formación
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {formaciones.map(f => (
                    <button
                      key={f}
                      onClick={() => setFormacionActiva(f)}
                      style={
                        f === formacionActiva
                          ? {
                              backgroundColor: 'white',
                              border: '2px solid #11823B',
                              color: '#11823B',
                              borderRadius: '4px',
                              padding: '0.4rem 0.75rem',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                            }
                          : {
                              backgroundColor: '#f5f5f5',
                              border: '1px solid #D9D9D9',
                              color: '#737373',
                              borderRadius: '4px',
                              padding: '0.4rem 0.75rem',
                              cursor: 'pointer',
                            }
                      }
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Campo de Juego */}
              <div
                style={{
                  backgroundColor: '#2d6a4f',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  minHeight: '300px',
                  position: 'relative',
                }}
              >
                <p style={{ fontSize: '0.8rem', color: 'white', margin: '0 0 1rem 0' }}>
                  Campo de Juego · Formación {formacionActiva}
                </p>

                {/* Campo */}
                <div
                  style={{
                    backgroundColor: '#2d6a4f',
                    position: 'relative',
                    width: '100%',
                    height: '280px',
                    borderRadius: '4px',
                    border: '2px solid rgba(255,255,255,0.3)',
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
                  {/* Círculo del centro */}
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
                  {posicionesEnCampo[formacionActiva].map((p, i) => (
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
                <div
                  style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}
                >
                  {leyenda.map(({ color, label }) => (
                    <div
                      key={label}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
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
            </div>

            {/* Columna derecha */}
            <div>
              {/* Card Titulares */}
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
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Titulares</span>
                  <span style={{ fontSize: '0.8rem', color: '#737373' }}>5/7</span>
                </div>

                {jugadoresPlaceholder.map((j, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.5rem 0',
                      borderBottom:
                        i < jugadoresPlaceholder.length - 1 ? '1px solid #D9D9D9' : 'none',
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
                      <p style={{ fontSize: '0.75rem', color: '#737373', margin: 0 }}>
                        {j.posicion}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#737373' }}>{j.numero}</span>
                  </div>
                ))}
              </div>

              {/* Card Suplentes */}
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
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Suplentes</span>
                  <span style={{ fontSize: '0.8rem', color: '#737373' }}>0 disponibles</span>
                </div>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: '#737373',
                    textAlign: 'center',
                    padding: '1rem',
                    margin: 0,
                  }}
                >
                  No hay suplentes disponibles.
                </p>
              </div>
            </div>
          </div>

          {/* Botón volver */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1.5rem' }}>
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
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <>
          <div
            onClick={() => setShowPopup(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 999,
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '1.5rem 2rem',
              textAlign: 'center',
              zIndex: 1000,
              minWidth: '260px',
            }}
          >
            <div style={{ fontSize: '2rem' }}>✅</div>
            <p
              style={{
                fontWeight: 'bold',
                fontSize: '0.95rem',
                marginTop: '0.5rem',
                margin: '0.5rem 0 0 0',
              }}
            >
              Alineación guardada correctamente
            </p>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                backgroundColor: '#11823B',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem 1.5rem',
                marginTop: '1rem',
                cursor: 'pointer',
              }}
            >
              Cerrar
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default AlineacionPage
