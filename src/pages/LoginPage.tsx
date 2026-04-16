import { useState, type FormEvent, type ChangeEvent, type CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import { login, decodeToken } from '../services/authService'
import useAuthStore from '../store/authStore'

interface FormErrors {
  correo: string
  contrasena: string
}

const inputStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  color: '#000000',
  border: '1px solid #D9D9D9',
  borderRadius: '4px',
  padding: '0.5rem',
  width: '100%',
  boxSizing: 'border-box',
}

const labelStyle: CSSProperties = {
  display: 'block',
  color: '#000000',
  marginBottom: '0.25rem',
  fontFamily: 'Montserrat, sans-serif',
}

const getRutaPorRol = (rol: string): string => {
  switch (rol) {
    case 'JUGADOR':
      return '/dashboard'
    case 'CAPITAN':
      return '/capitan/dashboard'
    case 'ORGANIZADOR':
      return '/dashboard'
    case 'ARBITRO':
      return '/dashboard'
    case 'ADMINISTRADOR':
      return '/dashboard'
    default:
      return '/dashboard'
  }
}

export default function LoginPage() {
  const [correo, setCorreo] = useState<string>('')
  const [contrasena, setContrasena] = useState<string>('')
  const [recordarme, setRecordarme] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [errorGeneral, setErrorGeneral] = useState<string>('')

  const authStore = useAuthStore()
  const navigate = useNavigate()

  const erroresActivos: FormErrors = (() => {
    const e: FormErrors = { correo: '', contrasena: '' }
    if (!correo.trim()) e.correo = 'El correo es obligatorio.'
    else if (!correo.includes('@')) e.correo = 'El correo debe contener "@".'
    if (!contrasena.trim()) e.contrasena = 'La contraseña es obligatoria.'
    return e
  })()

  const errores: FormErrors = submitted ? erroresActivos : { correo: '', contrasena: '' }
  const isDisabled = submitted && (erroresActivos.correo !== '' || erroresActivos.contrasena !== '')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)

    if (erroresActivos.correo || erroresActivos.contrasena) return

    setIsLoading(true)
    setErrorGeneral('')

    try {
      const response = await login({ email: correo, password: contrasena })
      const decoded = decodeToken(response.token)
      authStore.login(response.token, {
        correo: decoded.sub,
        rol: decoded.rol,
      })
      navigate(getRutaPorRol(decoded.rol))
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { detalle?: string } } }
      if (axiosError.response?.data?.detalle) {
        setErrorGeneral(axiosError.response.data.detalle)
      } else {
        setErrorGeneral('Error de conexión con el servidor.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <PageHeader title="iniciar sesión" />

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          padding: '2rem',
          maxWidth: '500px',
          margin: '2rem auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <p
          style={{
            fontSize: '0.8rem',
            color: '#737373',
            fontWeight: '400',
            margin: '0 0 1.5rem 0',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          inicia sesión a nuestra pagina
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="correo" style={labelStyle}>
            Correo electrónico
          </label>
          <input
            id="correo"
            type="email"
            placeholder="Ingrese su correo electrónico"
            value={correo}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCorreo(e.target.value)}
            style={{
              ...inputStyle,
              border: submitted && errores.correo ? '1px solid #E53E3E' : '1px solid #D9D9D9',
            }}
          />

          <p
            style={{
              fontSize: '0.75rem',
              color: '#A0A0A0',
              fontWeight: '400',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            (Si eres invitado recuerda que puedes jugar poniendo tu correo de registro)
          </p>

          {submitted && errores.correo && (
            <p style={{ color: '#E53E3E', fontSize: '0.875rem', margin: '0.25rem 0 1rem 0' }}>
              {errores.correo}
            </p>
          )}
          {!(submitted && errores.correo) && <div style={{ marginBottom: '1rem' }} />}

          <label htmlFor="contrasena" style={labelStyle}>
            Contraseña
          </label>
          <input
            id="contrasena"
            type="password"
            placeholder="Ingrese su contraseña"
            value={contrasena}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setContrasena(e.target.value)}
            style={{
              ...inputStyle,
              border: submitted && errores.contrasena ? '1px solid #E53E3E' : '1px solid #D9D9D9',
            }}
          />
          {submitted && errores.contrasena && (
            <p style={{ color: '#E53E3E', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              {errores.contrasena}
            </p>
          )}

          <div
            style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <input
              id="recordarme"
              type="checkbox"
              checked={recordarme}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setRecordarme(e.target.checked)}
            />
            <label
              htmlFor="recordarme"
              style={{ color: '#000000', fontFamily: 'Montserrat, sans-serif' }}
            >
              Recordarme
            </label>
          </div>

          <button
            type="submit"
            disabled={isDisabled || isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isDisabled || isLoading ? '#737373' : '#11823B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: isDisabled || isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          {errorGeneral && (
            <p
              style={{
                color: '#E53E3E',
                fontSize: '0.85rem',
                textAlign: 'center',
                margin: '0.75rem 0 0 0',
              }}
            >
              {errorGeneral}
            </p>
          )}
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/registro">¿No tienes una cuenta? Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
