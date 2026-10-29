import type { Metadata } from "next";
import { ProfilePage } from "@/features/profile/components/profile-page";

export const metadata: Metadata = {
  title: "Profile | Dashboard",
  description: "View and manage your profile information.",
};

export default function Page() {
  return <ProfilePage />;
}
