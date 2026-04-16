import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePickerInput from '../../components/common/DatePickerInput'
import {
  crearTorneo,
  extractApiErrorMessage,
  type TournamentStatus,
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
  cupoEquipos: 16,
  costoInscripcion: 0,
  estado: 'BORRADOR',
}

const emptyErrors: FormErrors = {
  nombre: '',
  fechaInicio: '',
  fechaFin: '',
  cupoEquipos: '',
  costoInscripcion: '',
  descripcion: '',
  estado: '',
}

const OrganizerCreateTournamentPage = () => {
  const [form, setForm] = useState<CreateTournamentForm>(defaultForm)
  const [errors, setErrors] = useState<FormErrors>(emptyErrors)
  const [loadingAction, setLoadingAction] = useState<'create' | 'draft' | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const navigate = useNavigate()

  const validate = (): FormErrors => {
    const next = { ...emptyErrors }

    if (!form.nombre.trim()) next.nombre = 'El nombre es obligatorio.'
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

  const submitTournament = async (action: 'create' | 'draft') => {
    const formErrors = validate()
    setErrors(formErrors)
    if (hasErrors(formErrors)) return

    setLoadingAction(action)
    setGeneralError(null)

    const targetStatus: TournamentStatus = action === 'draft' ? 'BORRADOR' : 'CONFIGURADO'

    try {
      const tournament = await crearTorneo({ ...form, estado: targetStatus })

      if (action === 'draft') {
        navigate('/organizador', {
          state: {
            message: 'Torneo guardado como borrador correctamente.',
            type: 'success',
          },
        })
      } else {
        navigate(`/organizador/torneos/${tournament.id}?tab=configuracion`, {
          state: {
            message: 'Torneo creado correctamente. Completa su configuracion.',
            type: 'success',
          },
        })
      }
    } catch (error) {
      setGeneralError(extractApiErrorMessage(error, 'No se pudo crear el torneo.'))
    } finally {
      setLoadingAction(null)
    }
  }

  const handleCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submitTournament('create')
  }

  return (
    <div className="organizer-page">
      <section className="organizer-banner">
        <h1>Crear torneo</h1>
        <p>Elija las configuraciones iniciales de su torneo</p>
      </section>

      <section className="organizer-container">
        <article className="organizer-panel organizer-create-panel">
          {generalError && (
            <div className="organizer-message organizer-message-error">{generalError}</div>
          )}

          <form
            className="organizer-form organizer-create-form"
            onSubmit={handleCreateSubmit}
            noValidate
          >
            <div className="organizer-field">
              <label htmlFor="nombre">Nombre del torneo</label>
              <input
                id="nombre"
                value={form.nombre}
                onChange={event => setForm(prev => ({ ...prev, nombre: event.target.value }))}
                className={errors.nombre ? 'organizer-input-error' : ''}
                placeholder="Ej. Torneo Sistemas 2026"
              />
              {errors.nombre && <p className="organizer-error-text">{errors.nombre}</p>}
            </div>

            <div className="organizer-form-grid organizer-create-grid">
              <div className="organizer-field">
                <label htmlFor="fechaInicio">Fecha inicial</label>
                <DatePickerInput
                  id="fechaInicio"
                  value={form.fechaInicio}
                  onChange={value => setForm(prev => ({ ...prev, fechaInicio: value }))}
                  hasError={Boolean(errors.fechaInicio)}
                  placeholder="mm/dd/yyyy"
                />
                {errors.fechaInicio && <p className="organizer-error-text">{errors.fechaInicio}</p>}
              </div>

              <div className="organizer-field">
                <label htmlFor="fechaFin">Fecha final</label>
                <DatePickerInput
                  id="fechaFin"
                  value={form.fechaFin}
                  onChange={value => setForm(prev => ({ ...prev, fechaFin: value }))}
                  hasError={Boolean(errors.fechaFin)}
                  placeholder="mm/dd/yyyy"
                />
                {errors.fechaFin && <p className="organizer-error-text">{errors.fechaFin}</p>}
              </div>
            </div>

            <div className="organizer-form-grid organizer-create-grid">
              <div className="organizer-field">
                <label htmlFor="cupoEquipos">Cantidad de equipos</label>
                <input
                  id="cupoEquipos"
                  type="number"
                  min={2}
                  value={form.cupoEquipos}
                  onChange={event =>
                    setForm(prev => ({ ...prev, cupoEquipos: Number(event.target.value) }))
                  }
                  className={errors.cupoEquipos ? 'organizer-input-error' : ''}
                  placeholder="Ej. 16"
                />
                {errors.cupoEquipos && <p className="organizer-error-text">{errors.cupoEquipos}</p>}
              </div>

              <div className="organizer-field">
                <label htmlFor="costoInscripcion">Costo por equipo</label>
                <input
                  id="costoInscripcion"
                  type="number"
                  min={0}
                  value={form.costoInscripcion}
                  onChange={event =>
                    setForm(prev => ({ ...prev, costoInscripcion: Number(event.target.value) }))
                  }
                  className={errors.costoInscripcion ? 'organizer-input-error' : ''}
                  placeholder="150000"
                />
                {errors.costoInscripcion && (
                  <p className="organizer-error-text">{errors.costoInscripcion}</p>
                )}
              </div>
            </div>

            <div className="organizer-field">
              <label htmlFor="estado">Estado</label>
              <input id="estado" value="Borrador" readOnly />
            </div>

            <div className="organizer-field">
              <label htmlFor="descripcion">Descripcion</label>
              <textarea
                id="descripcion"
                value={form.descripcion}
                onChange={event => setForm(prev => ({ ...prev, descripcion: event.target.value }))}
                className={errors.descripcion ? 'organizer-input-error' : ''}
                placeholder="Detalles adicionales sobre el torneo..."
              />
              {errors.descripcion && <p className="organizer-error-text">{errors.descripcion}</p>}
            </div>

            <div className="organizer-inline-actions organizer-create-actions">
              <button
                type="button"
                className="organizer-btn organizer-btn-link"
                onClick={() => void submitTournament('draft')}
                disabled={loadingAction !== null}
              >
                {loadingAction === 'draft' ? 'Guardando...' : 'Guardar como borrador'}
              </button>

              <button
                type="submit"
                className="organizer-btn organizer-btn-primary organizer-create-submit"
                disabled={loadingAction !== null}
              >
                {loadingAction === 'create' ? 'Creando...' : 'Crear torneo'}
              </button>
            </div>
          </form>
        </article>
      </section>
    </div>
  )
}

export default OrganizerCreateTournamentPage
