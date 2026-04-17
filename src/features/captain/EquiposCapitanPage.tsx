import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerEquipoDelCapitan, type Equipo } from '../../services/teamService'
import useAuthStore from '../../store/authStore'

const EquiposCapitanPage = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)

  useEffect(() => {
    obtenerEquipoDelCapitan(user?.correo ?? '')
      .then(equipo => {
        if (equipo) setEquipos([equipo])
      })
      .catch(() => setError('Error al cargar el equipo'))
      .finally(() => setLoading(false))
  }, [user?.correo])

  if (loading)
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#737373' }}>
        Cargando equipo...
      </div>
    )

  if (error)
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>{error}</div>

  return (
    <div>
      {/* Banner */}
      <div style={{ backgroundColor: '#11823B', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
          Equipos
        </h1>
        <p style={{ color: '#ffffff', margin: '0.5rem 0 0' }}>
          Conoce a todos los equipos participantes y sus estadísticas
        </p>
      </div>

      {/* Contenido */}
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h3
          style={{
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            color: '#737373',
            textTransform: 'uppercase',
          }}
        >
          EQUIPOS
        </h3>

        {equipos.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#737373',
            }}
          >
            No tienes ningún equipo registrado.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {equipos.map(equipo => (
              <div
                key={equipo.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                {/* Escudo */}
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    backgroundColor: '#D9D9D9',
                    margin: '0 auto 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                  }}
                >
                  ⚽
                </div>

                <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 'bold' }}>
                  {equipo.nombre}
                </h4>

                {/* Stats */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>0</div>
                    <div style={{ fontSize: '0.7rem', color: '#737373' }}>Puntos</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>0</div>
                    <div style={{ fontSize: '0.7rem', color: '#737373' }}>Victorias</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      {equipo.jugadores.length}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#737373' }}>Jugadores</div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/capitan/equipos/${equipo.id}`)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#11823B',
                    border: '1px solid #11823B',
                    borderRadius: '4px',
                    padding: '0.4rem 1rem',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  Ver detalles →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EquiposCapitanPage
