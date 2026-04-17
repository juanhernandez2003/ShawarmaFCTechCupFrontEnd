import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'

interface StatCard {
  emoji: string
  value: string
  label: string
  valueColor?: string
  borderColor: string
}

const statCards: StatCard[] = [
  { emoji: '👥', value: '--', label: 'Jugadores en Equipo', borderColor: '#11823B' },
  { emoji: '✉️', value: '--', label: 'Invitaciones Pendientes', borderColor: '#FFA500' },
  { emoji: '📅', value: '--', label: 'Próximo Partido', borderColor: '#2196F3' },
  {
    emoji: '💳',
    value: 'Pendiente',
    label: 'Estado de Pago',
    valueColor: '#E53E3E',
    borderColor: '#E53E3E',
  },
]

interface AccionRapida {
  label: string
  ruta: string
}

const accionesRapidas: AccionRapida[] = [
  { label: '🏃 Gestionar Equipo', ruta: '/capitan/equipos' },
  { label: '🔍 Buscar Jugadores', ruta: '/capitan/jugadores' },
  { label: '📋 Ver Alineación', ruta: '/capitan/alineacion' },
  { label: '💳 Subir Pago', ruta: '/capitan/pagos' },
  { label: '⚽ Crear equipo', ruta: '/capitan/equipos/registro' },
  { label: '👁 Ver Alineación Rival', ruta: '/capitan/alineacion-rival' },
]

const CapitanDashboardPage = () => {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader title="Panel de Control" subtitle="Capitán" />

      <div style={{ backgroundColor: '#D9D9D9', padding: '1.5rem' }}>
        {/* SECCIÓN 1 — STAT CARDS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
          }}
        >
          {statCards.map(card => (
            <div
              key={card.label}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderLeft: `4px solid ${card.borderColor}`,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: card.valueColor ?? '#11823B',
                    margin: '0 0 0.25rem 0',
                  }}
                >
                  {card.value}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#737373', margin: 0 }}>{card.label}</p>
              </div>
              <span style={{ fontSize: '2rem' }}>{card.emoji}</span>
            </div>
          ))}
        </div>

        {/* SECCIÓN 2 — MI EQUIPO + INVITACIONES */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem',
          }}
        >
          {/* Card Mi Equipo */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ fontWeight: 'bold', fontSize: '0.95rem', margin: '0 0 1rem 0' }}>
              Mi Equipo
            </p>

            {/* Escudo + nombre */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#D9D9D9',
                  flexShrink: 0,
                }}
              />
              <div>
                <p style={{ fontWeight: 'bold', margin: 0 }}>--</p>
              </div>
            </div>

            {/* Stats PG / PE / PP */}
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              {[
                { valor: '--', label: 'Partidos Ganados' },
                { valor: '--', label: 'Partidos Empatados' },
                { valor: '--', label: 'Partidos Perdidos' },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center' }}>
                  <p
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#11823B',
                      margin: '0 0 0.25rem 0',
                    }}
                  >
                    {item.valor}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#737373', margin: 0 }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card Invitaciones Enviadas */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ fontWeight: 'bold', fontSize: '0.95rem', margin: '0 0 1rem 0' }}>
              Invitaciones Enviadas
            </p>
            <p style={{ fontSize: '0.85rem', color: '#737373', margin: 0 }}>
              No hay invitaciones enviadas.
            </p>
          </div>
        </div>

        {/* SECCIÓN 3 — ACCIONES RÁPIDAS */}
        <p
          style={{
            color: '#11823B',
            fontWeight: 'bold',
            fontSize: '1rem',
            marginTop: '1.5rem',
            marginBottom: '1rem',
          }}
        >
          Acciones Rápidas
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {accionesRapidas.map(accion => (
            <button
              key={accion.label}
              onClick={() => navigate(accion.ruta)}
              style={{
                backgroundColor: '#11823B',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.6rem 1rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%',
              }}
            >
              {accion.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CapitanDashboardPage
