import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import { listarTorneos, type Torneo } from '../../services/torneoService'

const TorneosPage = () => {
  const navigate = useNavigate()
  const [torneos, setTorneos] = useState<Torneo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    listarTorneos()
      .then(data => {
        setTorneos(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Error al cargar los torneos')
        setLoading(false)
      })
  }, [])

  const btnStyle = (bg: string) => ({
    backgroundColor: bg,
    color: 'white',
    borderRadius: '4px',
    padding: '0.35rem 1rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
  })

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', color: '#737373', padding: '2rem' }}>
          Cargando torneos...
        </div>
      )
    }
    if (error) {
      return <div style={{ textAlign: 'center', color: '#E53E3E', padding: '2rem' }}>{error}</div>
    }
    if (torneos.length === 0) {
      return (
        <div style={{ textAlign: 'center', color: '#737373', padding: '2rem' }}>
          No hay torneos disponibles.
        </div>
      )
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {torneos.map(torneo => (
          <div
            key={torneo.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            <div
              style={{
                width: '120px',
                height: '80px',
                backgroundColor: '#D9D9D9',
                borderRadius: '4px',
                flexShrink: 0,
              }}
            />

            <div>
              <p style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>{torneo.nombre}</p>
              <p style={{ color: '#737373', fontSize: '0.9rem', margin: '0 0 0.75rem 0' }}>
                {torneo.estado}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => navigate(`/torneos/${torneo.id}/equipos`)}
                  style={btnStyle('#11823B')}
                >
                  Equipos
                </button>
                <button
                  onClick={() => navigate(`/torneos/${torneo.id}/tabla`)}
                  style={btnStyle('#11823B')}
                >
                  Tabla
                </button>
                <button
                  onClick={() => navigate(`/torneos/${torneo.id}/goleadores`)}
                  style={btnStyle('#11823B')}
                >
                  Goleadores
                </button>
                <button
                  onClick={() => navigate(`/torneos/${torneo.id}/llaves`)}
                  style={btnStyle('#000000')}
                >
                  Llaves
                </button>
                <button
                  onClick={() => navigate(`/torneos/${torneo.id}/estadisticas`)}
                  style={btnStyle('#000000')}
                >
                  Estadísticas
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Torneos"
        subtitle="Explora todos los torneos disponibles y encuentra el perfecto para tu equipo"
      />

      <div style={{ backgroundColor: '#D9D9D9', padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h2 style={{ color: '#11823B', fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>
            TORNEOS DISPONIBLES
          </h2>
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

        {renderContent()}
      </div>
    </div>
  )
}

export default TorneosPage
