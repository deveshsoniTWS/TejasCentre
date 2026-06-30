import { CircularProgress } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

import { closePopup, ENTRA_AUTH_MESSAGE, postToOpener } from '../utils/entraPopup'

export function AuthCallbackPage() {
  const started = useRef(false)
  const [invalidContext, setInvalidContext] = useState(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    if (!window.opener || window.opener.closed) {
      setInvalidContext(true)
      return
    }

    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('accessToken')
    const error = params.get('error')

    if (error) {
      postToOpener({ type: ENTRA_AUTH_MESSAGE.ERROR, message: decodeURIComponent(error) })
      closePopup()
      return
    }

    if (!accessToken) {
      postToOpener({ type: ENTRA_AUTH_MESSAGE.ERROR, message: 'Missing access token' })
      closePopup()
      return
    }

    postToOpener({ type: ENTRA_AUTH_MESSAGE.SUCCESS, accessToken })
    closePopup()
  }, [])

  if (invalidContext) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-page px-4">
        <p className="text-center text-text-secondary">
          Invalid sign-in context. Close this window and sign in from the login page.
        </p>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-page">
      <CircularProgress />
    </main>
  )
}