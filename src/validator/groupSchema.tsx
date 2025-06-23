import { z } from "zod";

export const groupSchema = z.object({
  name: z
    .string()
    .min(1, "A név megadása kötelező")
    .max(30, "A név legfeljebb 30 karakter lehet"),
  public: z.boolean().optional(),
});

export type GroupFormData = z.infer<typeof groupSchema>;
