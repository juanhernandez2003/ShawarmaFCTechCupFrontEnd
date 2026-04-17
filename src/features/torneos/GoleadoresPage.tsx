import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'

interface Goleador {
  id: string
  nombre: string
  equipo: string
  goles: number
}

const goleadores: Goleador[] = [
  { id: '1', nombre: 'Carlos Ramírez', equipo: 'Los Halcones', goles: 12 },
  { id: '2', nombre: 'Andrés Mora', equipo: 'Tigres FC', goles: 10 },
  { id: '3', nombre: 'Felipe Torres', equipo: 'Dragones', goles: 9 },
  { id: '4', nombre: 'Juan Pérez', equipo: 'Panteras', goles: 8 },
  { id: '5', nombre: 'Sebastián Ríos', equipo: 'Leones', goles: 7 },
  { id: '6', nombre: 'Diego Vargas', equipo: 'Los Halcones', goles: 6 },
  { id: '7', nombre: 'Mateo Gómez', equipo: 'Cóndores', goles: 6 },
  { id: '8', nombre: 'Luis Herrera', equipo: 'Búhos', goles: 5 },
  { id: '9', nombre: 'Camilo Castro', equipo: 'Tigres FC', goles: 4 },
  { id: '10', nombre: 'Nicolás Ruiz', equipo: 'Dragones', goles: 3 },
]

const GoleadoresPage = () => {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader title="GOLEADORES" subtitle="Conoce los jugadores con más goles" />

      <div style={{ backgroundColor: '#D9D9D9', padding: '2rem' }}>
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
              <tr key={goleador.id}>
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
                  {goleador.equipo}
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
