import Link from "next/link"
import { Logo } from "@/components/logo"
import { LoginForm } from "./login-form"

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string; error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams

  return (
    <div className="relative min-h-screen bg-white dark:bg-neutral-950">
      <div className="absolute left-6 top-6 z-20 hidden lg:block">
        <Logo theme="dark" width={180} height={54} priority />
      </div>
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-neutral-900 px-16 py-12 text-white lg:flex lg:flex-col lg:justify-end">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.35),transparent_38%),radial-gradient(circle_at_75%_0%,rgba(99,102,241,0.3),transparent_35%)]" />
          <blockquote className="relative space-y-6">
            <p className="text-3xl font-semibold leading-tight">
              “ClariTrade helped me remove emotion from my setups and improve my
              risk discipline in under a month.”
            </p>
            <footer className="text-sm text-white/80">
              <p className="font-semibold text-white">Tapiwa M.</p>
              <p>Forex swing trader</p>
            </footer>
          </blockquote>
        </div>

        <div className="flex items-center justify-center px-6 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <Logo width={220} height={64} priority />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              New to ClariTrade?{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Create your account
              </Link>
            </p>

            <LoginForm
              redirectTo={params.redirectTo ?? "/dashboard"}
              callbackError={params.error}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
