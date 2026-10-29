import type { Metadata } from "next";
import { LoginPage } from "@/features/authentication/auth-5/components/login-page";

export const metadata: Metadata = {
  title: "Login 5 | WIT. Studio",
  description:
    "Sign in to your workspace with email, password, or a social account.",
};

export default function Page() {
  return <LoginPage />;
}
