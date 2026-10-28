export function normalizeEditorLink(value: string): string | null {
  const input = value.trim();
  if (!input || /\s/.test(input) || input.startsWith("//")) return null;
  try {
    const url = new URL(
      /^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`,
    );
    return ["https:", "http:", "mailto:", "tel:"].includes(url.protocol)
      ? url.href
      : null;
  } catch {
    return null;
  }
}
