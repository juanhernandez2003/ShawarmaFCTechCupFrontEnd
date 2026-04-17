import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { obtenerEquipo, Equipo } from '../../services/teamService'

const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [equipo, setEquipo] = useState<Equipo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    obtenerEquipo(id)
      .then(data => setEquipo(data))
      .catch(() => setError('Equipo no encontrado'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading)
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#737373' }}>
        Cargando equipo...
      </div>
    )

  if (error || !equipo)
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>
        {error || 'Equipo no encontrado'}
      </div>
    )

  const totalJugadores = equipo.jugadores.length
  const porcentaje = Math.min((totalJugadores / 12) * 100, 100)

  return (
    <div>
      {/* Banner */}
      <div style={{ backgroundColor: '#11823B', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
          Mi Equipo
        </h1>
        <p style={{ color: '#ffffff', margin: '0.5rem 0 0' }}>Revisa y administra tu equipo</p>
      </div>

      {/* Contenido */}
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          padding: '2rem',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* Panel izquierdo */}
        <div
          style={{
            flex: '0 0 240px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '1.5rem',
          }}
        >
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '1rem' }}>Información del Equipo</h3>

          {/* Escudo */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                backgroundColor: '#D9D9D9',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
              }}
            >
              ⚽
            </div>
          </div>

          {/* Nombre */}
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                fontSize: '0.8rem',
                color: '#737373',
                display: 'block',
                marginBottom: '0.25rem',
              }}
            >
              Nombre del Equipo
            </label>
            <input
              type="text"
              value={equipo.nombre}
              readOnly
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.5rem',
                border: '1px solid #D9D9D9',
                borderRadius: '4px',
                fontSize: '0.85rem',
                backgroundColor: '#f9f9f9',
              }}
            />
          </div>

          {/* Colores */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                fontSize: '0.8rem',
                color: '#737373',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Colores del Uniforme
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.75rem', margin: '0 0 0.25rem', color: '#737373' }}>
                  Principal
                </p>
                <input
                  type="text"
                  value={equipo.colorPrincipal || '-'}
                  readOnly
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0.4rem',
                    border: '1px solid #D9D9D9',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.75rem', margin: '0 0 0.25rem', color: '#737373' }}>
                  Secundario
                </p>
                <input
                  type="text"
                  value={equipo.colorSecundario || '-'}
                  readOnly
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0.4rem',
                    border: '1px solid #D9D9D9',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Barra jugadores */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}
            >
              <span style={{ fontSize: '0.8rem', color: '#737373' }}>Jugadores:</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{totalJugadores}/12</span>
            </div>
            <div style={{ backgroundColor: '#D9D9D9', borderRadius: '4px', height: '8px' }}>
              <div
                style={{
                  backgroundColor: '#11823B',
                  height: '8px',
                  borderRadius: '4px',
                  width: `${porcentaje}%`,
                  transition: 'width 0.3s',
                }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#737373', margin: '0.25rem 0 0' }}>
              Mínimo 7, máximo 12 jugadores
            </p>
          </div>

          <button
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#11823B',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              marginBottom: '0.5rem',
            }}
          >
            💾 Guardar Cambios
          </button>

          <button
            onClick={() => navigate('/equipos')}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#737373',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Volver
          </button>
        </div>

        {/* Panel derecho - Jugadores */}
        <div
          style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '8px', padding: '1.5rem' }}
        >
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Jugadores Actuales</h3>

          {equipo.jugadores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#737373' }}>
              <p>No hay jugadores en este equipo aún</p>
            </div>
          ) : (
            <div>
              {equipo.jugadores.map((jugadorId, index) => (
                <div
                  key={jugadorId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    borderBottom: '1px solid #D9D9D9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#11823B',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          color: '#000000',
                        }}
                      >
                        {jugadorId.split('|')[0]}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#11823B' }}>
                        ⚽ {jugadorId.split('|')[1]}
                      </p>
                    </div>
                  </div>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '1rem',
                    }}
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: 'transparent',
              color: '#11823B',
              border: '1px dashed #11823B',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            + Agregar Jugador
          </button>
        </div>
      </div>
    </div>
  )
}

export default TeamDetailPage
