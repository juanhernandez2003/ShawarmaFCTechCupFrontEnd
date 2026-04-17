import React from 'react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'

const pasos = ['Pendiente', 'En revisión', 'Aprobado', 'Rechazado']
const pasoActivo = 0

const PagosPage = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null)

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0]
    if (archivo) setArchivoSeleccionado(archivo)
  }

  const handleDescartar = () => {
    setArchivoSeleccionado(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div>
      <PageHeader
        title="Inscripción y pagos"
        subtitle="Completa el proceso de inscripción de tu equipo de torneo"
      />

      <div style={{ backgroundColor: '#D9D9D9', padding: '1.5rem' }}>
        {/* Card Información del Torneo */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <p style={{ fontWeight: 'bold', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
            🏆 Información del Torneo
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
            }}
          >
            {[
              { label: 'Torneo', valor: '--' },
              { label: 'Fechas', valor: '--' },
              { label: 'Costo por equipo', valor: '--' },
              { label: 'Métodos de pago', valor: '--' },
            ].map(({ label, valor }) => (
              <div key={label}>
                <p style={{ fontSize: '0.75rem', color: '#737373', margin: '0 0 0.25rem 0' }}>
                  {label}
                </p>
                <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#000000', margin: 0 }}>
                  {valor}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Fila de 2 cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Card Estado del Pago */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ fontWeight: 'bold', fontSize: '0.9rem', margin: '0 0 0.75rem 0' }}>
              📅 Estado del Pago
            </p>
            <p
              style={{
                fontSize: '0.8rem',
                color: '#737373',
                margin: '0 0 1rem 0',
                lineHeight: 1.6,
              }}
            >
              Aquí puedes hacer seguimiento del proceso de revisión de tu pago. Una vez subas el
              comprobante, el organizador lo revisará y actualizará el estado de tu inscripción.
            </p>

            {/* Barra de progreso */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
              {pasos.map((paso, i) => (
                <div key={paso} style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: i === pasoActivo ? '#11823B' : '#D9D9D9',
                        color: i === pasoActivo ? 'white' : '#737373',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>
                    <span style={{ fontSize: '0.7rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {paso}
                    </span>
                  </div>
                  {i < pasos.length - 1 && (
                    <div
                      style={{
                        height: '2px',
                        backgroundColor: '#D9D9D9',
                        width: '2rem',
                        marginTop: '13px',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card Subir Comprobante */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem' }}>
            <p style={{ fontWeight: 'bold', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
              ⬆ Subir Comprobante de Pago
            </p>

            <div
              style={{
                border: '2px dashed #D9D9D9',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <span style={{ fontSize: '2.5rem', color: '#D9D9D9' }}>☁️</span>
              <p style={{ fontSize: '0.85rem', color: '#737373', margin: 0 }}>
                Arrastra tu comprobante aquí o haz clic para seleccionar
              </p>
              <p style={{ fontSize: '0.75rem', color: '#A0A0A0', margin: 0 }}>
                Formatos aceptados: JPG, PNG — Máximo 5MB
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={handleArchivoChange}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%',
                backgroundColor: '#11823B',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.6rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                marginTop: '1rem',
              }}
            >
              {archivoSeleccionado ? 'Confirmar subida' : 'Subir Comprobante'}
            </button>

            {archivoSeleccionado && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                }}
              >
                <span style={{ fontSize: '0.8rem', color: '#11823B', fontWeight: 'bold' }}>
                  {archivoSeleccionado.name}
                </span>
                <button
                  onClick={handleDescartar}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#E53E3E',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  ✕ Descartar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Botón volver */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1.5rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: '#737373',
              color: 'white',
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
    </div>
  )
}

export default PagosPage
