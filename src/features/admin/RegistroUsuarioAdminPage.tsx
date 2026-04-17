import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import apiClient from '../../services/apiClient'
import useAuthStore from '../../store/authStore'

interface Props {
  rol: 'ORGANIZADOR' | 'ARBITRO'
}

interface FormErrors {
  nombre: string
  apellido: string
  tipoUsuario: string
  correo: string
  contrasena: string
}

const TIPOS_USUARIO = [
  { value: 'ESTUDIANTE', label: 'Estudiante' },
  { value: 'GRADUADO', label: 'Graduado' },
  { value: 'PROFESOR', label: 'Profesor' },
  { value: 'PERSONAL_ADMIN', label: 'Personal Administrativo' },
  { value: 'FAMILIAR', label: 'Familiar' },
]

const emptyErrors = (): FormErrors => ({
  nombre: '',
  apellido: '',
  tipoUsuario: '',
  correo: '',
  contrasena: '',
})

function validate(
  nombre: string,
  apellido: string,
  tipoUsuario: string,
  correo: string,
  contrasena: string
): FormErrors {
  const errors = emptyErrors()
  const lettersOnly = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/

  if (!nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio.'
  } else if (!lettersOnly.test(nombre.trim())) {
    errors.nombre = 'El nombre solo puede contener letras y espacios.'
  }

  if (!apellido.trim()) {
    errors.apellido = 'El apellido es obligatorio.'
  } else if (!lettersOnly.test(apellido.trim())) {
    errors.apellido = 'El apellido solo puede contener letras y espacios.'
  }

  if (!tipoUsuario) {
    errors.tipoUsuario = 'Por favor selecciona el tipo de usuario.'
  }

  if (!correo.trim()) {
    errors.correo = 'El correo es obligatorio.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
    errors.correo = 'Ingrese un correo electrónico válido.'
  }

  if (!contrasena) {
    errors.contrasena = 'La contraseña es obligatoria.'
  } else if (contrasena.length < 8) {
    errors.contrasena = 'La contraseña debe tener al menos 8 caracteres.'
  }

  return errors
}

function hasErrors(errors: FormErrors): boolean {
  return Object.values(errors).some(v => v !== '')
}

