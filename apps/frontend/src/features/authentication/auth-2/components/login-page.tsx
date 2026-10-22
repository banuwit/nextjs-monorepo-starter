import Image from "next/image";
import { AuthBrand } from "../../components/auth-brand";
import { AuthPreviewAction } from "../../components/auth-preview-action";
import { CredentialsForm } from "../../components/credentials-form";
import { SocialLoginButtons } from "../../components/social-login-buttons";
import { FieldSeparator } from "@/components/ui/field";
import styles from "./login-page.module.css";

// Independent implementation of the public @reui/auth-1 preview. See ../../README.md.
export function LoginPage() {
  return (
    <main className="relative isolate flex min-h-dvh items-center overflow-hidden bg-background text-foreground">
      <div className={styles.grid} aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:py-[9vh]">
        <section className="mx-auto w-full max-w-[26.25rem] bg-background/95 px-4 py-8 sm:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <AuthBrand />
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold">
                  Sign in to Studio Admin
                </h1>
                <p className="text-sm text-muted-foreground">Welcome back.</p>
              </div>
            </div>
            <CredentialsForm />
            <FieldSeparator className="my-0">Or continue with</FieldSeparator>
            <SocialLoginButtons />
            <p className="text-center text-sm text-muted-foreground">
              Need an account?{" "}
              <AuthPreviewAction
                variant="link"
                className="h-auto p-0"
                message="Public registration is not enabled. Contact your administrator to request an account."
              >
                Sign up
              </AuthPreviewAction>
            </p>
          </div>
        </section>
        <aside
          className="relative mx-auto hidden h-[82vh] min-h-[32rem] w-full max-w-[30.625rem] overflow-hidden rounded-2xl lg:block"
          aria-label="Architectural photograph"
        >
          <Image
            src="/authentication/login-2-light.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 490px, 0px"
            className="object-cover dark:hidden"
          />
          <Image
            src="/authentication/login-2-dark.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 490px, 0px"
            className="hidden object-cover dark:block"
          />
        </aside>
      </div>
    </main>
  );
}
