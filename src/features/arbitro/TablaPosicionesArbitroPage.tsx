import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import ArbitroQuickActions from './ArbitroQuickActions'
import { tablaPosiciones } from './arbitroData'

const TablaPosicionesArbitroPage = () => {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader title="Tabla de Posiciones" subtitle="Posiciones actualizadas del torneo" />

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '1rem' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            overflowX: 'auto',
          }}
        >
          <div
            style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}
          >
            <h2 style={{ margin: 0, fontSize: '1rem', color: '#111827' }}>Clasificacion general</h2>
            <button
              onClick={() => navigate('/arbitro/tabla/llaves')}
              style={{
                backgroundColor: '#11823B',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '0.45rem 0.8rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Ver flujo a llaves
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '820px' }}>
            <thead>
              <tr>
                {['Pos', 'Equipo', 'PJ', 'G', 'E', 'P', 'GF', 'GC', 'DG', 'Pts'].map(col => (
                  <th
                    key={col}
                    style={{
                      textAlign: col === 'Equipo' ? 'left' : 'center',
                      padding: '0.55rem',
                      borderBottom: '1px solid #E5E7EB',
                      fontSize: '0.78rem',
                      color: '#374151',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tablaPosiciones.map((fila, index) => {
                const posicion = index + 1
                const clasificaLlaves = posicion <= 4
                return (
                  <tr
                    key={fila.id}
                    style={{ backgroundColor: clasificaLlaves ? '#F0FFF4' : 'transparent' }}
                  >
                    <td style={{ textAlign: 'center', padding: '0.55rem', fontSize: '0.8rem' }}>
                      {posicion}
                    </td>
                    <td style={{ padding: '0.55rem', fontSize: '0.8rem', fontWeight: 600 }}>
                      {fila.equipo}
                    </td>
                    <td style={{ textAlign: 'center', padding: '0.55rem', fontSize: '0.8rem' }}>
                      {fila.pj}
                    </td>
                    <td style={{ textAlign: 'center', padding: '0.55rem', fontSize: '0.8rem' }}>
                      {fila.g}
                    </td>
                    <td style={{ textAlign: 'center', padding: '0.55rem', fontSize: '0.8rem' }}>
                      {fila.e}
                    </td>
                    <td style={{ textAlign: 'center', padding: '0.55rem', fontSize: '0.8rem' }}>
                      {fila.p}
                    </td>
                    <td style={{ textAlign: 'center', padding: '0.55rem', fontSize: '0.8rem' }}>
                      {fila.gf}
                    </td>
                    <td style={{ textAlign: 'center', padding: '0.55rem', fontSize: '0.8rem' }}>
                      {fila.gc}
                    </td>
                    <td style={{ textAlign: 'center', padding: '0.55rem', fontSize: '0.8rem' }}>
                      {fila.dg}
                    </td>
                    <td
                      style={{
                        textAlign: 'center',
                        padding: '0.55rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#11823B',
                      }}
                    >
                      {fila.puntos}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <ArbitroQuickActions active="tabla" />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
          <button
            onClick={() => navigate('/arbitro')}
            style={{
              backgroundColor: '#737373',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.85rem',
            }}
          >
            {'<-'} Volver al panel
          </button>
        </div>
      </div>
    </div>
  )
}

export default TablaPosicionesArbitroPage
