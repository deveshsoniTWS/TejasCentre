import { useNavigate } from 'react-router-dom'

import { Button } from '../ui'
import { images } from '../../utils/images'
import { getEntraLoginUrl } from '../../service/auth.service'

export function LoginForm() {
  const navigate = useNavigate()

  const handleEntraLogin = () => {
    window.location.href = getEntraLoginUrl()
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
        <Button type="button" variant="secondary" fullWidth onClick={handleEntraLogin}>
          Sign in with Microsoft
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
