"use client"

import Link from "next/link"
import { useActionState, useMemo, useState } from "react"
import { signUp, type AuthActionState } from "@/app/actions/auth"
import { Logo } from "@/components/logo"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

const initialState: AuthActionState = {}

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const fullName = useMemo(
    () => `${firstName} ${lastName}`.trim(),
    [firstName, lastName]
  )

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
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
              Get started for free
            </h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Already registered?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Sign in to your account
              </Link>
            </p>

            {state.error && (
              <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {state.error}
              </div>
            )}
            {state.success && (
              <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                {state.success}
              </div>
            )}

            <form action={formAction} className="mt-8 space-y-5">
              <input type="hidden" name="name" value={fullName} />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName" className="mb-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    className="h-11 rounded-lg"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="mb-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    className="h-11 rounded-lg"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="mb-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="h-11 rounded-lg"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="mb-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className="h-11 rounded-lg"
                  minLength={8}
                  required
                />
              </div>

              <div className="mb-[35px]">
                <Label htmlFor="referral" className="mb-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  How did you hear about us?
                </Label>
                <select
                  id="referral"
                  name="referral"
                  className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm ring-offset-background outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  defaultValue="AltaVista search"
                >
                  <option>AltaVista search</option>
                  <option>Super Bowl commercial</option>
                  <option>Our route 34 city bus ad</option>
                  <option>The “Never Use This” podcast</option>
                </select>
              </div>

              <Button type="submit" className="w-full p-[24px]" disabled={isPending}>
                {isPending ? "Signing up..." : "Sign up"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
