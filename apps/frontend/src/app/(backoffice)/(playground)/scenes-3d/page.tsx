import type { Metadata } from "next";
import { Scenes3DPage } from "@/features/scenes-3d/components/scenes-3d-page";

export const metadata: Metadata = {
  title: "3D Scenes | Playground",
  description:
    "Pick match-day seats from an interactive 3D stadium bowl with a synced 2D plan and price timeline.",
};

export default function Page() {
  return <Scenes3DPage />;
}
