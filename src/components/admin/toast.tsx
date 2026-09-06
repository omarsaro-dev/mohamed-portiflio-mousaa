'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'

export type ToastKind = 'success' | 'error' | 'info'

interface Toast {
  id: number
  kind: ToastKind
  title: string
  message?: string
}

interface ToastContextValue {
  toast: (kind: ToastKind, title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => undefined })

export function useToast(): ToastContextValue {
  return useContext(ToastContext)
}

let nextId = 1

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const toast = useCallback(
    (kind: ToastKind, title: string, message?: string) => {
      const id = nextId++
      setToasts((current) => [...current, { id, kind, title, message }])
      const timer = setTimeout(() => dismiss(id), 5000)
      timers.current.set(id, timer)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-3"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.kind === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto flex items-start gap-3 border border-white/10 bg-[#101010]/95 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur"
          >
            <span
              aria-hidden="true"
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                t.kind === 'success'
                  ? 'bg-emerald-400'
                  : t.kind === 'error'
                    ? 'bg-rose-400'
                    : 'bg-amber-400'
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-[#F5F5F5]">{t.title}</p>
              {t.message && <p className="mt-0.5 text-xs leading-relaxed text-white/50">{t.message}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-white/30 transition-colors hover:text-white/80"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}