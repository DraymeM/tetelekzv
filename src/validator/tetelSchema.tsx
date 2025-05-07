// validator/tetelSchema.ts
import { z } from "zod";

const idSchema = z
  .preprocess(
    (val) => (val !== undefined ? Number(val) : undefined),
    z.number()
  )
  .optional();

export const subsectionSchema = z.object({
  id: idSchema,
  title: z.string().min(1, "A cím nem lehet üres!"),
  description: z.string(),
});

export const sectionSchema = z.object({
  id: idSchema,
  content: z.string().min(1, "A szekció tartalma nem lehet üres!"),
  subsections: z
    .array(subsectionSchema)
    .nullable()
    .transform((val) => val || []),
});

export const flashcardSchema = z.object({
  id: idSchema,
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
