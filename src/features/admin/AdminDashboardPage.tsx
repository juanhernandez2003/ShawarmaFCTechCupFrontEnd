import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../services/apiClient'

interface Usuario {
  id: string
  nombre: string
  email: string
  rol: 'organizador' | 'arbitro'
}

const AdminDashboardPage = () => {
  const navigate = useNavigate()
  const [organizadores, setOrganizadores] = useState<Usuario[]>([])
  const [arbitros, setArbitros] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([apiClient.get('/api/users/organizers'), apiClient.get('/api/users/referees')])
      .then(([orgRes, arbRes]) => {
        setOrganizadores(
          (orgRes.data || []).map((o: { id: string; nombre: string; email: string }) => ({
            ...o,
            rol: 'organizador' as const,
          }))
        )
        setArbitros(
          (arbRes.data || []).map((a: { id: string; nombre: string; email: string }) => ({
            ...a,
            rol: 'arbitro' as const,
          }))
        )
      })
      .catch(() => {
        setOrganizadores([])
        setArbitros([])
      })
      .finally(() => setLoading(false))
  }, [])

  const usuarios: Usuario[] = [...organizadores, ...arbitros]

  const badgeStyle = (_rol: string) => ({
    backgroundColor: 'transparent',
    color: '#11823B',
    border: '1px solid #11823B',
    borderRadius: '12px',
    padding: '2px 12px',
    fontSize: '0.75rem',
    fontFamily: 'Montserrat, sans-serif',
  })

  return (
    <div>
      {/* Banner */}
      <div style={{ backgroundColor: '#11823B', padding: '2rem', textAlign: 'center' }}>
        <h1
          style={{
            color: '#ffffff',
            margin: 0,
            fontSize: '2.2rem',
            fontWeight: 'bold',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Panel de Control
        </h1>
        <p
          style={{
            color: '#ffffff',
            margin: '0.25rem 0 0',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '1rem',
          }}
        >
          Administrador
        </p>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Tarjetas de métricas */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Organizadores activos */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: '#f0f9f4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="13" cy="12" r="5" stroke="#11823B" strokeWidth="2" />
                <path
                  d="M4 28c0-5 4-8 9-8"
                  stroke="#11823B"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="24" cy="12" r="5" stroke="#11823B" strokeWidth="2" />
                <path
                  d="M32 28c0-5-4-8-9-8"
                  stroke="#11823B"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  color: '#737373',
                  fontSize: '0.85rem',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Organizadores activos
              </p>
              <p
                style={{
                  margin: '0.25rem 0 0',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  fontFamily: 'Poppins, sans-serif',
                  color: '#000',
                }}
              >
                {loading ? '...' : organizadores.length}
              </p>
            </div>
          </div>

          {/* Árbitros activos */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: '#f0f9f4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="11" r="6" stroke="#11823B" strokeWidth="2" />
                <path
                  d="M6 30c0-6.627 5.373-12 12-12s12 5.373 12 12"
                  stroke="#11823B"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  color: '#737373',
                  fontSize: '0.85rem',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Árbitros Activos
              </p>
              <p
                style={{
                  margin: '0.25rem 0 0',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  fontFamily: 'Poppins, sans-serif',
                  color: '#000',
                }}
              >
                {loading ? '...' : arbitros.length}
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción — equidistantes */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            gap: '1rem',
          }}
        >
          {[
            {
              label: '⊕ Registrar organizador',
              onClick: () => navigate('/admin/registrar/organizador'),
            },
            { label: '📋 Registrar Árbitro', onClick: () => navigate('/admin/registrar/arbitro') },
            { label: '🧾 Ver Auditoría', onClick: () => navigate('/admin/auditoria') },
          ].map(btn => (
            <button
              key={btn.label}
              onClick={btn.onClick}
              style={{
                flex: 1,
                backgroundColor: '#11823B',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '0.6rem 1rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontFamily: 'Montserrat, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Tabla de usuarios */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <h3
            style={{
              margin: '0 0 1.25rem',
              fontSize: '0.95rem',
              fontFamily: 'Poppins, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            🏆 Usuarios
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Nombre', 'Tipo'].map(col => (
                  <th
                    key={col}
                    style={{
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.8rem',
                      color: '#737373',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 'normal',
                      borderBottom: '1px solid #D9D9D9',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: '#737373',
                      fontSize: '0.85rem',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    Cargando usuarios...
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: '#737373',
                      fontSize: '0.85rem',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                usuarios.map((u, i) => (
                  <tr key={u.id || i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td
                      style={{
                        padding: '0.75rem',
                        fontSize: '0.85rem',
                        fontFamily: 'Montserrat, sans-serif',
                      }}
                    >
                      {u.email || u.nombre}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={badgeStyle(u.rol)}>{u.rol}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
