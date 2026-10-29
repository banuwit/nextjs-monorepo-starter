let sequence = 0;

export function createId(prefix = "msg") {
  sequence += 1;
  return `${prefix}-${Date.now().toString(36)}-${sequence.toString(36)}`;
}

export type StreamTextOptions = {
  onChunk: (text: string) => void;
  onDone?: () => void;
  /** Jeda sebelum token pertama, meniru waktu berpikir model. */
  delay?: number;
  interval?: number;
  chunkSize?: number;
};

/**
 * Memutar teks balasan statis sedikit demi sedikit. Ganti dengan output stream
 * model saat chat dihubungkan ke backend. Mengembalikan fungsi pembatal.
 */
export function streamText(
  text: string,
  {
    onChunk,
    onDone,
    delay = 600,
    interval = 24,
    chunkSize = 4,
  }: StreamTextOptions,
) {
  let index = 0;
  let intervalId: number | undefined;
  const timeoutId = window.setTimeout(() => {
    intervalId = window.setInterval(() => {
      index = Math.min(text.length, index + chunkSize);
      onChunk(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(intervalId);
        onDone?.();
      }
    }, interval);
  }, delay);

  return () => {
    window.clearTimeout(timeoutId);
    window.clearInterval(intervalId);
  };
}
