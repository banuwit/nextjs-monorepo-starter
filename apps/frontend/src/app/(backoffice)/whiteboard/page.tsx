import type { Metadata } from "next";
import { WhiteboardPage } from "@/features/whiteboard/components/whiteboard-page";

export const metadata: Metadata = {
  title: "Whiteboard | Workspace",
  description: "Sketch ideas on an infinite whiteboard canvas.",
};

export default function Page() {
  return <WhiteboardPage />;
}
