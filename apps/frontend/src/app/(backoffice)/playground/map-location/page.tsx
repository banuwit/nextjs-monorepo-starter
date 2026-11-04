import type { Metadata } from "next";
import { MapLocationPage } from "@/features/map-location/components/map-location-page";

export const metadata: Metadata = {
  title: "Map Location | Playground",
  description:
    "Customer distribution map with clustered pins, a heat layer, and dimension filters.",
};

export default function Page() {
  return <MapLocationPage />;
}
