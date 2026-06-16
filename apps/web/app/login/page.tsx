import { Logo } from "@/components/logo"
import { LoginForm } from "./login-form"

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string; error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo width={180} height={52} priority />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to your ClariTrade account
            </p>
          </div>
        </div>

        <LoginForm
          redirectTo={params.redirectTo ?? "/dashboard"}
          callbackError={params.error}
        />
      </div>
    </div>
  )
}
