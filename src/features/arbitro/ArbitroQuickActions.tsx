import { useNavigate } from 'react-router-dom'

type ActionId = 'alineaciones' | 'reglamento' | 'tabla'

interface ArbitroQuickActionsProps {
  active?: ActionId
}

const actions: Array<{ id: ActionId; label: string; to: string }> = [
  { id: 'alineaciones', label: 'Ver Alineaciones', to: '/arbitro/alineaciones' },
  { id: 'reglamento', label: 'Consultar Reglamento', to: '/arbitro/reglamento' },
  { id: 'tabla', label: 'Ver Tabla de Posiciones', to: '/arbitro/tabla' },
]

const ArbitroQuickActions = ({ active }: ArbitroQuickActionsProps) => {
  const navigate = useNavigate()

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.6rem',
        marginTop: '1.2rem',
        flexWrap: 'wrap',
      }}
    >
      {actions.map(action => (
        <button
          key={action.id}
          onClick={() => navigate(action.to)}
          style={{
            backgroundColor: active === action.id ? '#0E6E32' : '#11823B',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            padding: '0.45rem 0.8rem',
            fontSize: '0.76rem',
            fontWeight: 600,
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}

export default ArbitroQuickActions
