import { CircularProgress } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

import { exchangeEntraCode } from '../service/auth.service'
import { closePopup, ENTRA_AUTH_MESSAGE, postToOpener } from '../utils/entraPopup'

const EXCHANGE_LOCK_KEY = 'entra_code_exchange'

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
    const code = params.get('code')
    const error = params.get('error_description') ?? params.get('error')

    const notifyError = (message: string) => {
      postToOpener({ type: ENTRA_AUTH_MESSAGE.ERROR, message })
      closePopup()
    }

    const notifySuccess = (accessToken: string) => {
      sessionStorage.removeItem(EXCHANGE_LOCK_KEY)
      window.history.replaceState({}, '', window.location.pathname)
      postToOpener({ type: ENTRA_AUTH_MESSAGE.SUCCESS, accessToken })
      closePopup()
    }

    if (error) {
      notifyError(error)
      return
    }

    if (!code) {
      notifyError('Missing authorization code')
      return
    }

    if (sessionStorage.getItem(EXCHANGE_LOCK_KEY) === code) {
      return
    }

    sessionStorage.setItem(EXCHANGE_LOCK_KEY, code)

    exchangeEntraCode(code)
      .then((response) => notifySuccess(response.body.accessToken))
      .catch((err: Error) => {
        sessionStorage.removeItem(EXCHANGE_LOCK_KEY)
        notifyError(err.message)
      })
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
