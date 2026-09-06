'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  label: string
  value: string
}

interface SelectFieldProps {
  id: string
  label: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  placeholder?: string
}

export default function SelectField({
  id,
  label,
  options,
  value,
  onChange,
  error,
  required,
  placeholder = 'Select an option',
}: SelectFieldProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()
  const errorId = useId()

  const selectedIndex = options.findIndex((option) => option.value === value)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null

  useEffect(() => {
    if (!open) return
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }, [open, selectedIndex])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (!open || activeIndex < 0 || !listRef.current) return
    const el = listRef.current.children[activeIndex] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  const selectOption = useCallback(
    (index: number) => {
      const option = options[index]
      if (!option) return
      onChange(option.value)
      setOpen(false)
      buttonRef.current?.focus()
    },
    [options, onChange]
  )

  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault()
        setOpen(true)
        break
      case 'Enter':
      case ' ':
      case 'Spacebar':
        event.preventDefault()
        setOpen((v) => !v)
        break
      case 'Home':
        if (open) {
          event.preventDefault()
          setActiveIndex(0)
        }
        break
      case 'End':
        if (open) {
          event.preventDefault()
          setActiveIndex(options.length - 1)
        }
        break
      case 'Escape':
        if (open) {
          event.preventDefault()
          setOpen(false)
          buttonRef.current?.focus()
        }
        break
      default:
        break
    }
  }

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((i) => (i + 1) % options.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((i) => (i <= 0 ? options.length - 1 : i - 1))
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(options.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (activeIndex >= 0) selectOption(activeIndex)
        break
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        buttonRef.current?.focus()
        break
      case 'Tab':
        setOpen(false)
        break
      default:
        break
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <label
        id={`${id}-label`}
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

      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-labelledby={`${id}-label`}
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={error ? true : undefined}
        aria-activedescendant={open && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
        onKeyDown={handleButtonKeyDown}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center justify-between gap-4 border-0 border-b bg-transparent py-3.5 text-left text-sm outline-none transition-colors duration-300 focus:border-amber-400/80 focus:ring-0',
          error ? 'border-amber-400/70' : 'border-white/10',
          selected ? 'text-[#F5F5F5]' : 'text-white/30'
        )}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <svg
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-white/40 transition-transform duration-300',
            open && 'rotate-180'
          )}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          aria-hidden="true"
        >
          <path d="M3 5.5L8 10.5L13 5.5" />
        </svg>
      </button>

      <ul
        ref={listRef}
        id={listboxId}
        role="listbox"
        aria-labelledby={`${id}-label`}
        tabIndex={-1}
        onKeyDown={handleListKeyDown}
        onBlur={() => setOpen(false)}
        className={cn(
          'absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-auto border border-white/10 bg-[#0c0c0c] py-1 shadow-[0_24px_48px_rgba(0,0,0,0.6)] outline-none transition-opacity duration-200',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        {options.map((option, index) => (
          <li
            key={option.value}
            id={`${id}-option-${index}`}
            role="option"
            aria-selected={option.value === value}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => selectOption(index)}
            className={cn(
              'flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-xs tracking-wide transition-colors duration-150',
              option.value === value ? 'text-amber-300' : 'text-white/70',
              activeIndex === index && 'bg-white/[0.06]'
            )}
          >
            {option.label}
            {option.value === value && (
              <svg
                className="h-3 w-3 shrink-0 text-amber-300"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M3 8.5L6.5 12L13 4.5" />
              </svg>
            )}
          </li>
        ))}
      </ul>

      {error && (
        <p id={errorId} className="mt-2.5 text-[11px] leading-snug text-amber-400">
          {error}
        </p>
      )}
    </div>
  )
}