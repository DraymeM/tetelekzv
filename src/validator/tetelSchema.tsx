import { z } from "zod";

export const subsectionSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "A cím nem lehet üres!"),
  description: z.string(),
});

export const sectionSchema = z.object({
  id: z.number().optional(),
  content: z.string().min(1, "A szekció tartalma nem lehet üres!"),
  subsections: z
    .array(subsectionSchema)
    .nullable()
    .transform((val) => val || []),
});

export const flashcardSchema = z.object({
  id: z.number().optional(),
  question: z.string().min(1, "Üresen ne hagyd, zárd be ha nem akarsz."),
  answer: z.string().min(1, "Üresen ne hagyd, zárd be ha nem akarsz."),
});

export const tetelSchema = z.object({
  name: z.string().min(1, "Tétel cím megadása kötelező!"),
  osszegzes: z.string().min(1, "Összegzés megadása kötelező!"),
  sections: z.array(sectionSchema).min(1, "Legalább egy szekció legyen!"),
  flashcards: z
    .array(flashcardSchema)
    .nullable()
    .transform((val) => val || []),
});
