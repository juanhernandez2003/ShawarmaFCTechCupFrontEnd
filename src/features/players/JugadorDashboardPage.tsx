import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'

interface StatCard {
  emoji: string
  value: string
  label: string
}

const statCards: StatCard[] = [
  { emoji: '⚽', value: '--', label: 'Partidos jugados' },
  { emoji: '🎯', value: '--', label: 'Goles' },
  { emoji: '🤝', value: '--', label: 'Asistencias' },
  { emoji: '🟨', value: '--', label: 'Sanciones' },
]

const JugadorDashboardPage = () => {
  const navigate = useNavigate()
  const [disponible, setDisponible] = useState<boolean>(true)

  return (
    <div>
      <PageHeader title="Panel de Control" subtitle="Jugador" />

      <div style={{ backgroundColor: '#D9D9D9', padding: '1.5rem' }}>
        {/* SECCIÓN 1 — INFORMACIÓN DEL JUGADOR */}
        <p
          style={{
            fontWeight: 'bold',
            fontSize: '1.1rem',
            textAlign: 'center',
            marginBottom: '1rem',
            margin: '0 0 1rem 0',
          }}
        >
          INFORMACION DEL JUGADOR
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
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
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span style={{ fontSize: '2rem' }}>{card.emoji}</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#11823B' }}>
                {card.value}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#737373' }}>{card.label}</span>
            </div>
          ))}
        </div>

        {/* SECCIÓN 2 — FILA DE 3 CARDS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem',
          }}
        >
          {/* Card Mi equipo */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '1rem' }}>
            <p style={{ fontWeight: 'bold', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
              Mi equipo
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span style={{ fontSize: '2rem' }}>🛡️</span>
              <span style={{ fontWeight: 'bold' }}>--</span>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                {[
                  { stat: '--', label: 'PG' },
                  { stat: '--', label: 'PE' },
                  { stat: '--', label: 'PP' },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold', color: '#11823B', margin: 0 }}>{item.stat}</p>
                    <p style={{ fontSize: '0.75rem', color: '#737373', margin: 0 }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card Invitaciones */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '1rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
              }}
            >
              <p style={{ fontWeight: 'bold', fontSize: '0.9rem', margin: 0 }}>Invitaciones</p>
              <span>👥</span>
            </div>

            <p
              style={{
                fontSize: '0.85rem',
                color: '#737373',
                textAlign: 'center',
                padding: '1rem 0',
                margin: 0,
              }}
            >
              No tienes invitaciones pendientes.
            </p>

            <p
              onClick={() => navigate('/solicitudes')}
              style={{
                color: '#11823B',
                fontSize: '0.85rem',
                marginTop: '0.5rem',
                cursor: 'pointer',
                margin: '0.5rem 0 0 0',
              }}
            >
              Ver todas las invitaciones →
            </p>
          </div>

          {/* Card Próximos partidos */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '1rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
              }}
            >
              <p style={{ fontWeight: 'bold', fontSize: '0.9rem', margin: 0 }}>Próximos partidos</p>
              <span>📋</span>
            </div>

            <p
              style={{
                fontSize: '0.85rem',
                color: '#737373',
                textAlign: 'center',
                padding: '1rem 0',
                margin: 0,
              }}
            >
              No hay partidos programados.
            </p>

            <p
              style={{
                color: '#11823B',
                fontSize: '0.85rem',
                marginTop: '0.5rem',
                cursor: 'default',
                margin: '0.5rem 0 0 0',
              }}
            >
              Ver tabla de posiciones →
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
          Acciones Rapidas
        </p>

        {/* Card disponibilidad */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '1rem',
            position: 'relative',
          }}
        >
          <button
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>

          <p style={{ fontWeight: 'bold', fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>
            Estado de disponibilidad
          </p>
          <p style={{ fontSize: '0.8rem', color: '#737373', margin: '0 0 0.75rem 0' }}>
            {disponible
              ? 'Estás marcado como disponible. Los capitanes pueden invitarte a sus equipos.'
              : 'Estás marcado como no disponible.'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem' }}>Disponible</span>
            <div
              onClick={() => setDisponible(!disponible)}
              style={{
                width: '40px',
                height: '22px',
                borderRadius: '11px',
                backgroundColor: disponible ? '#11823B' : '#737373',
                cursor: 'pointer',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  ...(disponible ? { right: '2px' } : { left: '2px' }),
                  width: '18px',
                  height: '18px',
                  backgroundColor: '#ffffff',
                  borderRadius: '50%',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Grid de botones de navegación */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <button
            onClick={() => navigate('/perfil')}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '2rem' }}>📋</span>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Mi perfil</span>
          </button>

          <button
            onClick={() => navigate('/sanciones')}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '2rem' }}>🟨🟥</span>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Sanciones</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default JugadorDashboardPage
