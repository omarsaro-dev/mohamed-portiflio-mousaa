import { NextResponse } from 'next/server'
import { CONTACT_SOURCE, CONTACT_WEBHOOK_TIMEOUT_MS, getN8nWebhookUrl } from '@/config/n8n'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface InquiryPayload {
  name?: unknown
  email?: unknown
  phone?: unknown
  service?: unknown
  budget?: unknown
  timeline?: unknown
  projectDetails?: unknown
  source?: unknown
  submittedAt?: unknown
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function asText(value: unknown, maxLength = 5000): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function isDevelopment(): boolean {
  return process.env.NODE_ENV !== 'production'
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }

  const payload = (body ?? {}) as InquiryPayload
  const name = asText(payload.name, 120)
  const email = asText(payload.email, 200)
  const service = asText(payload.service, 120)
  const projectDetails = asText(payload.projectDetails)

  if (!name || !email || !service || !projectDetails) {
    return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'Invalid email address' }, { status: 400 })
  }

  const webhookUrl = getN8nWebhookUrl()
  if (!webhookUrl) {
    if (isDevelopment()) {
      console.warn('[contact] N8N_WEBHOOK_URL is not configured — inquiry not delivered')
    }
    return NextResponse.json({ ok: false, error: 'Webhook not configured' }, { status: 503 })
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(webhookUrl)
  } catch {
    return NextResponse.json({ ok: false, error: 'Webhook not configured' }, { status: 503 })
  }
  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
    return NextResponse.json({ ok: false, error: 'Webhook not configured' }, { status: 503 })
  }

  const clean = {
    name,
    email,
    phone: asText(payload.phone, 120),
    service,
    budget: asText(payload.budget, 120),
    timeline: asText(payload.timeline, 120),
    projectDetails,
    source: asText(payload.source, 60) || CONTACT_SOURCE,
    submittedAt: asText(payload.submittedAt, 60) || new Date().toISOString(),
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), CONTACT_WEBHOOK_TIMEOUT_MS)

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clean),
      signal: controller.signal,
      cache: 'no-store',
    })

    if (!response.ok) {
      if (isDevelopment()) {
        console.warn(`[contact] n8n webhook responded with ${response.status}`)
      }
      return NextResponse.json({ ok: false, error: 'Delivery failed' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (isDevelopment()) {
      console.error('[contact] Failed to deliver inquiry to n8n webhook', error)
    }
    return NextResponse.json({ ok: false, error: 'Delivery failed' }, { status: 502 })
  } finally {
    clearTimeout(timeout)
  }
}