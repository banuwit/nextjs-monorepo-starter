// Adapted from Studio Admin's auth v2 layout. See ../LICENSE.
import { CommandIcon, GlobeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FieldSeparator } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"

import { LoginForm } from "./login-form"

function LoginBrandPanel() {
  return (
    <aside className="hidden flex-col justify-between gap-16 rounded-3xl bg-primary p-10 text-primary-foreground lg:flex">
      <div className="flex flex-col gap-1">
        <CommandIcon className="size-10" aria-hidden="true" />
        <h2 className="text-2xl font-medium">Studio Admin</h2>
        <p className="text-sm">Design. Build. Launch. Repeat.</p>
      </div>
      <div className="flex text-sm">
        <div className="flex flex-1 flex-col gap-1">
          <h3 className="font-medium">Ready to launch?</h3>
          <p>Clone the repo, install dependencies, and your dashboard is live in minutes.</p>
        </div>
        <Separator orientation="vertical" className="mx-3 h-auto" />
        <div className="flex flex-1 flex-col gap-1">
          <h3 className="font-medium">Need help?</h3>
          <p>Check out the docs or open an issue on GitHub, community support is just a click away.</p>
        </div>
      </div>
    </aside>
  )
}

function GoogleLoginButton() {
  return (
    <div className="flex flex-col gap-2">
      <Button variant="secondary" className="w-full" disabled aria-describedby="google-login-description">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-icon="inline-start">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
        </svg>
        Continue with Google
      </Button>
      <p id="google-login-description" className="text-center text-xs text-muted-foreground">
        Login Google belum tersedia.
      </p>
    </div>
  )
}

function LoginFooter() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <span>© {new Date().getFullYear()}, Studio Admin.</span>
      <span className="flex items-center gap-1" aria-label="Language: English">
        <GlobeIcon className="size-4 text-muted-foreground" aria-hidden="true" />
        ENG
      </span>
    </footer>
  )
}

export function LoginPage() {
  return (
    <main className="grid min-h-dvh gap-2 bg-background p-2 [--primary:var(--foreground)] [--primary-foreground:var(--background)] lg:grid-cols-2">
      <LoginBrandPanel />
      <div className="flex min-w-0 flex-col gap-8 px-4 py-5 sm:px-10">
        <p className="text-right text-sm text-muted-foreground">
          Belum punya akun? <span className="text-foreground">Hubungi administrator.</span>
        </p>
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="flex w-full max-w-[350px] flex-col gap-8">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-3xl font-medium">Login to your account</h1>
              <p className="text-sm text-muted-foreground">Please enter your details to login.</p>
            </div>
            <div className="flex flex-col gap-4">
              <GoogleLoginButton />
              <FieldSeparator className="my-0">Or continue with</FieldSeparator>
              <LoginForm />
            </div>
          </div>
        </div>
        <LoginFooter />
      </div>
    </main>
  )
}
