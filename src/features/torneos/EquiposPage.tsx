import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'

interface Equipo {
  id: string
  nombre: string
  puntos: number
  victorias: number
  partidos: number
}

const equipos: Equipo[] = [
  { id: '1', nombre: 'Los Halcones', puntos: 21, victorias: 7, partidos: 9 },
  { id: '2', nombre: 'Tigres FC', puntos: 18, victorias: 6, partidos: 9 },
  { id: '3', nombre: 'Dragones', puntos: 15, victorias: 5, partidos: 9 },
  { id: '4', nombre: 'Panteras', puntos: 15, victorias: 5, partidos: 9 },
  { id: '5', nombre: 'Leones', puntos: 12, victorias: 4, partidos: 9 },
  { id: '6', nombre: 'Cóndores', puntos: 12, victorias: 4, partidos: 9 },
  { id: '7', nombre: 'Búhos', puntos: 9, victorias: 3, partidos: 9 },
  { id: '8', nombre: 'Lobos', puntos: 9, victorias: 3, partidos: 9 },
  { id: '9', nombre: 'Jaguares', puntos: 6, victorias: 2, partidos: 9 },
  { id: '10', nombre: 'Osos', puntos: 6, victorias: 2, partidos: 9 },
  { id: '11', nombre: 'Águilas', puntos: 3, victorias: 1, partidos: 9 },
  { id: '12', nombre: 'Zorros', puntos: 0, victorias: 0, partidos: 9 },
]

const EquiposPage = () => {
  const navigate = useNavigate()
  const { id: torneoId } = useParams<{ id: string }>()

  return (
    <div>
      <PageHeader
        title="Equipos"
        subtitle="Conoce a todos los equipos participantes y sus estadísticas"
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
            EQUIPOS:
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
          }}
        >
          {equipos.map(equipo => (
            <div
              key={equipo.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '50%',
                }}
              />

              <p style={{ fontWeight: 'bold', fontSize: '0.95rem', margin: 0 }}>{equipo.nombre}</p>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#11823B', margin: 0 }}>{equipo.puntos}</p>
                  <p style={{ fontSize: '0.75rem', color: '#737373', margin: 0 }}>Puntos</p>
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#11823B', margin: 0 }}>
                    {equipo.victorias}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#737373', margin: 0 }}>Victorias</p>
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#11823B', margin: 0 }}>
                    {equipo.partidos}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#737373', margin: 0 }}>Partidos</p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/torneos/${torneoId}/equipos/${equipo.id}`)}
                style={{
                  backgroundColor: '#11823B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.35rem 1rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Ver detalles →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EquiposPage
