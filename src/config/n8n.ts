export const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || ''

export const CONTACT_SOURCE = 'architectural-portfolio'

export const CONTACT_WEBHOOK_TIMEOUT_MS = 10000

export function getN8nWebhookUrl(): string {
  return N8N_WEBHOOK_URL
}