import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import { obtenerTabla, type PosicionTabla } from '../../services/torneoService'

const TablaPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [tabla, setTabla] = useState<PosicionTabla[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerTabla(id!)
      .then(data => {
        setTabla(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Error al cargar la tabla')
        setLoading(false)
      })
  }, [id])

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', color: '#737373', padding: '2rem' }}>
          Cargando tabla...
        </div>
      )
    }
    if (error) {
      return <div style={{ textAlign: 'center', color: '#E53E3E', padding: '2rem' }}>{error}</div>
    }
    if (tabla.length === 0) {
      return (
        <div style={{ textAlign: 'center', color: '#737373', padding: '2rem' }}>
          No hay datos disponibles.
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
            {['Posición', 'Equipo', 'PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DG', 'PTS'].map(col => (
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
              <tr key={index}>
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
                    {fila.equipo}
                  </div>
                </td>
                {[fila.pj, fila.pg, fila.pe, fila.pp, fila.gf, fila.gc, fila.dg, fila.pts].map(
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
    )
  }

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

export default TablaPage
