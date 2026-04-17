import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import {
  buscarJugadores,
  enviarInvitacion,
  type PerfilDeportivo,
} from '../../services/capitanService'
import useAuthStore from '../../store/authStore'
import { obtenerEquipoDelCapitan } from '../../services/teamService'

const BuscarJugadoresPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)

  const [nombre, setNombre] = useState('')
  const [posicion, setPosicion] = useState('')
  const [semestre, setSemestre] = useState('')
  const [genero, setGenero] = useState('')
  const [edad, setEdad] = useState('')

  const [equipoId, setEquipoId] = useState('')
  const [resultados, setResultados] = useState<PerfilDeportivo[]>([])
  const [buscando, setBuscando] = useState(false)
  const [errorBusqueda, setErrorBusqueda] = useState('')

  useEffect(() => {
    obtenerEquipoDelCapitan(user?.correo ?? '').then(equipo => {
      if (equipo) setEquipoId(equipo.id)
    })
  }, [user?.correo])

  const handleBuscar = useCallback(async () => {
    setBuscando(true)
    setErrorBusqueda('')
    try {
      const data = await buscarJugadores(user?.correo ?? '', {
        posicion,
        semestre,
        genero,
        edad,
        nombre: nombre || undefined,
      })
      setResultados(data)
    } catch {
      setErrorBusqueda('Error al buscar jugadores')
    } finally {
      setBuscando(false)
    }
  }, [user?.correo, posicion, semestre, genero, edad, nombre])

  const limpiarFiltros = () => {
    setNombre('')
    setPosicion('')
    setSemestre('')
    setGenero('')
    setEdad('')
    setResultados([])
    setErrorBusqueda('')
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.85rem',
    marginBottom: '0.25rem',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #D9D9D9',
    borderRadius: '4px',
    fontSize: '0.85rem',
    marginBottom: '1rem',
    boxSizing: 'border-box',
  }

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #D9D9D9',
    borderRadius: '4px',
    fontSize: '0.85rem',
    marginBottom: '1rem',
    backgroundColor: 'white',
    boxSizing: 'border-box',
  }

  return (
    <div>
      <PageHeader
        title="Buscar jugadores"
        subtitle="Encuentra jugadores disponibles para tu equipo"
      />

      <div style={{ backgroundColor: '#D9D9D9', padding: '1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Columna izquierda — Filtros */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <p
              style={{
                fontWeight: 'bold',
                fontSize: '0.95rem',
                marginBottom: '1rem',
                margin: '0 0 1rem 0',
              }}
            >
              Filtros
            </p>

            <div>
              <label style={labelStyle}>Buscar por nombre</label>
              <input
                type="text"
                placeholder="ingresa un nombre"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Posición</label>
              <select
                value={posicion}
                onChange={e => setPosicion(e.target.value)}
                style={selectStyle}
              >
                <option value="">Todos</option>
                <option value="PORTERO">PORTERO</option>
                <option value="DEFENSA">DEFENSA</option>
                <option value="VOLANTE">VOLANTE</option>
                <option value="DELANTERO">DELANTERO</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Semestre</label>
              <select
                value={semestre}
                onChange={e => setSemestre(e.target.value)}
                style={selectStyle}
              >
                <option value="">Todos</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(s => (
                  <option key={s} value={String(s)}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Género</label>
              <select value={genero} onChange={e => setGenero(e.target.value)} style={selectStyle}>
                <option value="">Todos</option>
                <option value="MASCULINO">MASCULINO</option>
                <option value="FEMENINO">FEMENINO</option>
                <option value="OTRO">OTRO</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Edad</label>
              <select value={edad} onChange={e => setEdad(e.target.value)} style={selectStyle}>
                <option value="">Todos</option>
                <option value="18-20">18-20</option>
                <option value="21-25">21-25</option>
                <option value="26-30">26-30</option>
                <option value="30+">30+</option>
              </select>
            </div>

            <button
              onClick={handleBuscar}
              style={{
                width: '100%',
                backgroundColor: '#11823B',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.6rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                marginTop: '0.5rem',
              }}
            >
              Buscar
            </button>

            <button
              onClick={limpiarFiltros}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                color: '#11823B',
                border: '1px solid #11823B',
                borderRadius: '4px',
                padding: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                marginTop: '0.5rem',
              }}
            >
              Limpiar filtros
            </button>
          </div>

          {/* Columna derecha — Resultados */}
          <div>
            <p
              style={{
                fontWeight: 'bold',
                fontSize: '0.95rem',
                marginBottom: '1rem',
                margin: '0 0 1rem 0',
              }}
            >
              Jugadores según el filtro
            </p>

            {buscando && (
              <p style={{ textAlign: 'center', color: '#737373', marginTop: '2rem' }}>
                Buscando jugadores...
              </p>
            )}

            {!buscando && errorBusqueda && (
              <p style={{ textAlign: 'center', color: '#E53E3E', marginTop: '2rem' }}>
                {errorBusqueda}
              </p>
            )}

            {!buscando && !errorBusqueda && resultados.length === 0 && (
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '300px',
                }}
              >
                <span style={{ fontSize: '4rem', color: '#D9D9D9' }}>👤</span>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: '#737373',
                    textAlign: 'center',
                    marginTop: '1rem',
                    maxWidth: '300px',
                  }}
                >
                  Encuentra jugadores disponibles y añádelos a tu equipo según posición, semestre,
                  género y edad
                </p>
              </div>
            )}

            {!buscando && resultados.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {resultados.map(jugador => (
                  <div
                    key={jugador.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#D9D9D9',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p
                        style={{ fontWeight: 'bold', fontSize: '0.85rem', margin: '0 0 0.25rem 0' }}
                      >
                        {jugador.jugadorId}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#737373', margin: 0 }}>
                        {jugador.posiciones.join(', ')} · Dorsal {jugador.dorsal} · Semestre{' '}
                        {jugador.semestre} · {jugador.genero} · {jugador.edad} años
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        if (!equipoId) {
                          alert('❌ No tienes un equipo registrado')
                          return
                        }
                        try {
                          await enviarInvitacion(
                            jugador.jugadorId,
                            equipoId,
                            jugador.posiciones[0] ?? 'DELANTERO'
                          )
                          alert('✅ Invitación enviada correctamente')
                        } catch {
                          alert('❌ Error al enviar la invitación')
                        }
                      }}
                      style={{
                        backgroundColor: '#11823B',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      Invitar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Botón volver */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
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

export default BuscarJugadoresPage
