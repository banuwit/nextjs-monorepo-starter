import type { Metadata } from "next";
import { ChangePasswordPage } from "@/features/change-password/components/change-password-page";

export const metadata: Metadata = {
  title: "Change Password | Dashboard",
  description: "Update the password you use to sign in to your account.",
};

export default function Page() {
  return <ChangePasswordPage />;
}
