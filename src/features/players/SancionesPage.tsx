import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import { obtenerSanciones, type Sancion } from '../../services/jugadorService'
import useAuthStore from '../../store/authStore'

interface TipoSancion {
  label: string
  consecuencia: string
}

const tiposSancion: TipoSancion[] = [
  { label: 'Agresion verbal', consecuencia: 'consecuencia: tarjeta amarilla o roja' },
  { label: 'Agresion fisica', consecuencia: 'consecuencia: tarjeta roja directa' },
]

interface SeccionReglamento {
  titulo: string
  parrafos: string[]
}

const reglamento: SeccionReglamento[] = [
  {
    titulo: '4.1 Tarjeta Amarilla:',
    parrafos: [
      'Se amonestará con tarjeta amarilla las faltas de juego brusco, protestas excesivas, retardar el juego, o conducta antideportiva.',
      'La acumulación de 3 tarjetas amarillas en diferentes partidos resultará en suspensión automática de 1 partido.',
      'Dos tarjetas amarillas en el mismo partido equivalen a una tarjeta roja.',
    ],
  },
  {
    titulo: '4.2 Tarjeta Roja:',
    parrafos: [
      'Se expulsará con tarjeta roja por juego violento, agresión verbal o física, o conducta gravemente antideportiva.',
      'El jugador expulsado no podrá ser sustituido y deberá abandonar el área de juego.',
      'Una tarjeta roja directa implica suspensión mínima de 2 partidos.',
    ],
  },
  {
    titulo: '4.3 Suspensiones:',
    parrafos: [
      'Las suspensiones son acumulativas durante todo el torneo.',
      'El Comité Organizador puede imponer sanciones adicionales según la gravedad de la falta.',
      'Las agresiones físicas serán sancionadas con expulsión definitiva del torneo.',
    ],
  },
]

const SancionesPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const [sanciones, setSanciones] = useState<Sancion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSanciones = useCallback(() => {
    setLoading(true)
    setError('')
    obtenerSanciones(user?.correo ?? '')
      .then(data => {
        setSanciones(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Error al cargar sanciones')
        setLoading(false)
      })
  }, [user?.correo])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSanciones()
  }, [fetchSanciones])

  const renderEstadoSanciones = () => {
    if (loading) {
      return (
        <p style={{ fontSize: '0.85rem', color: '#737373', margin: 0 }}>Cargando sanciones...</p>
      )
    }
    if (error) {
      return <p style={{ fontSize: '0.85rem', color: '#E53E3E', margin: 0 }}>{error}</p>
    }
    if (sanciones.length === 0) {
      return (
        <p style={{ fontSize: '0.85rem', color: '#737373', margin: 0 }}>
          No tienes sanciones registradas.
        </p>
      )
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {sanciones.map(sancion => (
          <div key={sancion.id}>
            <p style={{ fontWeight: 'bold', fontSize: '0.85rem', margin: '0 0 0.2rem 0' }}>
              {sancion.tipoSancion}
            </p>
            <p style={{ fontSize: '0.8rem', color: '#737373', margin: 0 }}>{sancion.descripcion}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Sanciones" subtitle="consulta tus sanciones" />

      <div style={{ backgroundColor: '#D9D9D9', padding: '1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* COLUMNA IZQUIERDA */}
          <div>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '1.5rem' }}>
              <p
                style={{
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  color: '#000000',
                  margin: '0 0 1rem 0',
                }}
              >
                ⊕ Tipo de sanciones
              </p>

              {tiposSancion.map(tipo => (
                <div key={tipo.label}>
                  <p style={{ fontWeight: 'bold', fontSize: '0.85rem', margin: '0 0 0.25rem 0' }}>
                    {tipo.label}
                  </p>
                  <input
                    disabled
                    value={tipo.consecuencia}
                    style={{
                      backgroundColor: '#f5f5f5',
                      border: '1px solid #D9D9D9',
                      borderRadius: '4px',
                      padding: '0.4rem 0.75rem',
                      width: '100%',
                      boxSizing: 'border-box',
                      fontSize: '0.85rem',
                      marginBottom: '1rem',
                    }}
                  />
                </div>
              ))}
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: '1.5rem',
                marginTop: '1rem',
              }}
            >
              <p style={{ fontWeight: 'bold', fontSize: '0.95rem', margin: '0 0 0.75rem 0' }}>
                ⚠ Sanciones
              </p>

              {reglamento.map(seccion => (
                <div key={seccion.titulo}>
                  <p style={{ fontWeight: 'bold', fontSize: '0.85rem', margin: '0 0 0.25rem 0' }}>
                    {seccion.titulo}
                  </p>
                  {seccion.parrafos.map((texto, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: '0.8rem',
                        color: '#444444',
                        marginBottom: '0.5rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {texto}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button
                onClick={fetchSanciones}
                style={{
                  backgroundColor: '#11823B',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.5rem 1.25rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                consultar sanciones
              </button>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '1.5rem' }}>
              <p style={{ fontWeight: 'bold', fontSize: '0.85rem', margin: '0 0 0.75rem 0' }}>
                ESTADO SANCIONES:
              </p>
              {renderEstadoSanciones()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: '#737373',
              color: '#ffffff',
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
  )
}

export default SancionesPage
