import Link from "next/link"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <FieldGroup className="gap-4">
        <Field className="gap-1.5">
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" />
        </Field>
        <Field className="gap-1.5">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" />
        </Field>
        <Field orientation="horizontal" data-disabled>
          <Checkbox id="remember" disabled aria-describedby="login-preview-description" />
          <FieldLabel htmlFor="remember" className="font-normal">Remember me for 30 days</FieldLabel>
        </Field>
        <Field>
          <Link href="/dashboard" aria-describedby="login-preview-description" className={buttonVariants({ className: "w-full" })}>
            Login
          </Link>
          <FieldDescription id="login-preview-description" className="text-center">
            Pratinjau navigasi: email dan password belum diverifikasi. Sesi belum disimpan.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  )
}
