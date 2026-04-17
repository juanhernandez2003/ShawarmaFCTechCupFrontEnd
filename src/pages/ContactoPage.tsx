import { useState, type ChangeEvent, type FormEvent } from 'react'

const ContactoPage = () => {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Por ahora solo simula el envío
    setEnviado(true)
    setTimeout(() => setEnviado(false), 3000)
    setNombre('')
    setApellido('')
    setCorreo('')
    setMensaje('')
  }

  const inputStyle = {
    width: '100%',
    border: '1px solid #D9D9D9',
    borderRadius: '4px',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    fontFamily: 'Montserrat, sans-serif',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    boxSizing: 'border-box' as const,
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Banner */}
      <div
        style={{
          backgroundColor: '#11823B',
          padding: '2.5rem 2rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            color: '#ffffff',
            margin: 0,
            fontSize: '2.4rem',
            fontWeight: 'bold',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Contacto
        </h1>
        <p
          style={{
            color: '#ffffff',
            margin: '0.5rem 0 0',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '1rem',
          }}
        >
          ¿Tienes preguntas? Estamos aquí para ayudarte
        </p>
      </div>

      {/* Contenido */}
      <div
        style={{
          maxWidth: '900px',
          margin: '2.5rem auto',
          padding: '0 1.5rem',
          display: 'flex',
          gap: '2rem',
          alignItems: 'flex-start',
        }}
      >
        {/* Panel izquierdo — Información */}
        <div
          style={{
            flex: '0 0 320px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
          }}
        >
          <h3
            style={{
              margin: '0 0 0.5rem',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.1rem',
              color: '#000',
            }}
          >
            Informacion de Contacto
          </h3>
          <p
            style={{
              margin: '0 0 1.5rem',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.85rem',
              color: '#737373',
            }}
          >
            Ponte en contacto con nosotros para cualquier consulta sobre torneos, equipos o la
            plataforma TechCup.
          </p>

          {/* Correo */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>✉️</span>
            <div>
              <p
                style={{
                  margin: '0 0 0.25rem',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: '#000',
                }}
              >
                Correo Electronico
              </p>
              <a
                href="mailto:info@techcup.com"
                style={{
                  display: 'block',
                  color: '#11823B',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                }}
              >
                info@techcup.com
              </a>
              <a
                href="mailto:soporte@techcup.com"
                style={{
                  display: 'block',
                  color: '#11823B',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                }}
              >
                soporte@techcup.com
              </a>
            </div>
          </div>

          {/* Teléfono */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.4rem', flexShrink: 0 }}></span>
            <div>
              <p
                style={{
                  margin: '0 0 0.25rem',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: '#000',
                }}
              >
                Teléfono
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.85rem',
                  color: '#737373',
                }}
              >
                +57 1234567890
              </p>
            </div>
          </div>

          {/* Ubicación */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>📍</span>
            <div>
              <p
                style={{
                  margin: '0 0 0.25rem',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: '#000',
                }}
              >
                Ubicación
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.85rem',
                  color: '#737373',
                }}
              >
                Universidad Escuela Colombiana de Ingeniería Julio Garavito
              </p>
            </div>
          </div>
        </div>

        {/* Panel derecho — Formulario */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
          }}
        >
          <h3
            style={{
              margin: '0 0 1.5rem',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.1rem',
              color: '#000',
            }}
          >
            Envianos un Mensaje
          </h3>

          <form onSubmit={handleSubmit} noValidate>
            <label
              htmlFor="nombre"
              style={{
                display: 'block',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.875rem',
                color: '#000',
                marginBottom: '0.25rem',
              }}
            >
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              placeholder="Ingrese su nombre"
              value={nombre}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
              style={{ ...inputStyle, marginBottom: '1rem' }}
            />

            <label
              htmlFor="apellido"
              style={{
                display: 'block',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.875rem',
                color: '#000',
                marginBottom: '0.25rem',
              }}
            >
              Apellido
            </label>
            <input
              id="apellido"
              type="text"
              placeholder="Ingrese su apellido"
              value={apellido}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setApellido(e.target.value)}
              style={{ ...inputStyle, marginBottom: '1rem' }}
            />

            <label
              htmlFor="correo"
              style={{
                display: 'block',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.875rem',
                color: '#000',
                marginBottom: '0.25rem',
              }}
            >
              Correo Electronico
            </label>
            <input
              id="correo"
              type="email"
              placeholder="Ingrese su correo"
              value={correo}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCorreo(e.target.value)}
              style={{ ...inputStyle, marginBottom: '1rem' }}
            />

            <label
              htmlFor="mensaje"
              style={{
                display: 'block',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.875rem',
                color: '#000',
                marginBottom: '0.25rem',
              }}
            >
              Mensaje
            </label>
            <textarea
              id="mensaje"
              placeholder="Ingrese su mensaje"
              value={mensaje}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMensaje(e.target.value)}
              rows={4}
              style={{
                ...inputStyle,
                marginBottom: '1.25rem',
                resize: 'vertical',
              }}
            />

            {enviado && (
              <p
                style={{
                  color: '#11823B',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.875rem',
                  margin: '0 0 1rem',
                  textAlign: 'center',
                }}
              >
                Mensaje enviado correctamente
              </p>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.95rem',
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactoPage
