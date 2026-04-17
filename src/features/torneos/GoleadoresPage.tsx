import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import { obtenerGoleadores, type Goleador } from '../../services/torneoService'

const GoleadoresPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [goleadores, setGoleadores] = useState<Goleador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerGoleadores(id!)
      .then(data => {
        setGoleadores(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Error al cargar los goleadores')
        setLoading(false)
      })
  }, [id])

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', color: '#737373', padding: '2rem' }}>
          Cargando goleadores...
        </div>
      )
    }
    if (error) {
      return <div style={{ textAlign: 'center', color: '#E53E3E', padding: '2rem' }}>{error}</div>
    }
    if (goleadores.length === 0) {
      return (
        <div style={{ textAlign: 'center', color: '#737373', padding: '2rem' }}>
          No hay goleadores disponibles.
        </div>
      )
    }
    return (
      <table
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          width: '100%',
          borderCollapse: 'collapse',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: 'white',
                color: '#000000',
                fontSize: '0.85rem',
                padding: '0.75rem 1rem',
                textAlign: 'left',
                borderBottom: '1px solid #D9D9D9',
                fontWeight: 'bold',
              }}
            >
              Jugador
            </th>
            <th
              style={{
                backgroundColor: 'white',
                color: '#000000',
                fontSize: '0.85rem',
                padding: '0.75rem 1rem',
                textAlign: 'center',
                borderBottom: '1px solid #D9D9D9',
                fontWeight: 'bold',
              }}
            >
              Equipo
            </th>
            <th
              style={{
                backgroundColor: 'white',
                color: '#000000',
                fontSize: '0.85rem',
                padding: '0.75rem 1rem',
                textAlign: 'center',
                borderBottom: '1px solid #D9D9D9',
                fontWeight: 'bold',
              }}
            >
              Goles
            </th>
          </tr>
        </thead>
        <tbody>
          {goleadores.map(goleador => (
            <tr key={goleador.jugadorId}>
              <td
                style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #D9D9D9',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: '#D9D9D9',
                      borderRadius: '50%',
                      flexShrink: 0,
                    }}
                  />
                  {goleador.nombre}
                </div>
              </td>
              <td
                style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #D9D9D9',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                }}
              >
                --
              </td>
              <td
                style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #D9D9D9',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#11823B',
                }}
              >
                {goleador.goles}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div>
      <PageHeader title="GOLEADORES" subtitle="Conoce los jugadores con más goles" />

      <div style={{ backgroundColor: '#D9D9D9', padding: '2rem' }}>
        {renderContent()}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: '#737373',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.35rem 0.75rem',
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

export default GoleadoresPage
