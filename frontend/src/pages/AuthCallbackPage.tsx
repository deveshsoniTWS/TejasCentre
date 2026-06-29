import { CircularProgress } from '@mui/material'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { setCredentials } from '../feature/authSlice'
import { exchangeEntraCode } from '../service/auth.service'

const EXCHANGE_LOCK_KEY = 'entra_code_exchange'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const error = params.get('error_description') ?? params.get('error')

    if (error) {
      toast.error(error)
      navigate('/login', { replace: true })
      return
    }

    if (!code) {
      toast.error('Missing authorization code')
      navigate('/login', { replace: true })
      return
    }

    if (sessionStorage.getItem(EXCHANGE_LOCK_KEY) === code) {
      return
    }

    sessionStorage.setItem(EXCHANGE_LOCK_KEY, code)

    exchangeEntraCode(code)
      .then((response) => {
        sessionStorage.removeItem(EXCHANGE_LOCK_KEY)
        window.history.replaceState({}, '', window.location.pathname)
        localStorage.setItem('accessToken', response.body.accessToken)
        dispatch(setCredentials({ accessToken: response.body.accessToken }))
        navigate('/select-location', { replace: true })
      })
      .catch((err: Error) => {
        sessionStorage.removeItem(EXCHANGE_LOCK_KEY)
        toast.error(err.message)
        navigate('/login', { replace: true })
      })
  }, [dispatch, navigate])

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-page">
      <CircularProgress />
    </main>
  )
}
