import { z } from "zod";

export const answerSchema = z.object({
  text: z.string().min(1, "A válasz szövege nem lehet üres"),
  isCorrect: z.boolean(),
});

export const multiQuestionSchema = z.object({
  question: z.string().min(1, "A kérdés megadása kötelező"),
  answers: z
    .array(answerSchema)
    .length(4, "Pontosan négy válasz szükséges")
    .refine((answers) => answers.some((ans) => ans.isCorrect), {
      message: "Legalább egy válasznak helyesnek kell lennie",
    }),
});
