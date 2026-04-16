import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* HERO */}
      <div
        style={{
          position: 'relative',
          minHeight: '420px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: '#0a1a0a',
        }}
      >
        {/* Fondo estadio simulado con gradientes */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 50% 120%, #11823B44 0%, transparent 60%),
              radial-gradient(ellipse at 20% 80%, #ffffff08 0%, transparent 40%),
              radial-gradient(ellipse at 80% 80%, #ffffff08 0%, transparent 40%),
              linear-gradient(180deg, #0a1a0a 0%, #0d2d10 40%, #0a1a0a 100%)
            `,
          }}
        />

        {/* Líneas de cancha decorativas */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '200px',
            border: '2px solid rgba(255,255,255,0.08)',
            borderBottom: 'none',
            borderRadius: '300px 300px 0 0',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '2px',
            height: '100%',
            backgroundColor: 'rgba(255,255,255,0.05)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '80px',
            border: '2px solid rgba(255,255,255,0.08)',
            borderRadius: '50%',
          }}
        />

        {/* Luces del estadio */}
        {['-20%', '120%'].map((left, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '-10%',
              left,
              width: '300px',
              height: '300px',
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Pelota */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '2.5rem',
            opacity: 0.6,
          }}
        >
          ⚽
        </div>

        {/* Contenido hero */}
        <div style={{ position: 'relative', zIndex: 1, padding: '4rem 3rem', maxWidth: '600px' }}>
          <h1
            style={{
              margin: '0 0 1rem',
              fontSize: '3.5rem',
              fontWeight: '900',
              fontFamily: 'Poppins, sans-serif',
              lineHeight: 1.1,
              color: '#ffffff',
            }}
          >
            <span style={{ color: '#ffffff' }}>Tech</span>
            <span style={{ color: '#11823B' }}>Cup</span>
          </h1>
          <p
            style={{
              margin: '0 0 1rem',
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: '400',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            La plataforma definitiva para gestionar el torneo universitario.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.6)',
              fontStyle: 'italic',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            "Crea equipos. Compite. Domina el campo"
          </p>
        </div>
      </div>

      {/* SECCIÓN INFORMACIÓN DEPORTIVA */}
      <div style={{ backgroundColor: '#f5f5f5', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p
            style={{
              margin: '0 0 0.25rem',
              fontSize: '0.8rem',
              color: '#11823B',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Panel de control
          </p>
          <h2
            style={{
              margin: '0 0 1.5rem',
              fontSize: '1.8rem',
              fontWeight: '900',
              fontFamily: 'Poppins, sans-serif',
              color: '#000000',
            }}
          >
            INFORMACION <span style={{ color: '#11823B' }}>DEPORTIVA</span>
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '0.95rem',
              color: '#444',
              lineHeight: 1.8,
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            TechCup es la plataforma universitaria diseñada para gestionar torneos de fútbol de
            principio a fin. Desde la creación de equipos y la inscripción de jugadores, hasta el
            seguimiento de partidos y resultados, TechCup pone todo el control en tus manos. Pensada
            para estudiantes y organizadores, hace que competir sea más fácil, más justo y más
            emocionante.
          </p>
        </div>
      </div>

      {/* SECCIÓN TU CAMINO A LA GLORIA */}
      <div style={{ backgroundColor: '#ffffff', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p
            style={{
              margin: '0 0 0.25rem',
              fontSize: '0.8rem',
              color: '#11823B',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Proceso
          </p>
          <h2
            style={{
              margin: '0 0 2rem',
              fontSize: '1.8rem',
              fontWeight: '900',
              fontFamily: 'Poppins, sans-serif',
              color: '#000000',
            }}
          >
            TU CAMINO A LA <span style={{ color: '#11823B' }}>GLORIA</span>
          </h2>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Tarjeta Regístrate */}
            <div
              onClick={() => navigate('/registro')}
              style={{
                flex: 1,
                minWidth: '200px',
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '2rem 1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem',
                transition: 'box-shadow 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 4px 16px rgba(17,130,59,0.15)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#f0f9f4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '1.5rem',
                }}
              >
                👤
              </div>
              <div>
                <h3
                  style={{
                    margin: '0 0 0.4rem',
                    fontSize: '0.95rem',
                    fontWeight: 'bold',
                    fontFamily: 'Poppins, sans-serif',
                    color: '#000',
                  }}
                >
                  REGÍSTRATE
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.82rem',
                    color: '#737373',
                    fontFamily: 'Montserrat, sans-serif',
                    lineHeight: 1.5,
                  }}
                >
                  Crea tu perfil de jugador y accede al panel.
                </p>
              </div>
            </div>

            {/* Tarjeta Inicia Sesión */}
            <div
              onClick={() => navigate('/login')}
              style={{
                flex: 1,
                minWidth: '200px',
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '2rem 1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem',
                transition: 'box-shadow 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 4px 16px rgba(17,130,59,0.15)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#f0f9f4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '1.5rem',
                }}
              >
                🏆
              </div>
              <div>
                <h3
                  style={{
                    margin: '0 0 0.4rem',
                    fontSize: '0.95rem',
                    fontWeight: 'bold',
                    fontFamily: 'Poppins, sans-serif',
                    color: '#000',
                  }}
                >
                  INICIA SESIÓN
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.82rem',
                    color: '#737373',
                    fontFamily: 'Montserrat, sans-serif',
                    lineHeight: 1.5,
                  }}
                >
                  Participa en torneos y sigue tus estadísticas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
