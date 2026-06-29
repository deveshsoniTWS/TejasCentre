import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Button } from '../ui'
import { setCredentials } from '../../feature/authSlice'
import { getEntraLoginUrl } from '../../service/auth.service'
import { images } from '../../utils/images'
import {
  ENTRA_AUTH_MESSAGE,
  ENTRA_POPUP_FEATURES,
  ENTRA_POPUP_NAME,
  isEntraAuthMessage,
} from '../../utils/entraPopup'

export function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const popupRef = useRef<Window | null>(null)
  const pollRef = useRef<number | null>(null)

  const finishSignIn = useCallback(
    (accessToken: string) => {
      localStorage.setItem('accessToken', accessToken)
      dispatch(setCredentials({ accessToken }))
      navigate('/select-location', { replace: true })
    },
    [dispatch, navigate],
  )

  const cleanupPopupFlow = useCallback(() => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current)
      pollRef.current = null
    }
    popupRef.current = null
    setIsSigningIn(false)
  }, [])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (!isEntraAuthMessage(event.data)) return

      if (event.data.type === ENTRA_AUTH_MESSAGE.SUCCESS) {
        cleanupPopupFlow()
        finishSignIn(event.data.accessToken)
        return
      }

      cleanupPopupFlow()
      toast.error(event.data.message)
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [cleanupPopupFlow, finishSignIn])

  useEffect(() => () => cleanupPopupFlow(), [cleanupPopupFlow])

  const handleEntraLogin = () => {
    if (isSigningIn) return

    const popup = window.open(getEntraLoginUrl(), ENTRA_POPUP_NAME, ENTRA_POPUP_FEATURES)
    if (!popup) {
      toast.error('Popup blocked. Allow popups for this site and try again.')
      return
    }

    popupRef.current = popup
    setIsSigningIn(true)

    pollRef.current = window.setInterval(() => {
      if (popupRef.current?.closed) {
        cleanupPopupFlow()
      }
    }, 500)
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 px-4 py-8 sm:px-6">
      <div className="flex h-16 items-center justify-center" aria-label="JSW Steel">
        <img src={images.jswSteelLogo} alt="JSW Steel" className="h-16" />
      </div>

      <header className="w-full text-center">
        <h2 className="text-3xl font-semibold text-text-primary">Welcome Back</h2>
        <p className="mt-2 text-base text-text-secondary">
          Sign in with your organization account
        </p>
      </header>

      <div className="flex w-full flex-col gap-6">
        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={isSigningIn}
          onClick={handleEntraLogin}
        >
          {isSigningIn ? 'Signing in…' : 'Sign in with Microsoft'}
        </Button>

        <p className="text-center text-sm text-text-secondary">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            className="font-medium text-brand-danger hover:underline cursor-pointer"
            onClick={() => navigate('/contact-administrator')}
          >
            Contact Administrator
          </button>
        </p>
      </div>
    </div>
  )
}
