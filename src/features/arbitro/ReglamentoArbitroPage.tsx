import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import ArbitroQuickActions from './ArbitroQuickActions'
import { reglamento } from './arbitroData'

const ReglamentoArbitroPage = () => {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader title="Consultar Reglamento" subtitle="Normas del torneo para arbitraje" />

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {reglamento.map(regla => (
            <article
              key={regla.titulo}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '1rem',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              }}
            >
              <h2 style={{ margin: 0, fontSize: '1rem', color: '#111827' }}>{regla.titulo}</h2>
              <p style={{ margin: '0.45rem 0 0', fontSize: '0.9rem', color: '#374151' }}>
                {regla.descripcion}
              </p>
              {regla.detalles && regla.detalles.length > 0 && (
                <ul style={{ margin: '0.55rem 0 0', paddingLeft: '1.2rem', color: '#374151' }}>
                  {regla.detalles.map(detalle => (
                    <li
                      key={`${regla.titulo}-${detalle}`}
                      style={{ marginBottom: '0.3rem', fontSize: '0.88rem' }}
                    >
                      {detalle}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        <ArbitroQuickActions active="reglamento" />

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

export default ReglamentoArbitroPage
