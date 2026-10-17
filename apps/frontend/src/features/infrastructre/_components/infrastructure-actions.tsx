import { toast } from "@/components/ui/toast";

export function previewCloudAction(action: string) {
  toast.add({
    title: `${action} · Demo`,
    description:
      "Connect an infrastructure provider to use this action. No server changes have been made.",
    type: "info",
  });
}

export async function copyInfrastructureValue(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.add({ title: "Copied to clipboard", type: "success" });
  } catch {
    toast.add({
      title: "Unable to access clipboard",
      description: "Allow clipboard access in your browser and try again.",
      type: "error",
    });
  }
}
