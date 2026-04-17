import { useEffect, useRef, useState } from 'react'
import './dateTimePicker.css'

interface TimePickerInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hasError?: boolean
  disabled?: boolean
}

const pad = (value: number) => String(value).padStart(2, '0')

const parseTime = (value: string) => {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value)
  if (!match) return null
  return { hour24: Number(match[1]), minute: Number(match[2]) }
}

const toDisplayTime = (value: string) => {
  const parsed = parseTime(value)
  if (!parsed) return ''
  const period = parsed.hour24 >= 12 ? 'PM' : 'AM'
  const hour12 = parsed.hour24 % 12 === 0 ? 12 : parsed.hour24 % 12
  return `${pad(hour12)}:${pad(parsed.minute)} ${period}`
}

const toDraftValues = (value: string) => {
  const parsed = parseTime(value)
  if (!parsed) return { hour: '12', minute: '00', period: 'AM' as const }
  const period = parsed.hour24 >= 12 ? 'PM' : 'AM'
  const hour12 = parsed.hour24 % 12 === 0 ? 12 : parsed.hour24 % 12
  return { hour: String(hour12), minute: pad(parsed.minute), period }
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export default function TimePickerInput({
  id,
  value,
  onChange,
  placeholder = 'Seleccionar hora',
  hasError = false,
  disabled = false,
}: TimePickerInputProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [draftHour, setDraftHour] = useState('12')
  const [draftMinute, setDraftMinute] = useState('00')
  const [draftPeriod, setDraftPeriod] = useState<'AM' | 'PM'>('AM')

  useEffect(() => {
    if (!isOpen) return
    const handler = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  const openPicker = () => {
    const initial = toDraftValues(value)
    setDraftHour(initial.hour)
    setDraftMinute(initial.minute)
    setDraftPeriod(initial.period)
    setIsOpen(true)
  }

  const save = () => {
    const hour12 = clamp(Number(draftHour) || 12, 1, 12)
    const minute = clamp(Number(draftMinute) || 0, 0, 59)
    const hour24 = draftPeriod === 'AM' ? hour12 % 12 : (hour12 % 12) + 12
    onChange(`${pad(hour24)}:${pad(minute)}`)
    setIsOpen(false)
  }

  const onHourChange = (rawValue: string) => {
    const sanitized = rawValue.replace(/\D/g, '').slice(0, 2)
    setDraftHour(sanitized)
  }

  const onMinuteChange = (rawValue: string) => {
    const sanitized = rawValue.replace(/\D/g, '').slice(0, 2)
    setDraftMinute(sanitized)
  }

  return (
    <div className="picker-field" ref={containerRef}>
      <button
        id={id}
        type="button"
        className={`picker-trigger ${hasError ? 'error' : ''}`}
        onClick={openPicker}
        disabled={disabled}
      >
        <span className={!value ? 'picker-placeholder' : ''}>
          {toDisplayTime(value) || placeholder}
        </span>
        <span className="picker-icon">🕒</span>
      </button>

      {isOpen && (
        <div className="picker-popover">
          <p className="picker-title">Hora</p>
          <p className="picker-caption">Ingrese la hora</p>

          <div className="time-picker-grid">
            <input
              className="time-picker-number active"
              value={draftHour}
              onChange={event => onHourChange(event.target.value)}
              onBlur={() => setDraftHour(String(clamp(Number(draftHour) || 12, 1, 12)))}
            />
            <span className="time-picker-separator">:</span>
            <input
              className="time-picker-number"
              value={draftMinute}
              onChange={event => onMinuteChange(event.target.value)}
              onBlur={() => setDraftMinute(pad(clamp(Number(draftMinute) || 0, 0, 59)))}
            />
            <div className="time-picker-period">
              <button
                type="button"
                className={draftPeriod === 'AM' ? 'selected' : ''}
                onClick={() => setDraftPeriod('AM')}
              >
                AM
              </button>
              <button
                type="button"
                className={draftPeriod === 'PM' ? 'selected' : ''}
                onClick={() => setDraftPeriod('PM')}
              >
                PM
              </button>
            </div>
          </div>

          <div className="time-picker-legend">
            <span>Hora</span>
            <span>Minuto</span>
          </div>

          <div className="picker-actions">
            <button type="button" className="picker-action" onClick={() => setIsOpen(false)}>
              Cancelar
            </button>
            <button type="button" className="picker-action" onClick={save}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
