'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import FormField from './FormField'
import SelectField from './SelectField'
import { siteConfig } from '@/config/site'
import {
  INQUIRY_SOURCE,
  SERVICE_OPTIONS,
  BUDGET_OPTIONS,
  TIMELINE_OPTIONS,
} from '@/config/inquiry'

interface FormValues {
  name: string
  email: string
  phone: string
  service: string
  budget: string
  timeline: string
  projectDetails: string
}

type FormFields = { [K in keyof FormValues]: K }

const FIELDS: FormFields = {
  name: 'name',
  email: 'email',
  phone: 'phone',
  service: 'service',
  budget: 'budget',
  timeline: 'timeline',
  projectDetails: 'projectDetails',
}

const EMPTY_FORM: FormValues = {
  name: '',
  email: '',
  phone: '',
  service: '',
  budget: '',
  timeline: '',
  projectDetails: '',
}

const REQUIRED_FIELDS: (keyof FormValues)[] = ['name', 'email', 'service', 'projectDetails']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateField(field: keyof FormValues, values: FormValues): string | undefined {
  switch (field) {
    case 'name':
      return values.name.trim() ? undefined : 'Please enter your name.'
    case 'email':
      if (!values.email.trim()) return 'Please enter your email address.'
      return EMAIL_RE.test(values.email.trim())
        ? undefined
        : 'Please enter a valid email address.'
    case 'service':
      return values.service ? undefined : 'Please select a service.'
    case 'projectDetails':
      return values.projectDetails.trim() ? undefined : 'Please tell us about your project.'
    default:
      return undefined
  }
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

interface ContactApiResponse {
  ok?: boolean
  error?: string
}

export default function ProjectInquiryForm() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM)
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [submitError, setSubmitError] = useState('')
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'success' && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', force3D: true }
      )
    }
  }, [status])

  const setField = (field: keyof FormValues) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
  }

  const markTouched = (field: keyof FormValues) => () => {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  const handleSelect = (field: 'service' | 'budget' | 'timeline') => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setTouched((current) => ({ ...current, [field]: true }))
  }

  const fieldError = (field: keyof FormValues): string | undefined =>
    touched[field] ? validateField(field, values) : undefined

  const resetForm = () => {
    setValues(EMPTY_FORM)
    setTouched({})
    setStatus('idle')
    setSubmitError('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setTouched({
      name: true,
      email: true,
      phone: true,
      service: true,
      budget: true,
      timeline: true,
      projectDetails: true,
    })

    const firstInvalid = REQUIRED_FIELDS.find((field) => validateField(field, values))
    if (firstInvalid) {
      document.getElementById(`inquiry-${firstInvalid}`)?.focus()
      return
    }

    setStatus('submitting')
    setSubmitError('')

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        service: values.service,
        budget: values.budget,
        timeline: values.timeline,
        projectDetails: values.projectDetails.trim(),
        source: INQUIRY_SOURCE,
        submittedAt: new Date().toISOString(),
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      const result = (await response.json().catch(() => null)) as ContactApiResponse | null
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || `Inquiry delivery failed with ${response.status}`)
      }

      setStatus('success')
      setValues(EMPTY_FORM)
      setTouched({})
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[contact] Failed to submit project inquiry', error)
      }
      setSubmitError(error instanceof Error ? error.message : '')
      setStatus('error')
    } finally {
      clearTimeout(timeout)
    }
  }

  return (
    <>
      {status === 'success' ? (
        <div
          ref={successRef}
          role="status"
          className="border-t border-amber-400/40 pt-12 lg:pt-16"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-amber-400/80">
            Inquiry Received
          </p>
          <h3 className="mt-6 font-serif text-4xl text-[#F5F5F5] md:text-5xl">
            Thank you<span className="italic text-amber-200/90">.</span>
          </h3>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/50">
            Your project inquiry has been received. We&rsquo;ll be in touch soon.
          </p>
          <button
            type="button"
            onClick={resetForm}
            className="mt-12 inline-flex items-center gap-2 border-b border-white/25 pb-1 text-xs uppercase tracking-[0.25em] text-white/70 transition-colors duration-300 hover:border-amber-400/70 hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400/80"
          >
            Send Another Inquiry →
          </button>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit} aria-busy={status === 'submitting'}>
          <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
            <div className="inquiry-field">
              <FormField
                id="inquiry-name"
                name="name"
                label="Name"
                required
                autoComplete="name"
                placeholder="Your name"
                maxLength={120}
                error={fieldError('name')}
                value={values.name}
                onChange={setField(FIELDS.name)}
                onBlur={markTouched(FIELDS.name)}
              />
            </div>

            <div className="inquiry-field">
              <FormField
                id="inquiry-email"
                name="email"
                label="Email"
                required
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                maxLength={200}
                error={fieldError('email')}
                value={values.email}
                onChange={setField(FIELDS.email)}
                onBlur={markTouched(FIELDS.email)}
              />
            </div>

            <div className="inquiry-field">
              <FormField
                id="inquiry-phone"
                name="phone"
                label="Phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="Your phone number"
                maxLength={40}
                error={fieldError('phone')}
                value={values.phone}
                onChange={setField(FIELDS.phone)}
                onBlur={markTouched(FIELDS.phone)}
              />
            </div>

            <div className="inquiry-field">
              <SelectField
                id="inquiry-service"
                label="Service"
                required
                placeholder="Select your service"
                options={SERVICE_OPTIONS}
                value={values.service}
                onChange={handleSelect(FIELDS.service)}
                error={fieldError('service')}
              />
            </div>

            <div className="inquiry-field">
              <SelectField
                id="inquiry-budget"
                label="Budget"
                placeholder="Select a range"
                options={BUDGET_OPTIONS}
                value={values.budget}
                onChange={handleSelect(FIELDS.budget)}
                error={fieldError('budget')}
              />
            </div>

            <div className="inquiry-field">
              <SelectField
                id="inquiry-timeline"
                label="Timeline"
                placeholder="Select a timeline"
                options={TIMELINE_OPTIONS}
                value={values.timeline}
                onChange={handleSelect(FIELDS.timeline)}
                error={fieldError('timeline')}
              />
            </div>

            <div className="inquiry-field md:col-span-2">
              <FormField
                id="inquiry-projectDetails"
                name="projectDetails"
                label="Project Details"
                required
                multiline
                rows={5}
                placeholder="Tell us about your space, what you&rsquo;re imagining, and where you are in the process."
                maxLength={4000}
                error={fieldError('projectDetails')}
                value={values.projectDetails}
                onChange={setField(FIELDS.projectDetails)}
                onBlur={markTouched(FIELDS.projectDetails)}
              />
            </div>
          </div>

          {status === 'error' && (
            <div role="alert" className="mt-10 border border-amber-400/20 bg-amber-400/[0.04] px-5 py-4">
              <p className="font-serif text-lg text-amber-100">
                {submitError || 'Something went wrong.'}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-white/60">
                Please try again, or email{' '}
                <a
                  href={`mailto:${siteConfig.links.email}`}
                  className="text-amber-200 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:decoration-amber-400/70"
                >
                  {siteConfig.links.email}
                </a>{' '}
                directly.
              </p>
            </div>
          )}

          <div className="inquiry-submit mt-12 flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-10">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex w-full items-center justify-center gap-3 rounded-xs bg-amber-500 px-9 py-4 font-medium text-xs uppercase tracking-widest text-black transition-all duration-300 hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            >
              {status === 'submitting' ? 'Submitting…' : 'Request My Project Quote →'}
            </button>
            <p className="max-w-[26ch] text-[11px] leading-relaxed text-white/30">
              This sends your inquiry straight to the studio. We usually reply within one business
              day.
            </p>
          </div>
        </form>
      )}
    </>
  )
}
