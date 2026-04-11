import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'

interface Torneo {
  id: string
  nombre: string
  descripcion: string
}

const torneos: Torneo[] = [
  {
    id: '1',
    nombre: 'Torneo de sistemas 2026',
    descripcion:
      'Es el torneo más competitivo y tradicional de la universidad. ¿Estás preparado para ganar?',
  },
]

const TorneosPage = () => {
  const navigate = useNavigate()

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
                  {torneo.descripcion}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => navigate(`/torneos/${torneo.id}/equipos`)}
                    style={{
                      backgroundColor: '#11823B',
                      color: 'white',
                      borderRadius: '4px',
                      padding: '0.35rem 1rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    Equipos
                  </button>
                  <button
                    onClick={() => navigate(`/torneos/${torneo.id}/tabla`)}
                    style={{
                      backgroundColor: '#11823B',
                      color: 'white',
                      borderRadius: '4px',
                      padding: '0.35rem 1rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    Tabla
                  </button>
                  <button
                    style={{
                      backgroundColor: '#000000',
                      color: 'white',
                      borderRadius: '4px',
                      padding: '0.35rem 1rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    Llaves
                  </button>
                  <button
                    style={{
                      backgroundColor: '#000000',
                      color: 'white',
                      borderRadius: '4px',
                      padding: '0.35rem 1rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    Estadísticas
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TorneosPage
