import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../services/apiClient'
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

const SEMESTRES = ['2026-1', '2026-2', '2027-1', '2027-2', '2028-1', '2028-2']

const TeamRegisterPage = () => {
  const [nombre, setNombre] = useState('')
  const [colorPrincipal, setColorPrincipal] = useState('')
  const [colorSecundario, setColorSecundario] = useState('')
  const [semestre, setSemestre] = useState('')
  const [equipoCreado, setEquipoCreado] = useState<{ id: string; nombre: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [escudoArchivo, setEscudoArchivo] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMensaje, setPopupMensaje] = useState('')
  const escudoInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)

  const validar = () => {
    const e: Record<string, string> = {}
    if (!nombre.trim() || nombre.trim().length < 3)
      e.nombre = 'Por favor ingrese un nombre de equipo válido (mínimo 3 caracteres)'
    if (!colorPrincipal) e.colorPrincipal = 'Por favor seleccione un color principal'
    else if (colorPrincipal === colorSecundario)
      e.colorPrincipal = 'El color principal no puede ser igual al color secundario'
    if (!colorSecundario) e.colorSecundario = 'Por favor seleccione un color secundario'
    else if (colorSecundario === colorPrincipal)
      e.colorSecundario = 'El color secundario no puede ser igual al color principal'
    if (!semestre) e.semestre = 'Por favor seleccione un semestre válido'
    return e
  }

  const handleSubmit = async () => {
    setSubmitted(true)
    const e = validar()
    if (Object.keys(e).length > 0) {
      setErrores(e)
      return
    }
    if (!user) {
      setPopupMensaje('❌ No hay sesión activa. Por favor inicia sesión nuevamente')
      setShowPopup(true)
      return
    }
    setLoading(true)
    setErrores({})
    try {
      const response = await apiClient.post('/api/teams', {
        nombre,
        escudo: '',
        colorPrincipal,
        colorSecundario,
        capitanId: user.correo,
      })
      setEquipoCreado({ id: response.data.id, nombre })
      setNombre('')
      setColorPrincipal('')
      setColorSecundario('')
      setSemestre('')
      setEscudoArchivo(null)
      setSubmitted(false)
      setPopupMensaje('✅ Equipo creado correctamente')
      setShowPopup(true)
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { detalle?: string } } }
      const msg = axiosError.response?.data?.detalle || 'Error al registrar el equipo'
      setPopupMensaje(`❌ Error al crear el equipo: ${msg}`)
      setShowPopup(true)
    } finally {
      setLoading(false)
    }
  }

  const erroresActuales = submitted ? validar() : {}

  return (
    <>
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
            <input
              ref={escudoInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0] ?? null
                setEscudoArchivo(file)
              }}
            />
            <div
              onClick={() => escudoInputRef.current?.click()}
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
              onClick={() => escudoInputRef.current?.click()}
              style={{
                color: '#11823B',
                fontSize: '0.8rem',
                margin: '0.5rem 0 0',
                cursor: 'pointer',
              }}
            >
              ⬆ Subir Escudo
            </p>
            {escudoArchivo && (
              <div style={{ marginTop: '0.4rem' }}>
                <p style={{ color: '#11823B', fontSize: '0.8rem', margin: 0 }}>
                  {escudoArchivo.name}
                </p>
                <button
                  onClick={() => {
                    setEscudoArchivo(null)
                    if (escudoInputRef.current) escudoInputRef.current.value = ''
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#E53E3E',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    padding: 0,
                    marginTop: '0.2rem',
                  }}
                >
                  ✕ Descartar
                </button>
              </div>
            )}
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
                border: `1px solid ${erroresActuales.nombre ? '#ef4444' : '#D9D9D9'}`,
                borderRadius: '4px',
                fontSize: '0.85rem',
              }}
            />
            {erroresActuales.nombre && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>
                {erroresActuales.nombre}
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
                        border: colorPrincipal === c ? '2px solid #000' : '2px solid transparent',
                      }}
                    />
                  ))}
                </div>
                {erroresActuales.colorPrincipal && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>
                    {erroresActuales.colorPrincipal}
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
                        border: colorSecundario === c ? '2px solid #000' : '2px solid transparent',
                      }}
                    />
                  ))}
                </div>
                {erroresActuales.colorSecundario && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>
                    {erroresActuales.colorSecundario}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Semestre */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
              Semestre
            </label>
            <select
              value={semestre}
              onChange={e => setSemestre(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.5rem',
                border: `1px solid ${erroresActuales.semestre ? '#ef4444' : '#D9D9D9'}`,
                borderRadius: '4px',
                fontSize: '0.85rem',
              }}
            >
              <option value="">Por favor seleccione el semestre en el que jugará</option>
              {SEMESTRES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {erroresActuales.semestre && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>
                {erroresActuales.semestre}
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || (submitted && Object.keys(erroresActuales).length > 0)}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor:
                loading || (submitted && Object.keys(erroresActuales).length > 0)
                  ? '#737373'
                  : '#11823B',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor:
                loading || (submitted && Object.keys(erroresActuales).length > 0)
                  ? 'not-allowed'
                  : 'pointer',
              fontSize: '0.9rem',
              marginBottom: '0.5rem',
            }}
          >
            {loading ? 'Creando...' : '💾 Crear equipo'}
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
              <p style={{ margin: '0 0 2rem' }}>¡Empieza registrando tu primer equipo!</p>
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

      {/* Popup */}
      {showPopup && (
        <>
          <div
            onClick={() => setShowPopup(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 999,
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '1.5rem 2rem',
              textAlign: 'center',
              zIndex: 1000,
              minWidth: '260px',
            }}
          >
            <p style={{ fontWeight: 'bold', fontSize: '0.95rem', margin: '0 0 1rem 0' }}>
              {popupMensaje}
            </p>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                backgroundColor: '#11823B',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem 1.5rem',
                cursor: 'pointer',
              }}
            >
              Cerrar
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default TeamRegisterPage
