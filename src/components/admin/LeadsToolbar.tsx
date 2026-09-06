'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SERVICE_OPTIONS, BUDGET_OPTIONS, TIMELINE_OPTIONS } from '@/config/inquiry'
import { LEAD_STATUSES } from '@/types/lead'

interface LeadsToolbarProps {
  pathname: string
  searchParams: Record<string, string>
}

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'score-desc', label: 'Highest Lead Score' },
  { value: 'score-asc', label: 'Lowest Lead Score' },
]

export default function LeadsToolbar({ pathname, searchParams }: LeadsToolbarProps) {
  const router = useRouter()
  const [search, setSearch] = useState(searchParams.search ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setSearch(searchParams.search ?? '')
  }, [searchParams.search])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const apply = useCallback(
    (next: Record<string, string>) => {
      const params = new URLSearchParams()
      if (next.search) params.set('search', next.search)
      if (next.status) params.set('status', next.status)
      if (next.service) params.set('service', next.service)
      if (next.budget) params.set('budget', next.budget)
      if (next.timeline) params.set('timeline', next.timeline)
      if (next.sort && next.sort !== 'newest') params.set('sort', next.sort)
      router.replace(`${pathname}?${params.toString()}`)
    },
    [pathname, router]
  )

  const withBase = (key: keyof typeof searchParams, value: string): Record<string, string> => ({
    search: key === 'search' ? value : searchParams.search ?? '',
    status: key === 'status' ? value : searchParams.status ?? '',
    service: key === 'service' ? value : searchParams.service ?? '',
    budget: key === 'budget' ? value : searchParams.budget ?? '',
    timeline: key === 'timeline' ? value : searchParams.timeline ?? '',
    sort: key === 'sort' ? value : searchParams.sort ?? 'newest',
  })

  const onSearchChange = (value: string) => {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => apply(withBase('search', value)), 350)
  }

  const hasFilters = Boolean(
    searchParams.search || searchParams.status || searchParams.service || searchParams.budget || searchParams.timeline
  )

  const selectClass =
    'w-full border-0 border-b border-white/10 bg-[#0c0c0c] py-3 pl-0 pr-7 text-sm text-[#F5F5F5] outline-none transition-colors focus:border-amber-400/70'
  const labelClass = 'mb-2 block font-mono text-[9px] uppercase tracking-[0.28em] text-white/35'

  return (
    <section aria-label="Lead filters" className="space-y-7">
      <div className="relative max-w-md">
        <label htmlFor="lead-search" className={labelClass}>
          Search
        </label>
        <div className="relative">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
          >
            <circle cx="9" cy="9" r="5.5" />
            <path d="M13.5 13.5L17 17" />
          </svg>
          <input
            id="lead-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Name, email, phone or location"
            className={`${selectClass} pl-7`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-3 xl:grid-cols-5">
        <div>
          <label htmlFor="filter-status" className={labelClass}>
            Status
          </label>
          <select
            id="filter-status"
            value={searchParams.status ?? ''}
            onChange={(event) => apply(withBase('status', event.target.value))}
            className={selectClass}
          >
            <option value="">All Statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-service" className={labelClass}>
            Service
          </label>
          <select
            id="filter-service"
            value={searchParams.service ?? ''}
            onChange={(event) => apply(withBase('service', event.target.value))}
            className={selectClass}
          >
            <option value="">All Services</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-budget" className={labelClass}>
            Budget
          </label>
          <select
            id="filter-budget"
            value={searchParams.budget ?? ''}
            onChange={(event) => apply(withBase('budget', event.target.value))}
            className={selectClass}
          >
            <option value="">All Budgets</option>
            {BUDGET_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-timeline" className={labelClass}>
            Timeline
          </label>
          <select
            id="filter-timeline"
            value={searchParams.timeline ?? ''}
            onChange={(event) => apply(withBase('timeline', event.target.value))}
            className={selectClass}
          >
            <option value="">All Timelines</option>
            {TIMELINE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sort-leads" className={labelClass}>
            Sort
          </label>
          <select
            id="sort-leads"
            value={searchParams.sort ?? 'newest'}
            onChange={(event) => apply(withBase('sort', event.target.value))}
            className={selectClass}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() =>
            router.replace(
              `${pathname}?sort=${searchParams.sort && searchParams.sort !== 'newest' ? searchParams.sort : ''}`
            )
          }
          className="border-b border-white/20 pb-0.5 text-[11px] uppercase tracking-[0.2em] text-amber-200/80 transition-colors hover:border-amber-400/60 hover:text-amber-100"
        >
          Clear Filters
        </button>
      )}
    </section>
  )
}