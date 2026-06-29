import { HeroPanel } from '../components/login/HeroPanel'
import { LoginForm } from '../components/login/LoginForm'

export function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col bg-surface-page lg:flex-row">
      <div className="order-2 lg:order-1 lg:flex lg:flex-1">
        <HeroPanel />
      </div>

      <section className="order-1 flex flex-1 items-center justify-center bg-surface-page px-4 py-10 sm:px-8 lg:order-2 lg:min-h-screen lg:flex-1 lg:px-12">
        <div
          className="w-full max-w-md rounded-2xl bg-surface-card p-2 sm:max-w-lg sm:p-4"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <LoginForm />
        </div>
      </section>
    </main>
  )
}
