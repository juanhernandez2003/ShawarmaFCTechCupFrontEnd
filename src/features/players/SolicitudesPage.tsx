import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'

interface Invitacion {
  id: string
  equipo: string
  posicion: string
  fecha: string
}

interface Popup {
  visible: boolean
  mensaje: string
}

const SolicitudesPage = () => {
  const navigate = useNavigate()
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([])
  const [popup, setPopup] = useState<Popup>({ visible: false, mensaje: '' })

  const eliminar = (id: string) => {
    setInvitaciones(prev => prev.filter(inv => inv.id !== id))
  }

  const handleAceptar = (inv: Invitacion) => {
    eliminar(inv.id)
    setPopup({ visible: true, mensaje: `✅ Invitación de ${inv.equipo} aceptada correctamente` })
  }

  const handleRechazar = (inv: Invitacion) => {
    eliminar(inv.id)
    setPopup({ visible: true, mensaje: `❌ Invitación de ${inv.equipo} rechazada` })
  }

  return (
    <div>
      <PageHeader title="SOLICITUDES" subtitle="Revisa todas tus invitaciones" />

      <div style={{ backgroundColor: '#D9D9D9', padding: '1.5rem' }}>
        {/* Lista de invitaciones */}
        {invitaciones.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ fontSize: '3rem' }}>📭</div>
            <p style={{ color: '#737373', fontSize: '1rem', marginTop: '1rem' }}>
              No tienes invitaciones pendientes
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {invitaciones.map(inv => (
              <div
                key={inv.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  padding: '1rem 1.5rem',
                  position: 'relative',
                }}
              >
                {/* Botón X */}
                <button
                  onClick={() => eliminar(inv.id)}
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>

                {/* Contenido principal */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    paddingRight: '1.5rem',
                  }}
                >
                  {/* Info */}
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>
                      <span style={{ color: '#11823B', fontWeight: 'bold' }}>{inv.equipo}</span>
                      <span style={{ color: '#000000', fontWeight: 'normal' }}>
                        {' '}
                        te ha invitado a unirte a su equipo
                      </span>
                    </p>
                    <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.85rem', color: '#737373' }}>
                      Posición solicitada: {inv.posicion}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#737373' }}>
                      Recibida el {inv.fecha}
                    </p>
                  </div>

                  {/* Botones */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      onClick={() => handleAceptar(inv)}
                      style={{
                        backgroundColor: '#11823B',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.4rem 1.2rem',
                        cursor: 'pointer',
                      }}
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => handleRechazar(inv)}
                      style={{
                        backgroundColor: '#E53E3E',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.4rem 1.2rem',
                        cursor: 'pointer',
                      }}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón volver */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1.5rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: '#737373',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              padding: '0.4rem 0.9rem',
              cursor: 'pointer',
            }}
          >
            ←
          </button>
        </div>
      </div>

      {/* Overlay + Popup */}
      {popup.visible && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 999,
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '1.5rem 2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              zIndex: 1000,
              textAlign: 'center',
              minWidth: '280px',
            }}
          >
            <p style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>{popup.mensaje}</p>
            <button
              onClick={() => setPopup({ visible: false, mensaje: '' })}
              style={{
                backgroundColor: '#11823B',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem 1.5rem',
                marginTop: '1rem',
                cursor: 'pointer',
              }}
            >
              Cerrar
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default SolicitudesPage
