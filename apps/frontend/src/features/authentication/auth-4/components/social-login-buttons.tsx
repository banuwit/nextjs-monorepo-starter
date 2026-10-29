import { cn } from "@/lib/utils";
import { AuthPreviewAction } from "./auth-preview-action";

// Google mark from WIT. Studio; see ../LICENSE for its MIT notice.
function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      data-icon="inline-start"
    >
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      data-icon="inline-start"
    >
      <path d="M17.05 12.54c.02 3.08 2.7 4.11 2.73 4.12-.02.07-.43 1.46-1.42 2.9-.85 1.25-1.74 2.49-3.14 2.52-1.37.03-1.81-.81-3.38-.81-1.56 0-2.05.78-3.35.84-1.35.05-2.38-1.35-3.24-2.59-1.76-2.54-3.1-7.19-1.3-10.33a5.03 5.03 0 0 1 4.25-2.58c1.33-.03 2.58.9 3.39.9.8 0 2.32-1.11 3.9-.95.66.03 2.54.27 3.75 2.04-.1.06-2.24 1.3-2.19 3.94ZM14.5 4.87c.72-.87 1.21-2.08 1.08-3.28-1.04.04-2.3.69-3.05 1.56-.67.77-1.26 2-1.1 3.18 1.16.09 2.35-.59 3.07-1.46Z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      data-icon="inline-start"
    >
      <path d="M12 .5a12 12 0 0 0-3.79 23.38c.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22v3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

const providerIcons = {
  Google: GoogleIcon,
  Apple: AppleIcon,
  GitHub: GithubIcon,
};
type Provider = keyof typeof providerIcons;

export function SocialLoginButtons({
  providers = ["Google", "Apple"],
  layout = "row",
}: {
  providers?: Provider[];
  layout?: "row" | "column";
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        layout === "row" &&
          (providers.length >= 3 ? "grid-cols-3" : "sm:grid-cols-2"),
      )}
    >
      {providers.map((provider) => {
        const Icon = providerIcons[provider];
        return (
          <AuthPreviewAction
            key={provider}
            variant="outline"
            className={cn("w-full", layout === "column" && "h-10")}
            message={`${provider} sign-in is not connected in this preview. No account or session has been created.`}
          >
            <Icon data-icon="inline-start" aria-hidden="true" />
            {layout === "column" ? `Continue with ${provider}` : provider}
          </AuthPreviewAction>
        );
      })}
    </div>
  );
}
