'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  required?: boolean
  multiline?: boolean
  className?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  rows?: number
  name?: string
  maxLength?: number
  placeholder?: string
  type?: string
  autoComplete?: string
  [key: string]: unknown
}

export default function FormField({
  id,
  label,
  error,
  required,
  multiline = false,
  className = '',
  value,
  onChange,
  onBlur,
  rows = 5,
  ...rest
}: FormFieldProps) {
  const errorId = useId()

  const fieldClasses = cn(
    'w-full border-0 border-b bg-transparent px-0 outline-none transition-colors duration-300',
    'text-sm text-[#F5F5F5] placeholder:text-white/25',
    'focus:border-amber-400/80 focus:ring-0',
    multiline ? 'resize-none py-3 leading-relaxed' : 'py-3.5',
    error ? 'border-amber-400/70' : 'border-white/10',
    className
  )

  const describedBy = error ? errorId : undefined

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="mb-3 flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40"
      >
        {label}
        {required ? (
          <span className="text-amber-400/90" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="normal-case tracking-normal text-white/25">(optional)</span>
        )}
      </label>

      {multiline ? (
        <textarea
          id={id}
          name={rest.name}
          rows={rows}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange?.(event.target.value)}
          onBlur={onBlur as React.FocusEventHandler<HTMLTextAreaElement> | undefined}
          className={fieldClasses}
          {...rest}
        />
      ) : (
        <input
          id={id}
          name={rest.name}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange?.(event.target.value)}
          onBlur={onBlur as React.FocusEventHandler<HTMLInputElement> | undefined}
          className={fieldClasses}
          {...rest}
        />
      )}

      {error && (
        <p id={errorId} className="mt-2.5 text-[11px] leading-snug text-amber-400">
          {error}
        </p>
      )}
    </div>
  )
}