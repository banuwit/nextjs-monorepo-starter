import type { z } from "zod";
import type { noteSchema } from "../schemas/note.schema";

export type Note = z.infer<typeof noteSchema>;

export type Person = { id: string; label: string; role: string };
