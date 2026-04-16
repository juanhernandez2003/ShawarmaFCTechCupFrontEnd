import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import logo from '../../assets/logo.png'

interface PublicLayoutProps {
  children: ReactNode
}

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Torneos', to: '/torneos' },
  { label: 'Cómo funciona', to: '/como-funciona' },
  { label: 'Contacto', to: '/contacto' },
]

const PublicLayout = ({ children }: PublicLayoutProps) => {
  const navigate = useNavigate()
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header
        style={{
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #D9D9D9',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        <img src={logo} alt="TechCup" style={{ height: '100px', objectFit: 'contain' }} />

        <nav style={{ display: 'flex', gap: '2rem' }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onMouseEnter={() => setHoveredLink(link.to)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                color: hoveredLink === link.to ? '#11823B' : '#000000',
                textDecoration: 'none',
                fontSize: '0.95rem',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              border: '1px solid #737373',
              color: '#737373',
              backgroundColor: 'transparent',
              padding: '6px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate('/registro')}
            style={{
              backgroundColor: '#11823B',
              color: '#ffffff',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Registrarse
          </button>
        </div>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <Footer />
    </div>
  )
}

export default PublicLayout
