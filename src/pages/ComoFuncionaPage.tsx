import { useNavigate } from 'react-router-dom'
import paso1Img from '../assets/como-funciona-paso1.png'
import paso3Img from '../assets/como-funciona-paso3.png'

const pasos = [
  {
    numero: '1',
    titulo: 'Crea tu cuenta gratis',
    descripcion: '¡Únete a nuestra comunidad en minutos!',
    imagen: paso1Img,
    imagenDerecha: false,
  },
  {
    numero: '2',
    titulo: 'Descubre las funcionalidades',
    descripcion: 'Descubre todo hacerca del torneo desde tu respectivo usuario',
    imagen: null,
    icono: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <path d="M40 8 L8 28 L8 68 L32 68 L32 48 L48 48 L48 68 L72 68 L72 28 Z" fill="#11823B" />
      </svg>
    ),
    imagenDerecha: false,
  },
  {
    numero: '3',
    titulo: 'Disfruta de todo TechCup',
    descripcion:
      'Es el torneo mas competitivo y tradicional de la universidad. ¿Estas preparado para ganar?',
    imagen: paso3Img,
    imagenDerecha: true,
  },
]

const ComoFuncionaPage = () => {
  const navigate = useNavigate()

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
          Como funciona TechCup
        </h1>
        <p
          style={{
            color: '#ffffff',
            margin: '0.5rem 0 0',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '1rem',
          }}
        >
          Únete a la comunidad de fútbol universitario más grande en solo 4 pasos simples
        </p>
      </div>

      {/* Pasos */}
      <div
        style={{
          maxWidth: '820px',
          margin: '2.5rem auto',
          padding: '0 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Paso 1 */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
          }}
        >
          <img
            src={paso1Img}
            alt="Paso 1 - Crea tu cuenta"
            style={{
              width: '220px',
              height: '140px',
              objectFit: 'cover',
              borderRadius: '8px',
              flexShrink: 0,
            }}
          />
          <div>
            <h3
              style={{
                margin: '0 0 0.4rem',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.1rem',
                color: '#000',
              }}
            >
              1. Crea tu cuenta gratis
            </h3>
            <p
              style={{
                margin: 0,
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.9rem',
                color: '#737373',
              }}
            >
              ¡Únete a nuestra comunidad en minutos!
            </p>
          </div>
        </div>

        {/* Paso 2 */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="90" height="90" viewBox="0 0 80 80" fill="none">
              <path
                d="M40 8 L8 28 L8 68 L32 68 L32 48 L48 48 L48 68 L72 68 L72 28 Z"
                fill="#11823B"
              />
            </svg>
          </div>
          <div>
            <h3
              style={{
                margin: '0 0 0.4rem',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.1rem',
                color: '#000',
              }}
            >
              2. Descubre las funcionalidades
            </h3>
            <p
              style={{
                margin: 0,
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.9rem',
                color: '#737373',
              }}
            >
              Descubre todo hacerca del torneo desde tu respectivo usuario
            </p>
          </div>
        </div>

        {/* Paso 3 */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
          }}
        >
          <div>
            <h3
              style={{
                margin: '0 0 0.4rem',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.1rem',
                color: '#000',
              }}
            >
              3. Disfruta de todo TechCup
            </h3>
            <p
              style={{
                margin: 0,
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.9rem',
                color: '#737373',
                maxWidth: '380px',
              }}
            >
              Es el torneo mas competitivo y tradicional de la universidad. ¿Estas preparado para
              ganar?
            </p>
          </div>
          <img
            src={paso3Img}
            alt="Paso 3 - Disfruta TechCup"
            style={{
              width: '220px',
              height: '140px',
              objectFit: 'cover',
              borderRadius: '8px',
              flexShrink: 0,
            }}
          />
        </div>
      </div>

      {/* Botón volver */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          maxWidth: '820px',
          margin: '0 auto 2rem',
          padding: '0 1.5rem',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: '#737373',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.6rem 1.5rem',
            cursor: 'pointer',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.9rem',
          }}
        >
          ←
        </button>
      </div>
    </div>
  )
}

export default ComoFuncionaPage
