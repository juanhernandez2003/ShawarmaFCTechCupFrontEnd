import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout'
import PageHeader from '../components/common/PageHeader'
import apiClient from '../services/apiClient'

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

const getDominioHint = (tipo: string): string => {
  if (tipo === 'FAMILIAR') return 'Debe usar un correo @gmail.com'
  if (tipo) return 'Debe usar un correo @escuelaing.edu.co o @mail.escuelaing.edu.co'
  return ''
}

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
    errors.tipoUsuario = 'Por favor selecciona tu tipo de usuario.'
  }

  if (!correo.trim()) {
    errors.correo = 'El correo es obligatorio.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
    errors.correo = 'Ingrese un correo electrónico válido.'
  } else if (tipoUsuario === 'FAMILIAR' && !correo.endsWith('@gmail.com')) {
    errors.correo = 'Los familiares deben usar un correo @gmail.com.'
  } else if (
    tipoUsuario &&
    tipoUsuario !== 'FAMILIAR' &&
    !correo.endsWith('@escuelaing.edu.co') &&
    !correo.endsWith('@mail.escuelaing.edu.co')
  ) {
    errors.correo = 'Debe usar un correo @escuelaing.edu.co o @mail.escuelaing.edu.co.'
  }

  if (!contrasena) {
    errors.contrasena = 'La contraseña es obligatoria.'
  } else if (contrasena.length < 8) {
    errors.contrasena = 'La contraseña debe tener al menos 8 caracteres.'
  } else if (!/[A-Z]/.test(contrasena)) {
    errors.contrasena = 'La contraseña debe contener al menos una mayúscula.'
  } else if (!/[!#=_*]/.test(contrasena)) {
    errors.contrasena = 'La contraseña debe contener al menos un símbolo especial (! # = _ *).'
  }

  return errors
}

function hasErrors(errors: FormErrors): boolean {
  return Object.values(errors).some(v => v !== '')
}

export default function RegisterPage() {
  const [nombre, setNombre] = useState<string>('')
  const [apellido, setApellido] = useState<string>('')
  const [tipoUsuario, setTipoUsuario] = useState<string>('')
  const [correo, setCorreo] = useState<string>('')
  const [contrasena, setContrasena] = useState<string>('')
  const [errores, setErrores] = useState<FormErrors>(emptyErrors())
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorGeneral, setErrorGeneral] = useState<string>('')

  const navigate = useNavigate()

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

    setIsLoading(true)
    setErrorGeneral('')

    try {
      await apiClient.post('/api/users/players', {
        nombre: nombre.trim() + ' ' + apellido.trim(),
        email: correo,
        password: contrasena,
        tipoUsuario,
      })
      navigate('/login')
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { detalle?: string } } }
      setErrorGeneral(axiosError.response?.data?.detalle ?? 'Error al crear la cuenta.')
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
  })

  const labelStyle = {
    display: 'block' as const,
    color: '#000000',
    marginBottom: '0.25rem',
    fontFamily: 'Montserrat, sans-serif',
  }

  const errorTextStyle = {
    color: '#E53E3E',
    fontSize: '0.75rem',
    margin: '0.25rem 0 1rem 0',
  }

  return (
    <AuthLayout>
      <PageHeader title="Registro Jugador" />

      <p
        style={{
          fontWeight: 'bold',
          fontSize: '0.9rem',
          color: '#000000',
          padding: '1rem 2rem',
          margin: 0,
        }}
      >
        INFORMACION PERSONAL
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
            placeholder="Ingrese su nombre"
            value={nombre}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
            style={inputStyle('nombre')}
          />
          {errores.nombre && <p style={errorTextStyle}>{errores.nombre}</p>}
          {!errores.nombre && <div style={{ marginBottom: '1rem' }} />}

          <label htmlFor="apellido" style={labelStyle}>
            Apellido
          </label>
          <input
            id="apellido"
            type="text"
            placeholder="Ingrese su apellido"
            value={apellido}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setApellido(e.target.value)}
            style={inputStyle('apellido')}
          />
          {errores.apellido && <p style={errorTextStyle}>{errores.apellido}</p>}
          {!errores.apellido && <div style={{ marginBottom: '1rem' }} />}

          <label htmlFor="tipoUsuario" style={labelStyle}>
            Tipo de Usuario
          </label>
          <select
            id="tipoUsuario"
            value={tipoUsuario}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setTipoUsuario(e.target.value)}
            style={inputStyle('tipoUsuario')}
          >
            <option value="">Selecciona tu tipo de usuario</option>
            {TIPOS_USUARIO.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {errores.tipoUsuario && <p style={errorTextStyle}>{errores.tipoUsuario}</p>}
          {!errores.tipoUsuario && tipoUsuario && (
            <p
              style={{
                fontSize: '0.75rem',
                color: '#737373',
                margin: '0.25rem 0 1rem 0',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              {getDominioHint(tipoUsuario)}
            </p>
          )}
          {!errores.tipoUsuario && !tipoUsuario && <div style={{ marginBottom: '1rem' }} />}

          <label htmlFor="correo" style={labelStyle}>
            Correo Institucional
          </label>
          <input
            id="correo"
            type="email"
            placeholder="Ingrese su correo institucional"
            value={correo}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCorreo(e.target.value)}
            style={inputStyle('correo')}
          />
          {errores.correo && <p style={errorTextStyle}>{errores.correo}</p>}
          {!errores.correo && <div style={{ marginBottom: '1rem' }} />}

          <label htmlFor="contrasena" style={labelStyle}>
            Contraseña
          </label>
          <input
            id="contrasena"
            type="password"
            placeholder="Ingrese su contraseña"
            value={contrasena}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setContrasena(e.target.value)}
            style={inputStyle('contrasena')}
          />
          {errores.contrasena && <p style={errorTextStyle}>{errores.contrasena}</p>}
          {!errores.contrasena && <div style={{ marginBottom: '1rem' }} />}

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
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
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
          <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
        </p>
      </div>
    </AuthLayout>
  )
}
