"use client"

import Link from "next/link"
import { useActionState } from "react"
import { signIn, type AuthActionState } from "@/app/actions/auth"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

const initialState: AuthActionState = {}

type LoginFormProps = {
  redirectTo: string
  callbackError?: string
}

export function LoginForm({ redirectTo, callbackError }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(signIn, initialState)

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      {(state.error || callbackError) && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {state.error ??
            "Email confirmation failed. Please try signing in again."}
        </div>
      )}

      <div>
        <Label
          htmlFor="email"
          className="mb-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
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
        <Label
          htmlFor="password"
          className="mb-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="h-11 rounded-lg"
          required
        />
      </div>

      <Button type="submit" className="w-full p-[23px] mt-[20px]" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Create one
        </Link>
      </p>
    </form>
  )
}
