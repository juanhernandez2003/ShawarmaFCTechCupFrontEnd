import { type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'

const matchCardStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  padding: '0.75rem',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  minHeight: '84px',
}

const LlavesArbitroPage = () => {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader title="Flujo a Llaves" subtitle="Cruces de semifinal y final" />

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '1rem' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.85rem',
              alignItems: 'center',
            }}
          >
            <div>
              <h2 style={{ margin: '0 0 0.6rem', fontSize: '0.95rem' }}>Semifinales</h2>
              <div style={{ display: 'grid', gap: '0.55rem' }}>
                <div style={matchCardStyle}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>
                    Blue Waves vs Ingenieria FC
                  </p>
                  <p style={{ margin: '0.35rem 0 0', color: '#6B7280', fontSize: '0.78rem' }}>
                    18 Mar - Cancha A
                  </p>
                </div>
                <div style={matchCardStyle}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>
                    United FC vs Golden Eagles
                  </p>
                  <p style={{ margin: '0.35rem 0 0', color: '#6B7280', fontSize: '0.78rem' }}>
                    19 Mar - Cancha B
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{ textAlign: 'center', fontSize: '1.4rem', color: '#6B7280', fontWeight: 700 }}
            >
              -&gt;
            </div>

            <div>
              <h2 style={{ margin: '0 0 0.6rem', fontSize: '0.95rem' }}>Final</h2>
              <div style={matchCardStyle}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>
                  Ganador SF1 vs Ganador SF2
                </p>
                <p style={{ margin: '0.35rem 0 0', color: '#6B7280', fontSize: '0.78rem' }}>
                  23 Mar - Cancha Principal
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            onClick={() => navigate('/arbitro/tabla')}
            style={{
              backgroundColor: '#11823B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '0.45rem 0.9rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Volver a tabla de posiciones
          </button>
        </div>
      </div>
    </div>
  )
}

export default LlavesArbitroPage
