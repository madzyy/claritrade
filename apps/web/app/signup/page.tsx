"use client"

import Link from "next/link"
import { useActionState } from "react"
import { signUp, type AuthActionState } from "@/app/actions/auth"
import { Logo } from "@/components/logo"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

const initialState: AuthActionState = {}

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo width={180} height={52} priority />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Start journaling free
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create your ClariTrade account in seconds
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create account</CardTitle>
            <CardDescription>
              Sign up with email and password
            </CardDescription>
          </CardHeader>
          <form action={formAction}>
            <CardContent className="space-y-4">
              {state.error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  {state.error}
                </div>
              )}
              {state.success && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {state.success}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating account..." : "Create account"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
