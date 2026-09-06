'use client'

import { useEffect } from 'react'
import { ErrorState } from '@/components/admin/StateViews'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[admin]', error)
    }
  }, [error])

  return (
    <ErrorState
      title="Something went wrong"
      message="An unexpected error occurred while loading this page. Your session may have expired — if the problem persists, try signing out and back in."
      onRetry={reset}
    />
  )
}