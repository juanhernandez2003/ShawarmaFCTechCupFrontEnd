import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  crearTorneo,
  extractApiErrorMessage,
  type CreateTournamentPayload,
} from '../../services/organizerService'
import './organizer.css'

type CreateTournamentForm = CreateTournamentPayload

type FormErrors = Record<keyof CreateTournamentForm, string>

const defaultForm: CreateTournamentForm = {
  nombre: '',
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
  cupoEquipos: 8,
  costoInscripcion: 0,
}

const emptyErrors: FormErrors = {
  nombre: '',
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
  cupoEquipos: '',
  costoInscripcion: '',
}

const OrganizerCreateTournamentPage = () => {
  const [form, setForm] = useState<CreateTournamentForm>(defaultForm)
  const [errors, setErrors] = useState<FormErrors>(emptyErrors)
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const navigate = useNavigate()

  const validate = (): FormErrors => {
    const next = { ...emptyErrors }

    if (!form.nombre.trim()) next.nombre = 'El nombre es obligatorio.'
    if (!form.descripcion.trim()) next.descripcion = 'La descripcion es obligatoria.'
    if (!form.fechaInicio) next.fechaInicio = 'La fecha de inicio es obligatoria.'
    if (!form.fechaFin) next.fechaFin = 'La fecha de fin es obligatoria.'
    if (form.fechaInicio && form.fechaFin && form.fechaInicio > form.fechaFin) {
      next.fechaFin = 'La fecha de fin debe ser mayor o igual a la fecha de inicio.'
    }
    if (form.cupoEquipos < 2) next.cupoEquipos = 'El cupo minimo es 2 equipos.'
    if (form.costoInscripcion < 0) next.costoInscripcion = 'El costo no puede ser negativo.'

    return next
  }

  const hasErrors = (formErrors: FormErrors) =>
    Object.values(formErrors).some(value => value !== '')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formErrors = validate()
    setErrors(formErrors)
    if (hasErrors(formErrors)) return

    setLoading(true)
    setGeneralError(null)
    try {
      const tournament = await crearTorneo(form)
      navigate(`/organizador/torneos/${tournament.id}?tab=configuracion`, {
        state: {
          message: 'Torneo creado correctamente. Completa su configuracion.',
          type: 'success',
        },
      })
    } catch (error) {
      setGeneralError(extractApiErrorMessage(error, 'No se pudo crear el torneo.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="organizer-page">
      <section className="organizer-banner">
        <h1>Crear torneo</h1>
        <p>Registra la informacion base para habilitar su configuracion</p>
      </section>

      <section className="organizer-container">
        <article className="organizer-panel">
          {generalError && (
            <div className="organizer-message organizer-message-error">{generalError}</div>
          )}

          <form className="organizer-form" onSubmit={handleSubmit} noValidate>
            <div className="organizer-field">
              <label htmlFor="nombre">Nombre del torneo</label>
              <input
                id="nombre"
                value={form.nombre}
                onChange={event => setForm(prev => ({ ...prev, nombre: event.target.value }))}
                className={errors.nombre ? 'organizer-input-error' : ''}
                placeholder="Ejemplo: Copa Ingenieria 2026"
              />
              {errors.nombre && <p className="organizer-error-text">{errors.nombre}</p>}
            </div>

            <div className="organizer-field">
              <label htmlFor="descripcion">Descripcion</label>
              <textarea
                id="descripcion"
                value={form.descripcion}
                onChange={event => setForm(prev => ({ ...prev, descripcion: event.target.value }))}
                className={errors.descripcion ? 'organizer-input-error' : ''}
                placeholder="Describe formato, categoria y alcance del torneo."
              />
              {errors.descripcion && <p className="organizer-error-text">{errors.descripcion}</p>}
            </div>

            <div className="organizer-form-grid">
              <div className="organizer-field">
                <label htmlFor="fechaInicio">Fecha de inicio</label>
                <input
                  id="fechaInicio"
                  type="date"
                  value={form.fechaInicio}
                  onChange={event =>
                    setForm(prev => ({ ...prev, fechaInicio: event.target.value }))
                  }
                  className={errors.fechaInicio ? 'organizer-input-error' : ''}
                />
                {errors.fechaInicio && <p className="organizer-error-text">{errors.fechaInicio}</p>}
              </div>

              <div className="organizer-field">
                <label htmlFor="fechaFin">Fecha de fin</label>
                <input
                  id="fechaFin"
                  type="date"
                  value={form.fechaFin}
                  onChange={event => setForm(prev => ({ ...prev, fechaFin: event.target.value }))}
                  className={errors.fechaFin ? 'organizer-input-error' : ''}
                />
                {errors.fechaFin && <p className="organizer-error-text">{errors.fechaFin}</p>}
              </div>
            </div>

            <div className="organizer-form-grid">
              <div className="organizer-field">
                <label htmlFor="cupoEquipos">Cupo de equipos</label>
                <input
                  id="cupoEquipos"
                  type="number"
                  min={2}
                  value={form.cupoEquipos}
                  onChange={event =>
                    setForm(prev => ({ ...prev, cupoEquipos: Number(event.target.value) }))
                  }
                  className={errors.cupoEquipos ? 'organizer-input-error' : ''}
                />
                {errors.cupoEquipos && <p className="organizer-error-text">{errors.cupoEquipos}</p>}
              </div>

              <div className="organizer-field">
                <label htmlFor="costoInscripcion">Costo de inscripcion (COP)</label>
                <input
                  id="costoInscripcion"
                  type="number"
                  min={0}
                  value={form.costoInscripcion}
                  onChange={event =>
                    setForm(prev => ({ ...prev, costoInscripcion: Number(event.target.value) }))
                  }
                  className={errors.costoInscripcion ? 'organizer-input-error' : ''}
                />
                {errors.costoInscripcion && (
                  <p className="organizer-error-text">{errors.costoInscripcion}</p>
                )}
              </div>
            </div>

            <div className="organizer-inline-actions">
              <button
                type="submit"
                className="organizer-btn organizer-btn-primary"
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear torneo'}
              </button>
              <button
                type="button"
                className="organizer-btn organizer-btn-secondary"
                onClick={() => navigate('/organizador')}
              >
                Volver al panel
              </button>
            </div>
          </form>
        </article>
      </section>
    </div>
  )
}

export default OrganizerCreateTournamentPage
