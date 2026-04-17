import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../services/apiClient'
import { obtenerJugadorPorCorreo } from '../../services/jugadorService'
import useAuthStore from '../../store/authStore'

const POSICIONES = [
  { value: 'PORTERO', label: 'Portero' },
  { value: 'DEFENSA', label: 'Defensa' },
  { value: 'VOLANTE', label: 'Volante' },
  { value: 'DELANTERO', label: 'Delantero' },
]

const GENEROS = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO', label: 'Femenino' },
  { value: 'OTRO', label: 'Otro' },
]

const SEMESTRES = Array.from({ length: 9 }, (_, i) => ({
  value: String(i + 1),
  label: `Semestre ${i + 1}`,
}))

const EDADES = Array.from({ length: 33 }, (_, i) => ({
  value: String(i + 16),
  label: String(i + 16),
}))

interface FormErrors {
  nombre?: string
  semestre?: string
  genero?: string
  fechaNacimiento?: string
  edad?: string
  dorsal?: string
  posicionPrincipal?: string
  posicionSecundaria?: string
  general?: string
}

const CanchaIcon = ({ posicion }: { posicion: string }) => {
  const getPosicionY = () => {
    switch (posicion) {
      case 'PORTERO':
        return '85%'
      case 'DEFENSA':
        return '65%'
      case 'VOLANTE':
        return '45%'
      case 'DELANTERO':
        return '25%'
      default:
        return '50%'
    }
  }

  return (
    <div
      style={{
        width: '100%',
        height: '180px',
        backgroundColor: '#11823B',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden',
        border: '2px solid #0d6b30',
      }}
    >
      {/* Líneas de la cancha */}
      <div
        style={{
          position: 'absolute',
          inset: '8px',
          border: '2px solid rgba(255,255,255,0.5)',
          borderRadius: '4px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '2px',
          backgroundColor: 'rgba(255,255,255,0.5)',
          transform: 'translateX(-50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '60px',
          height: '60px',
          border: '2px solid rgba(255,255,255,0.5)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      {/* Área grande arriba */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '25%',
          right: '25%',
          height: '22%',
          border: '2px solid rgba(255,255,255,0.5)',
          borderTop: 'none',
        }}
      />
      {/* Área grande abajo */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '25%',
          right: '25%',
          height: '22%',
          border: '2px solid rgba(255,255,255,0.5)',
          borderBottom: 'none',
        }}
      />

      {/* Jugador en cancha */}
      {posicion && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: getPosicionY(),
            transform: 'translate(-50%, -50%)',
            width: '28px',
            height: '28px',
            backgroundColor: '#000',
            borderRadius: '50%',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}
        >
          ⚽
        </div>
      )}
    </div>
  )
}

const CamisetaIcon = ({ numero, color = '#11823B' }: { numero: string; color?: string }) => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 20 L10 40 L25 45 L25 85 L75 85 L75 45 L90 40 L80 20 L65 28 Q50 35 35 28 Z"
      fill={color}
      stroke="rgba(0,0,0,0.2)"
      strokeWidth="1"
    />
    <text
      x="50"
      y="65"
      textAnchor="middle"
      fill="white"
      fontSize="22"
      fontWeight="bold"
      fontFamily="Poppins, sans-serif"
    >
      {numero || '?'}
    </text>
  </svg>
)

const CrearPerfilPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)

  const handleToggleCapitan = async () => {
    try {
      await apiClient.patch(`/api/users/players/${user?.correo}/profile/toggle-role`)
      alert(
        '✅ Rol actualizado. Por favor cierra sesión e inicia sesión nuevamente para ver los cambios.'
      )
      logout()
      navigate('/login')
    } catch {
      alert('❌ Error al cambiar el rol')
    }
  }

  const [nombre, setNombre] = useState('')
  const [semestre, setSemestre] = useState('')
  const [genero, setGenero] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [edad, setEdad] = useState('')
  const [dorsal, setDorsal] = useState('')
  const [posicionPrincipal, setPosicionPrincipal] = useState('')
  const [posicionSecundaria, setPosicionSecundaria] = useState('')
  const [esCapitan] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState<FormErrors>({})

  const perfilCompleto =
    nombre && semestre && genero && fechaNacimiento && edad && dorsal && posicionPrincipal

  const validar = (): FormErrors => {
    const e: FormErrors = {}
    if (!nombre.trim()) e.nombre = 'Por favor ingresa un nombre válido'
    if (!semestre) e.semestre = 'Por favor selecciona tu semestre'
    if (!genero) e.genero = 'Por favor selecciona tu género'
    if (!fechaNacimiento) e.fechaNacimiento = 'Por favor ingresa una fecha de nacimiento válida'
    if (!edad) e.edad = 'Por favor ingresa tu edad'
    if (!dorsal.trim() || isNaN(Number(dorsal)) || Number(dorsal) < 1 || Number(dorsal) > 99)
      e.dorsal = 'Por favor ingresa un número de dorsal válido (1-99)'
    if (!posicionPrincipal) e.posicionPrincipal = 'Por favor ingresa tu posición principal'
    return e
  }

  const handleGuardar = async () => {
    setSubmitted(true)
    const e = validar()
    if (Object.keys(e).length > 0) {
      setErrores(e)
      return
    }

    if (!user) return
    setLoading(true)
    setErrores({})

    try {
      const jugador = await obtenerJugadorPorCorreo(user.correo)
      if (!jugador) {
        setErrores({ general: 'No se encontró el jugador asociado a tu cuenta' })
        setLoading(false)
        return
      }

      const posiciones = posicionSecundaria
        ? [posicionPrincipal, posicionSecundaria]
        : [posicionPrincipal]

      await apiClient.post(`/api/users/players/${jugador.id}/profile`, {
        posiciones,
        dorsal: Number(dorsal),
        foto: '',
        edad: Number(edad),
        genero,
        identificacion: user.correo,
        semestre: Number(semestre),
      })

      navigate('/equipos')
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { detalle?: string } } }
      setErrores({
        general: axiosError.response?.data?.detalle || 'Error al guardar el perfil',
      })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (campo: keyof FormErrors) => ({
    width: '100%',
    boxSizing: 'border-box' as const,
    padding: '0.5rem',
    border: `1px solid ${submitted && errores[campo] ? '#ef4444' : '#D9D9D9'}`,
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontFamily: 'Montserrat, sans-serif',
    outline: 'none',
  })

  const errorText = (campo: keyof FormErrors) =>
    submitted && errores[campo] ? (
      <p style={{ color: '#ef4444', fontSize: '0.72rem', margin: '0.2rem 0 0' }}>
        {errores[campo]}
      </p>
    ) : null

  return (
    <div>
      {/* Banner */}
      <div style={{ backgroundColor: '#11823B', padding: '2rem', textAlign: 'center' }}>
        <h1
          style={{
            color: '#ffffff',
            margin: 0,
            fontSize: '2rem',
            fontWeight: 'bold',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Crea tu perfil
        </h1>
        <p style={{ color: '#ffffff', margin: '0.5rem 0 0', fontFamily: 'Montserrat, sans-serif' }}>
          Completa tu información como jugador
        </p>
      </div>

      {/* Contenido */}
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          padding: '2rem',
          maxWidth: '1000px',
          margin: '0 auto',
          alignItems: 'flex-start',
        }}
      >
        {/* Columna izquierda */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Información Personal */}
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem' }}>
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
              👤 Información Personal
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  fontSize: '0.8rem',
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Nombre Completo
              </label>
              <input
                type="text"
                placeholder="Ej. Juan Carlos Pérez"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                style={inputStyle('nombre')}
              />
              {errorText('nombre')}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  fontSize: '0.8rem',
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Semestre
              </label>
              <select
                value={semestre}
                onChange={e => setSemestre(e.target.value)}
                style={inputStyle('semestre')}
              >
                <option value="">Seleccionar semestre</option>
                {SEMESTRES.map(s => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              {errorText('semestre')}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  fontSize: '0.8rem',
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Género
              </label>
              <select
                value={genero}
                onChange={e => setGenero(e.target.value)}
                style={inputStyle('genero')}
              >
                <option value="">Selecciona tu género</option>
                {GENEROS.map(g => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
              {errorText('genero')}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  fontSize: '0.8rem',
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={e => setFechaNacimiento(e.target.value)}
                style={inputStyle('fechaNacimiento')}
              />
              {errorText('fechaNacimiento')}
            </div>

            <div style={{ marginBottom: '0.5rem' }}>
              <label
                style={{
                  fontSize: '0.8rem',
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Edad
              </label>
              <select
                value={edad}
                onChange={e => setEdad(e.target.value)}
                style={inputStyle('edad')}
              >
                <option value="">Selecciona tu edad</option>
                {EDADES.map(e => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
              {errorText('edad')}
            </div>
          </div>

          {/* Información Deportiva */}
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem' }}>
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
              ⚽ Información Deportiva
            </h3>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              {/* Dorsal + camiseta */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <label
                  style={{
                    fontSize: '0.8rem',
                    fontFamily: 'Montserrat, sans-serif',
                    alignSelf: 'flex-start',
                  }}
                >
                  Número de Dorsal
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  placeholder="Selecciones un numero"
                  value={dorsal}
                  onChange={e => setDorsal(e.target.value)}
                  style={{ ...inputStyle('dorsal'), width: '140px' }}
                />
                {errorText('dorsal')}
                <CamisetaIcon numero={dorsal} />
              </div>

              {/* Posiciones */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label
                    style={{
                      fontSize: '0.8rem',
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    Posición Principal
                  </label>
                  <select
                    value={posicionPrincipal}
                    onChange={e => setPosicionPrincipal(e.target.value)}
                    style={inputStyle('posicionPrincipal')}
                  >
                    <option value="">Posición Principal</option>
                    {POSICIONES.map(p => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  {errorText('posicionPrincipal')}
                </div>

                <div>
                  <label
                    style={{
                      fontSize: '0.8rem',
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    Posición Secundaria
                  </label>
                  <select
                    value={posicionSecundaria}
                    onChange={e => setPosicionSecundaria(e.target.value)}
                    style={inputStyle('posicionSecundaria')}
                  >
                    <option value="">Posición Secundaria</option>
                    {POSICIONES.filter(p => p.value !== posicionPrincipal).map(p => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cancha */}
              <div style={{ width: '130px' }}>
                <CanchaIcon posicion={posicionPrincipal} />
              </div>
            </div>
          </div>

          {/* Botón volver */}
          <div>
            <button
              onClick={() => navigate(-1)}
              style={{
                backgroundColor: '#737373',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem 1.25rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              ← Volver
            </button>
          </div>
        </div>

        {/* Columna derecha — Vista previa + Capitán */}
        <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Botones vista previa / guardar */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              style={{
                backgroundColor: 'transparent',
                color: '#11823B',
                border: '1px solid #11823B',
                borderRadius: '4px',
                padding: '0.4rem 0.9rem',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              👁 Vista Previa
            </button>
            <button
              onClick={handleGuardar}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#737373' : '#11823B',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.4rem 0.9rem',
                fontSize: '0.8rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Montserrat, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              💾 {loading ? 'Guardando...' : 'Guardar Perfil'}
            </button>
          </div>

          {/* Vista previa del perfil */}
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '1.25rem',
              textAlign: 'center',
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p
              style={{
                fontSize: '0.8rem',
                color: '#737373',
                margin: '0 0 0.75rem',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 'bold',
              }}
            >
              Vista Previa del Perfil
            </p>

            {perfilCompleto ? (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <CamisetaIcon numero={dorsal} />
                </div>
                <p
                  style={{
                    margin: '0 0 0.25rem',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  {nombre}
                </p>
                <p
                  style={{
                    margin: '0 0 0.75rem',
                    color: '#11823B',
                    fontSize: '0.78rem',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {POSICIONES.find(p => p.value === posicionPrincipal)?.label}
                </p>
                <div
                  style={{
                    textAlign: 'left',
                    fontSize: '0.78rem',
                    fontFamily: 'Montserrat, sans-serif',
                    borderTop: '1px solid #D9D9D9',
                    paddingTop: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.3rem',
                    }}
                  >
                    <span style={{ color: '#737373' }}>Semestre:</span>
                    <span style={{ fontWeight: 'bold' }}>{semestre}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.3rem',
                    }}
                  >
                    <span style={{ color: '#737373' }}>Género:</span>
                    <span style={{ fontWeight: 'bold' }}>
                      {GENEROS.find(g => g.value === genero)?.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#737373' }}>Fecha de Nacimiento:</span>
                    <span style={{ fontWeight: 'bold' }}>{fechaNacimiento}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p
                style={{
                  color: '#737373',
                  fontSize: '0.78rem',
                  fontFamily: 'Montserrat, sans-serif',
                  textAlign: 'center',
                }}
              >
                CREA TU PERFIL PARA VER LA VISTA PREVIA
              </p>
            )}
          </div>

          {/* ¿Desea ser capitán? */}
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '1.25rem',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: '0 0 1rem',
                fontSize: '0.85rem',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 'bold',
              }}
            >
              ¿Desea ser capitán?
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.8rem',
                  color: '#737373',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                No
              </span>
              <div
                onClick={handleToggleCapitan}
                style={{
                  width: '48px',
                  height: '26px',
                  backgroundColor: esCapitan ? '#11823B' : '#D9D9D9',
                  borderRadius: '13px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '3px',
                    left: esCapitan ? '25px' : '3px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: '#737373',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Sí
              </span>
            </div>

            {esCapitan && (
              <p
                style={{
                  marginTop: '0.75rem',
                  color: '#11823B',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                ✓ YA ERES CAPITÁN
              </p>
            )}
          </div>

          {/* Error general */}
          {errores.general && (
            <p
              style={{
                color: '#ef4444',
                fontSize: '0.8rem',
                textAlign: 'center',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              {errores.general}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CrearPerfilPage