export default function RegistroUsuarioAdminPage({ rol }: Props) {
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const token = useAuthStore(state => state.token)

  const adminId = user?.id ?? null

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [tipoUsuario, setTipoUsuario] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [errores, setErrores] = useState<FormErrors>(emptyErrors())
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')
  const [exito, setExito] = useState(false)

  const titulo = rol === 'ORGANIZADOR' ? 'Registrar Organizador' : 'Registrar Árbitro'

  useEffect(() => {
    if (!adminId) {
      setErrorGeneral('No se encontró el ID del administrador en sesión. Vuelve a iniciar sesión.')
    }
  }, [adminId])

  useEffect(() => {
    if (submitted) {
      setErrores(validate(nombre, apellido, tipoUsuario, correo, contrasena))
    }
  }, [nombre, apellido, tipoUsuario, correo, contrasena, submitted])

  const isDisabled = submitted && hasErrors(errores)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)

    const current = validate(nombre, apellido, tipoUsuario, correo, contrasena)
    setErrores(current)
    if (hasErrors(current)) return

    if (!adminId) {
      setErrorGeneral('No se encontró el ID del administrador. Vuelve a iniciar sesión.')
      return
    }

    setIsLoading(true)
    setErrorGeneral('')

    try {
      await apiClient.post(
        '/api/admin/users',
        {
          nombre: nombre.trim() + ' ' + apellido.trim(),
          email: correo.trim(),
          password: contrasena,
          tipoUsuario,
          rol,
        },
        {
          headers: {
            'X-Administrador-Id': adminId,
            'X-Administrador-Token': token ?? '',
          },
        }
      )
      setExito(true)
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { detalle?: string } } }
      setErrorGeneral(axiosError.response?.data?.detalle ?? 'Error al registrar el usuario.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = (field: keyof FormErrors) => ({
    backgroundColor: '#FFFFFF' as const,
    color: '#000000' as const,
    border: errores[field] ? '1px solid #E53E3E' : '1px solid #D9D9D9',
    borderRadius: '4px',
    padding: '0.5rem',
    width: '100%',
    boxSizing: 'border-box' as const,
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '0.9rem',
  })

  const labelStyle = {
    display: 'block' as const,
    color: '#000000',
    marginBottom: '0.25rem',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '0.875rem',
  }

  const errorTextStyle = {
    color: '#E53E3E',
    fontSize: '0.75rem',
    margin: '0.25rem 0 1rem 0',
    fontFamily: 'Montserrat, sans-serif',
  }

  const resetForm = () => {
    setExito(false)
    setNombre('')
    setApellido('')
    setTipoUsuario('')
    setCorreo('')
    setContrasena('')
    setSubmitted(false)
    setErrores(emptyErrors())
    setErrorGeneral('')
  }

  if (exito) {
    return (
      <div style={{ width: '100%' }}>
        <PageHeader title={titulo} />
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '2.5rem',
            maxWidth: '500px',
            margin: '2rem auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h3
            style={{
              fontFamily: 'Poppins, sans-serif',
              color: '#11823B',
              margin: '0 0 0.5rem',
            }}
          >
            ¡Registro exitoso!
          </h3>
          <p
            style={{
              fontFamily: 'Montserrat, sans-serif',
              color: '#737373',
              fontSize: '0.9rem',
              margin: '0 0 1.5rem',
            }}
          >
            El {rol === 'ORGANIZADOR' ? 'organizador' : 'árbitro'} fue registrado correctamente.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={resetForm}
              style={{
                backgroundColor: '#11823B',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                padding: '0.6rem 1.5rem',
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.875rem',
              }}
            >
              Registrar otro
            </button>
            <button
              onClick={() => navigate('/admin')}
              style={{
                backgroundColor: 'transparent',
                color: '#11823B',
                border: '1px solid #11823B',
                borderRadius: '4px',
                padding: '0.6rem 1.5rem',
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.875rem',
              }}
            >
              Volver al panel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      <PageHeader title={titulo} />

      <p
        style={{
          fontWeight: 'bold',
          fontSize: '0.9rem',
          color: '#000000',
          padding: '1rem 2rem',
          margin: 0,
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        INFORMACIÓN PERSONAL
      </p>

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          padding: '2rem',
          width: '55%',
          maxWidth: '55%',
          margin: '0 auto 2rem auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="nombre" style={labelStyle}>
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Ingrese el nombre"
            value={nombre}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
            style={inputStyle('nombre')}
          />
          {errores.nombre ? (
            <p style={errorTextStyle}>{errores.nombre}</p>
          ) : (
            <div style={{ marginBottom: '1rem' }} />
          )}

          <label htmlFor="apellido" style={labelStyle}>
            Apellido
          </label>
          <input
            id="apellido"
            type="text"
            placeholder="Ingrese el apellido"
            value={apellido}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setApellido(e.target.value)}
            style={inputStyle('apellido')}
          />
          {errores.apellido ? (
            <p style={errorTextStyle}>{errores.apellido}</p>
          ) : (
            <div style={{ marginBottom: '1rem' }} />
          )}

          <label htmlFor="tipoUsuario" style={labelStyle}>
            Tipo de Usuario
          </label>
          <select
            id="tipoUsuario"
            value={tipoUsuario}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setTipoUsuario(e.target.value)}
            style={inputStyle('tipoUsuario')}
          >
            <option value="">Selecciona el tipo de usuario</option>
            {TIPOS_USUARIO.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {errores.tipoUsuario ? (
            <p style={errorTextStyle}>{errores.tipoUsuario}</p>
          ) : (
            <div style={{ marginBottom: '1rem' }} />
          )}

          <label htmlFor="correo" style={labelStyle}>
            Correo electrónico
          </label>
          <input
            id="correo"
            type="email"
            placeholder="Ingrese el correo electrónico"
            value={correo}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCorreo(e.target.value)}
            style={inputStyle('correo')}
          />
          {errores.correo ? (
            <p style={errorTextStyle}>{errores.correo}</p>
          ) : (
            <div style={{ marginBottom: '1rem' }} />
          )}

          <label htmlFor="contrasena" style={labelStyle}>
            Contraseña
          </label>
          <input
            id="contrasena"
            type="password"
            placeholder="Ingrese la contraseña"
            value={contrasena}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setContrasena(e.target.value)}
            style={inputStyle('contrasena')}
          />
          {errores.contrasena ? (
            <p style={errorTextStyle}>{errores.contrasena}</p>
          ) : (
            <div style={{ marginBottom: '1rem' }} />
          )}

          {errorGeneral && (
            <p
              style={{
                color: '#E53E3E',
                fontSize: '0.85rem',
                textAlign: 'center',
                margin: '0 0 1rem 0',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              {errorGeneral}
            </p>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: 'transparent',
                color: '#11823B',
                border: '1px solid #11823B',
                borderRadius: '4px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isDisabled || isLoading || !adminId}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: isDisabled || isLoading || !adminId ? '#737373' : '#11823B',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.9rem',
                cursor: isDisabled || isLoading || !adminId ? 'not-allowed' : 'pointer',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              {isLoading
                ? 'Registrando...'
                : `Registrar ${rol === 'ORGANIZADOR' ? 'Organizador' : 'Árbitro'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
