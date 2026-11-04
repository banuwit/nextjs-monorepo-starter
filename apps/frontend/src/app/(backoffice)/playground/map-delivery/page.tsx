import type { Metadata } from "next";
import { MapDeliveryPage } from "@/features/map-delivery/components/map-delivery-page";

export const metadata: Metadata = {
  title: "Map Delivery | Playground",
  description:
    "Dispatch console for a same-day delivery fleet on an OpenStreetMap basemap.",
};

export default function Page() {
  return <MapDeliveryPage />;
}
