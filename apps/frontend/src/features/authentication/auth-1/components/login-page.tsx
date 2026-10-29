import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldSeparator } from "@/components/ui/field";
import { AuthBrand } from "./auth-brand";
import { AuthPreviewAction } from "./auth-preview-action";
import { CredentialsForm } from "./credentials-form";
import { SocialLoginButtons } from "./social-login-buttons";

// Independent implementation of the public @reui/auth-20 preview. See ../../README.md.
export function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted/30 px-4 py-12 text-foreground">
      <div className="flex w-full max-w-[26.25rem] flex-col gap-6">
        <Card className="gap-6 py-6 [--card-spacing:--spacing(6)]">
          <CardHeader className="gap-5 text-center">
            <AuthBrand />
            <div className="flex flex-col gap-2">
              <CardTitle>
                <h1 className="text-xl font-semibold">Welcome back</h1>
              </CardTitle>
              <CardDescription>
                Sign in to continue to your workspace.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <SocialLoginButtons />
            <FieldSeparator className="my-0">
              Or sign in with email
            </FieldSeparator>
            <CredentialsForm />
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <AuthPreviewAction
            variant="link"
            className="h-auto p-0"
            message="Public registration is not enabled. Contact your administrator to request an account."
          >
            Create account
          </AuthPreviewAction>
        </p>
      </div>
    </main>
  );
}
