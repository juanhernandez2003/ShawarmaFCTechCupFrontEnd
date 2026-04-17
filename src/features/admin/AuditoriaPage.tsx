import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import useAuthStore from '../../store/authStore'

interface RegistroAuditoria {
  id: string
  usuario: string
  tipoAccion: string
  descripcion: string
  fecha: string
}

const TIPO_COLORES: Record<string, { bg: string; color: string }> = {
  LOGIN_ADMIN: { bg: '#e8f5e9', color: '#11823B' },
  REGISTRO_ORGANIZADOR: { bg: '#e3f2fd', color: '#1565c0' },
  REGISTRO_ARBITRO: { bg: '#fff3e0', color: '#e65100' },
  CREACION: { bg: '#e8f5e9', color: '#11823B' },
  APROBACION: { bg: '#e3f2fd', color: '#1565c0' },
  REGISTRO: { bg: '#fff3e0', color: '#e65100' },
  RESULTADO: { bg: '#e8f5e9', color: '#2e7d32' },
  RECHAZO: { bg: '#fce4ec', color: '#c62828' },
  CONFIGURACION: { bg: '#e8eaf6', color: '#283593' },
  ESTADO: { bg: '#e3f2fd', color: '#1565c0' },
  SESION: { bg: '#f3e5f5', color: '#6a1b9a' },
}

const getBadgeStyle = (tipo: string) => {
  const style = TIPO_COLORES[tipo] || { bg: '#f5f5f5', color: '#737373' }
  return {
    backgroundColor: style.bg,
    color: style.color,
    borderRadius: '12px',
    padding: '2px 12px',
    fontSize: '0.75rem',
    fontFamily: 'Montserrat, sans-serif',
    whiteSpace: 'nowrap' as const,
  }
}

const formatFecha = (fecha: string): string => {
  if (!fecha) return ''
  const d = new Date(fecha)
  return d.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const AuditoriaPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)

  const [registros, setRegistros] = useState<RegistroAuditoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filtroUsuario, setFiltroUsuario] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroFecha, setFiltroFecha] = useState('')

  const fetchAuditoria = () => {
    if (!user) return
    setLoading(true)
    setError(null)

    const params: Record<string, string> = {}
    if (filtroUsuario) params.usuario = filtroUsuario
    if (filtroTipo) params.tipoAccion = filtroTipo

    apiClient
      .get('/api/admin/audit', { params })
      .then(res => {
        const data = res.data
        setRegistros(data.registros || [])
      })
      .catch(() => setError('Error al cargar la auditoría'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAuditoria()
  }, [])

  const registrosFiltrados = registros.filter(r => {
    if (filtroFecha && !r.fecha?.startsWith(filtroFecha)) return false
    return true
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
            letterSpacing: '0.02em',
          }}
        >
          REGISTRO AUDITORIA
        </h1>
        <p
          style={{
            color: '#ffffff',
            margin: '0.25rem 0 0',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          historial completo de acciones del sistema
        </p>
      </div>

      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        {/* Filtros */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label
              style={{
                fontSize: '0.75rem',
                color: '#737373',
                display: 'block',
                marginBottom: '0.25rem',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              Filtrar por usuario
            </label>
            <input
              type="text"
              placeholder="Todos los usuarios"
              value={filtroUsuario}
              onChange={e => setFiltroUsuario(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.45rem 0.75rem',
                border: '1px solid #D9D9D9',
                borderRadius: '4px',
                fontSize: '0.82rem',
                fontFamily: 'Montserrat, sans-serif',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: '160px' }}>
            <label
              style={{
                fontSize: '0.75rem',
                color: '#737373',
                display: 'block',
                marginBottom: '0.25rem',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              Tipo de acción
            </label>
            <select
              value={filtroTipo}
              onChange={e => setFiltroTipo(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.45rem 0.75rem',
                border: '1px solid #D9D9D9',
                borderRadius: '4px',
                fontSize: '0.82rem',
                fontFamily: 'Montserrat, sans-serif',
                outline: 'none',
                backgroundColor: '#fff',
              }}
            >
              <option value="">Todas las acciones</option>
              <option value="LOGIN_ADMIN">Login Admin</option>
              <option value="REGISTRO_ORGANIZADOR">Registro Organizador</option>
              <option value="REGISTRO_ARBITRO">Registro Árbitro</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '160px' }}>
            <label
              style={{
                fontSize: '0.75rem',
                color: '#737373',
                display: 'block',
                marginBottom: '0.25rem',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              Rango de fechas
            </label>
            <input
              type="date"
              value={filtroFecha}
              onChange={e => setFiltroFecha(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.45rem 0.75rem',
                border: '1px solid #D9D9D9',
                borderRadius: '4px',
                fontSize: '0.82rem',
                fontFamily: 'Montserrat, sans-serif',
                outline: 'none',
              }}
            />
          </div>

          <button
            onClick={fetchAuditoria}
            style={{
              backgroundColor: '#11823B',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              flexShrink: 0,
            }}
          >
            ▼
          </button>
        </div>

        {/* Tabla */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                {['Fecha y hora', 'Acción', 'Usuario', 'Tipo'].map(col => (
                  <th
                    key={col}
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      fontSize: '0.8rem',
                      color: '#000',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 'bold',
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
                    colSpan={4}
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: '#737373',
                      fontSize: '0.85rem',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    Cargando registros...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: '#ef4444',
                      fontSize: '0.85rem',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    {error}
                  </td>
                </tr>
              ) : registrosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: '#737373',
                      fontSize: '0.85rem',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    No hay registros de auditoría
                  </td>
                </tr>
              ) : (
                registrosFiltrados.map((r, i) => (
                  <tr key={r.id || i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.82rem',
                        fontFamily: 'Montserrat, sans-serif',
                        color: '#555',
                      }}
                    >
                      {formatFecha(r.fecha)}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.82rem',
                        fontFamily: 'Montserrat, sans-serif',
                      }}
                    >
                      {r.descripcion}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        fontSize: '0.82rem',
                        fontFamily: 'Montserrat, sans-serif',
                        color: '#555',
                      }}
                    >
                      {r.usuario}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={getBadgeStyle(r.tipoAccion)}>{r.tipoAccion}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Botón volver */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: '#737373',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.5rem 1.5rem',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            ←
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuditoriaPage
