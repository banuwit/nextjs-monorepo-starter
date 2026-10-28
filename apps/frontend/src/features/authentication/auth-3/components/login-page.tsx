import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldSeparator } from "@/components/ui/field";
import { AuthBrand } from "../../components/auth-brand";
import { AuthPreviewAction } from "../../components/auth-preview-action";
import { CredentialsForm } from "../../components/credentials-form";
import { SocialLoginButtons } from "../../components/social-login-buttons";

// Independent implementation of the public @reui/auth-8 preview. See ../../README.md.
export function LoginPage() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src="/authentication/login-3-office.jpg"
          alt=""
          fill
          sizes="100vw"
          preload
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/75 backdrop-blur-[2px]" />
      </div>
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-10">
        <AuthBrand />
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-muted-foreground sm:inline">
            New here?
          </span>
          <AuthPreviewAction
            variant="secondary"
            className="rounded-full"
            message="Public registration is not enabled. Contact your administrator to request an account."
          >
            Create an account
          </AuthPreviewAction>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="flex w-full max-w-md flex-col gap-6">
          <div className="rounded-2xl border border-border bg-background/40 p-1">
            <Card className="gap-6 rounded-xl py-7 [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)]">
              <CardHeader className="gap-2 text-center">
                <CardTitle>
                  <h1 className="text-xl font-semibold">
                    Sign in to WIT. Studio
                  </h1>
                </CardTitle>
                <CardDescription>Pick up where you left off.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <CredentialsForm placeholder="you@work.com" />
                <FieldSeparator className="my-0">
                  Or continue with
                </FieldSeparator>
                <SocialLoginButtons
                  providers={["Google", "Apple", "GitHub"]}
                  layout="column"
                />
                <p className="text-center text-sm text-muted-foreground">
                  New to WIT. Studio?{" "}
                  <AuthPreviewAction
                    variant="link"
                    className="h-auto p-0"
                    message="Public registration is not enabled. Contact your administrator to request an account."
                  >
                    Create an account
                  </AuthPreviewAction>
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Your workspace, ready when you are.
          </p>
        </div>
      </main>
    </div>
  );
}
