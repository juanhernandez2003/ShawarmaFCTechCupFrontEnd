import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from './Footer'

interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const navigate = useNavigate()

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
        <span style={{ fontWeight: 'bold', color: '#11823B', fontSize: '1.1rem' }}>⚽ TECHCUP</span>

        <button
          onClick={() => navigate(-1)}
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
          ← Volver
        </button>
      </header>

      <main
        style={{
          flex: 1,
          backgroundColor: '#D9D9D9',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default AuthLayout
