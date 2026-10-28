import type { ChatMessage } from "./chat";

export type PageSource = {
  id: string;
  title: string;
  description: string;
};

export type CornerChatMeta = {
  /** Judul konteks halaman yang dilampirkan saat pesan dikirim/dijawab. */
  sources?: string[];
  rating?: "up" | "down";
};

export type CornerChatMessage = ChatMessage<CornerChatMeta>;

export type CornerChatThread = {
  id: string;
  title: string;
  updatedAt: string;
  pinned: boolean;
  messages: CornerChatMessage[];
};

export type ReplyEntry = {
  keywords: string[];
  /** Jawaban membutuhkan konteks halaman yang dilampirkan. */
  needsContext: boolean;
  answer: string;
};
