import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import logo from '../../assets/logo.png'
import useAuthStore from '../../store/authStore'

interface PublicLayoutProps {
  children: ReactNode
}

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Torneos', to: '/torneos' },
  { label: 'Cómo funciona', to: '/como-funciona' },
  { label: 'Contacto', to: '/contacto' },
]

const getInitials = (nombre: string): string => {
  const parts = nombre.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  const navigate = useNavigate()
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const user = useAuthStore(state => state.user)
  const token = useAuthStore(state => state.token)
  const isLoggedIn = !!token

  const handleLogout = () => {
    useAuthStore.getState().logout()
    navigate('/')
  }

  const initials = user ? getInitials(user.correo) : '?'
  const rol = user ? user.rol : ''

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

        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#11823B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <span
              style={{
                backgroundColor: '#11823B',
                color: '#ffffff',
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
              }}
            >
              {rol}
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#11823B',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                marginLeft: '0.5rem',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
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
        )}
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <Footer />
    </div>
  )
}

export default PublicLayout
