import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'

interface FilaTabla {
  id: string
  nombre: string
  pj: number
  g: number
  e: number
  p: number
  gf: number
  gc: number
  dg: number
  puntos: number
}

const tabla: FilaTabla[] = [
  { id: '1', nombre: 'Los Halcones', pj: 9, g: 7, e: 0, p: 2, gf: 22, gc: 10, dg: 12, puntos: 21 },
  { id: '2', nombre: 'Tigres FC', pj: 9, g: 6, e: 0, p: 3, gf: 18, gc: 12, dg: 6, puntos: 18 },
  { id: '3', nombre: 'Dragones', pj: 9, g: 5, e: 0, p: 4, gf: 15, gc: 13, dg: 2, puntos: 15 },
  { id: '4', nombre: 'Panteras', pj: 9, g: 5, e: 0, p: 4, gf: 14, gc: 14, dg: 0, puntos: 15 },
  { id: '5', nombre: 'Leones', pj: 9, g: 4, e: 0, p: 5, gf: 13, gc: 15, dg: -2, puntos: 12 },
  { id: '6', nombre: 'Cóndores', pj: 9, g: 4, e: 0, p: 5, gf: 12, gc: 16, dg: -4, puntos: 12 },
  { id: '7', nombre: 'Búhos', pj: 9, g: 3, e: 0, p: 6, gf: 11, gc: 17, dg: -6, puntos: 9 },
  { id: '8', nombre: 'Lobos', pj: 9, g: 3, e: 0, p: 6, gf: 10, gc: 18, dg: -8, puntos: 9 },
  { id: '9', nombre: 'Jaguares', pj: 9, g: 2, e: 0, p: 7, gf: 9, gc: 19, dg: -10, puntos: 6 },
  { id: '10', nombre: 'Osos', pj: 9, g: 1, e: 0, p: 8, gf: 7, gc: 20, dg: -13, puntos: 3 },
]

const TablaPage = () => {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader title="TABLA" subtitle="Conoce las posiciones con sus respectivas estadísticas" />

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
            style={{
              backgroundColor: '#11823B',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.35rem 1rem',
              cursor: 'pointer',
            }}
          >
            Llaves
          </button>
        </div>

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
              {['Posición', 'Equipo', 'PJ', 'G', 'E', 'P', 'GF', 'GC', 'DG', 'PUNTOS'].map(col => (
                <th
                  key={col}
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
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tabla.map((fila, index) => {
              const posicion = index + 1
              const esTop3 = posicion <= 3
              return (
                <tr key={fila.id}>
                  <td
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #D9D9D9',
                      fontSize: '0.85rem',
                      textAlign: 'center',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: esTop3 ? '#11823B' : '#D9D9D9',
                        color: esTop3 ? 'white' : '#000000',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {posicion}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #D9D9D9',
                      fontSize: '0.85rem',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#D9D9D9',
                          borderRadius: '50%',
                          flexShrink: 0,
                        }}
                      />
                      {fila.nombre}
                    </div>
                  </td>
                  {[fila.pj, fila.g, fila.e, fila.p, fila.gf, fila.gc, fila.dg, fila.puntos].map(
                    (val, i) => (
                      <td
                        key={i}
                        style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid #D9D9D9',
                          fontSize: '0.85rem',
                          textAlign: 'center',
                        }}
                      >
                        {val}
                      </td>
                    )
                  )}
                </tr>
              )
            })}
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

export default TablaPage
