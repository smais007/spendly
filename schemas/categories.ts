import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(50),
  icon: z.string().min(1).max(50),
  type: z.enum(["income", "expense"]),
});

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;
