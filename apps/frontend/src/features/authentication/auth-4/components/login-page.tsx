import Link from "next/link";
import { FieldSeparator } from "@/components/ui/field";
import { AuthBrand } from "../../components/auth-brand";
import { AuthPreviewAction } from "../../components/auth-preview-action";
import { CredentialsForm } from "../../components/credentials-form";
import { SocialLoginButtons } from "../../components/social-login-buttons";
import styles from "./login-page.module.css";

const footerLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Status", href: "#" },
];

// Independent implementation of the public @reui/auth-4 description. See ../../README.md.
export function LoginPage() {
  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-12 text-foreground">
      <div className={styles.background} aria-hidden="true" />
      <div className="flex w-full max-w-[26.25rem] flex-col gap-6">
        <div className="rounded-2xl border bg-muted/60 p-1.5 shadow-xs">
          <div className="flex flex-col gap-6 rounded-xl border bg-card p-6 text-card-foreground shadow-xs sm:p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <AuthBrand />
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold">
                  Sign in to WIT. Studio
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back. Enter your details to continue.
                </p>
              </div>
            </div>
            <CredentialsForm />
            <FieldSeparator className="my-0">Or continue with</FieldSeparator>
            <SocialLoginButtons providers={["Google", "Apple", "GitHub"]} />
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
        </div>
        <nav
          aria-label="Footer"
          className="flex items-center justify-center gap-4 text-sm text-muted-foreground"
        >
          {footerLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
