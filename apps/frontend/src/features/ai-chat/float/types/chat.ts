export type ChatRole = "user" | "assistant";

/** `thinking` sebelum token pertama, `streaming` saat teks berjalan, lalu `done`. */
export type ChatMessageStatus = "thinking" | "streaming" | "done";

export type ChatMessage<TMeta = undefined> = {
  id: string;
  role: ChatRole;
  text: string;
  status: ChatMessageStatus;
  meta?: TMeta;
};
