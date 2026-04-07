import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import useAuthStore from '../../store/authStore'

const COLORES = [
  '#000000',
  '#1a1a2e',
  '#11823B',
  '#3b82f6',
  '#eab308',
  '#f97316',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#ef4444',
]

const SEMESTRES = ['Semestre 2025-2', 'Semestre 2026-1', 'Semestre 2026-2']

const TeamRegisterPage = () => {
  const [nombre, setNombre] = useState('')
  const [colorPrincipal, setColorPrincipal] = useState('')
  const [colorSecundario, setColorSecundario] = useState('')
  const [semestre, setSemestre] = useState('')
  const [equipoCreado, setEquipoCreado] = useState<{ id: string; nombre: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)

  const validar = () => {
    const e: Record<string, string> = {}
    if (!nombre.trim()) e.nombre = 'Por favor ingrese un nombre de equipo válido'
    if (!colorPrincipal) e.colorPrincipal = 'Por favor seleccione un color principal'
    if (!colorSecundario) e.colorSecundario = 'Por favor seleccione un color secundario'
    if (!semestre) e.semestre = 'Por favor seleccione un semestre válido'
    return e
  }

  const handleSubmit = async () => {
    const e = validar()
    if (Object.keys(e).length > 0) {
      setErrores(e)
      return
    }
    if (!user) return
    setLoading(true)
    setErrores({})
    try {
      const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/users/captains/${user.correo}/team`,
        null,
        {
          params: { nombreEquipo: nombre },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      )
      setEquipoCreado({ id: response.data.id, nombre })
      setNombre('')
      setColorPrincipal('')
      setColorSecundario('')
      setSemestre('')
    } catch {
      setErrores({ general: 'Error al registrar el equipo' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Banner */}
      <div style={{ backgroundColor: '#11823B', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
          Crear Equipo
        </h1>
        <p style={{ color: '#ffffff', margin: '0.5rem 0 0' }}>Registra tu nuevo equipo</p>
      </div>

      {/* Contenido */}
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          padding: '2rem',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* Panel izquierdo - Formulario */}
        <div
          style={{
            flex: '0 0 280px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '1.5rem',
          }}
        >
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Información del Equipo</h3>

          {/* Escudo */}
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: `2px solid ${errores.escudo ? '#ef4444' : '#11823B'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                cursor: 'pointer',
                fontSize: '2rem',
              }}
            >
              📷
            </div>
            {errores.escudo && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>
                {errores.escudo}
              </p>
            )}
            <p
              style={{
                color: '#11823B',
                fontSize: '0.8rem',
                margin: '0.5rem 0 0',
                cursor: 'pointer',
              }}
            >
              ⬆ Subir Escudo
            </p>
          </div>

          {/* Nombre */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
              Nombre del Equipo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ingrese el nombre de su equipo"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.5rem',
                border: `1px solid ${errores.nombre ? '#ef4444' : '#D9D9D9'}`,
                borderRadius: '4px',
                fontSize: '0.85rem',
              }}
            />
            {errores.nombre && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>
                {errores.nombre}
              </p>
            )}
          </div>

          {/* Colores */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
              Colores del Equipo
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.75rem', margin: '0 0 0.25rem', color: '#737373' }}>
                  Principal
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {COLORES.map(c => (
                    <div
                      key={c}
                      onClick={() => setColorPrincipal(c)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: c,
                        cursor: 'pointer',
                        border:
                          colorPrincipal === c ? '2px solid #11823B' : '2px solid transparent',
                      }}
                    />
                  ))}
                </div>
                {errores.colorPrincipal && (
                  <p style={{ color: '#ef4444', fontSize: '0.7rem', margin: '0.25rem 0 0' }}>
                    {errores.colorPrincipal}
                  </p>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.75rem', margin: '0 0 0.25rem', color: '#737373' }}>
                  Secundario
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {COLORES.map(c => (
                    <div
                      key={c}
                      onClick={() => setColorSecundario(c)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: c,
                        cursor: 'pointer',
                        border:
                          colorSecundario === c ? '2px solid #11823B' : '2px solid transparent',
                      }}
                    />
                  ))}
                </div>
                {errores.colorSecundario && (
                  <p style={{ color: '#ef4444', fontSize: '0.7rem', margin: '0.25rem 0 0' }}>
                    {errores.colorSecundario}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Semestre */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
              Semestre de juego
            </label>
            <select
              value={semestre}
              onChange={e => setSemestre(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${errores.semestre ? '#ef4444' : '#D9D9D9'}`,
                borderRadius: '4px',
                fontSize: '0.85rem',
              }}
            >
              <option value="">Por favor seleccione el semestre en el jugara</option>
              {SEMESTRES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errores.semestre && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>
                {errores.semestre}
              </p>
            )}
          </div>

          {errores.general && (
            <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '1rem' }}>
              {errores.general}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#11823B',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              marginBottom: '0.5rem',
            }}
          >
            💾 {loading ? 'Creando...' : 'Crear equipo'}
          </button>

          <button
            onClick={() => navigate(-1)}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#737373',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Volver
          </button>
        </div>

        {/* Panel derecho - Equipos creados */}
        <div
          style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '8px', padding: '1.5rem' }}
        >
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Equipos creados</h3>

          {!equipoCreado ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#737373' }}>
              <p style={{ fontSize: '1.1rem', margin: '0 0 0.5rem' }}>
                Aún no has creado un equipo
              </p>
              <p style={{ margin: '0 0 0.5rem' }}>Cuando crees un equipo aparecerá aquí</p>
              <p style={{ margin: '0 0 2rem' }}>!Empieza registrando tu primer equipo¡</p>
              <div style={{ fontSize: '4rem' }}>⚽</div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  border: '1px solid #D9D9D9',
                  borderRadius: '4px',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span>⚽</span>
                  <span style={{ fontSize: '0.9rem' }}>{equipoCreado.nombre}</span>
                </div>
                <button
                  onClick={() => setEquipoCreado(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  🗑
                </button>
              </div>
              <button
                onClick={() => navigate(`/equipos/${equipoCreado.id}`)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'transparent',
                  color: '#11823B',
                  border: '1px dashed #11823B',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                + Agregar Jugador
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeamRegisterPage
