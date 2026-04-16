import { useEffect, useMemo, useRef, useState } from 'react'
import './dateTimePicker.css'

interface DatePickerInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hasError?: boolean
  disabled?: boolean
}

interface CalendarCell {
  year: number
  month: number
  day: number
  isCurrentMonth: boolean
}

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const pad = (value: number) => String(value).padStart(2, '0')

const parseDateValue = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const parsed = new Date(year, month, day)
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month || parsed.getDate() !== day) {
    return null
  }
  return parsed
}

const toDateValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const displayDateValue = (value: string) => {
  const parsed = parseDateValue(value)
  if (!parsed) return ''
  return `${pad(parsed.getDate())}/${pad(parsed.getMonth() + 1)}/${parsed.getFullYear()}`
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const buildCalendarGrid = (year: number, month: number): CalendarCell[] => {
  const firstDayWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  const cells: CalendarCell[] = []

  for (let i = firstDayWeek - 1; i >= 0; i -= 1) {
    const prevDate = new Date(year, month - 1, daysInPrevMonth - i)
    cells.push({
      year: prevDate.getFullYear(),
      month: prevDate.getMonth(),
      day: prevDate.getDate(),
      isCurrentMonth: false,
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ year, month, day, isCurrentMonth: true })
  }

  const rest = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7)
  for (let i = 1; i <= rest; i += 1) {
    const nextDate = new Date(year, month + 1, i)
    cells.push({
      year: nextDate.getFullYear(),
      month: nextDate.getMonth(),
      day: nextDate.getDate(),
      isCurrentMonth: false,
    })
  }

  return cells
}

export default function DatePickerInput({
  id,
  value,
  onChange,
  placeholder = 'Seleccionar fecha',
  hasError = false,
  disabled = false,
}: DatePickerInputProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const selected = parseDateValue(value)
  const selectedYear = selected?.getFullYear()
  const initialDate = selected ?? new Date()
  const [isOpen, setIsOpen] = useState(false)
  const [draftDate, setDraftDate] = useState<Date | null>(selected)
  const [viewYear, setViewYear] = useState(initialDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth())

  const yearOptions = useMemo(() => {
    const base = selectedYear ?? new Date().getFullYear()
    return Array.from({ length: 17 }, (_, index) => base - 8 + index)
  }, [selectedYear])

  const cells = useMemo(() => buildCalendarGrid(viewYear, viewMonth), [viewMonth, viewYear])

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
    const sourceDate = selected ?? new Date()
    setDraftDate(sourceDate)
    setViewYear(sourceDate.getFullYear())
    setViewMonth(sourceDate.getMonth())
    setIsOpen(true)
  }

  const moveMonth = (direction: -1 | 1) => {
    const next = new Date(viewYear, viewMonth + direction, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  const applySelection = () => {
    if (draftDate) {
      onChange(toDateValue(draftDate))
    }
    setIsOpen(false)
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
          {displayDateValue(value) || placeholder}
        </span>
        <span className="picker-icon">📅</span>
      </button>

      {isOpen && (
        <div className="picker-popover">
          <div className="date-picker-header">
            <button type="button" className="date-picker-nav" onClick={() => moveMonth(-1)}>
              ‹
            </button>
            <select
              className="date-picker-select"
              value={viewMonth}
              onChange={event => setViewMonth(Number(event.target.value))}
            >
              {MONTHS.map((monthName, index) => (
                <option key={monthName} value={index}>
                  {monthName}
                </option>
              ))}
            </select>
            <select
              className="date-picker-select"
              value={viewYear}
              onChange={event => setViewYear(Number(event.target.value))}
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button type="button" className="date-picker-nav" onClick={() => moveMonth(1)}>
              ›
            </button>
          </div>

          <div className="date-picker-grid">
            {WEEK_DAYS.map(day => (
              <div key={day} className="date-picker-weekday">
                {day}
              </div>
            ))}
            {cells.map(cell => {
              const cellDate = new Date(cell.year, cell.month, cell.day)
              const isSelected = draftDate ? sameDay(cellDate, draftDate) : false
              return (
                <button
                  key={`${cell.year}-${cell.month}-${cell.day}`}
                  type="button"
                  className={`date-picker-day ${!cell.isCurrentMonth ? 'other-month' : ''} ${
                    isSelected ? 'selected' : ''
                  }`}
                  onClick={() => {
                    setDraftDate(cellDate)
                    if (!cell.isCurrentMonth) {
                      setViewYear(cell.year)
                      setViewMonth(cell.month)
                    }
                  }}
                >
                  {cell.day}
                </button>
              )
            })}
          </div>

          <div className="picker-actions">
            <button type="button" className="picker-action" onClick={() => setIsOpen(false)}>
              Cancelar
            </button>
            <button type="button" className="picker-action" onClick={applySelection}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
