import Image from "next/image";
import { StarIcon } from "lucide-react";
import { FieldSeparator } from "@/components/ui/field";
import { AuthBrand } from "./auth-brand";
import { AuthPreviewAction } from "./auth-preview-action";
import { CredentialsForm } from "./credentials-form";
import { SocialLoginButtons } from "./social-login-buttons";
import styles from "./login-page.module.css";

// Independent implementation of the public @reui/auth-18 preview. See ../../README.md.
export function LoginPage() {
  return (
    <main className="grid min-h-dvh bg-background text-foreground lg:grid-cols-12">
      <aside className="relative isolate hidden overflow-hidden border-r border-border bg-muted/25 px-10 py-12 lg:col-span-5 lg:flex lg:flex-col xl:px-14">
        <div className={styles.grid} aria-hidden="true" />
        <figure className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 text-center">
          <div className="mb-1 flex gap-1" aria-label="5 out of 5 stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className="size-4 fill-current"
                aria-hidden="true"
              />
            ))}
          </div>
          <blockquote className="text-[1.625rem] leading-snug font-medium tracking-tight">
            “The best login pages disappear. This one already feels fast.”
          </blockquote>
          <figcaption className="flex items-center gap-2 text-left">
            <Image
              src="/authentication/login-5-avatar.jpg"
              alt=""
              width={32}
              height={32}
              className="size-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">Sean Bold</p>
              <p className="text-xs text-muted-foreground">Co-founder · ReUI</p>
            </div>
          </figcaption>
        </figure>
        <div className="mt-10 flex flex-col gap-5">
          <p className="text-sm font-medium">Made for modern workflows</p>
          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-3 text-muted-foreground"
            aria-label="Example brands from the design reference"
          >
            <span className="text-xs font-semibold tracking-tight">OpenAI</span>
            <span className="text-xl font-bold tracking-tighter">stripe</span>
            <span className="text-base font-semibold tracking-tight">
              supabase
            </span>
            <span className="text-xl font-bold tracking-tight">slack</span>
          </div>
        </div>
      </aside>
      <section className="flex items-center justify-center px-6 py-12 lg:col-span-7 lg:py-8">
        <div className="flex w-full max-w-[22.5rem] flex-col gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <AuthBrand />
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold">Sign in to WIT. Studio</h1>
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
    </main>
  );
}
