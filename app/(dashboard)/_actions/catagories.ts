"use server";

import prisma from "@/lib/prisma";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schemas/categories";
import { currentUser } from "@clerk/nextjs/server";

export async function CreateCatagory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Invalid form data");
  }

  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { name, icon, type } = parsedBody.data;

  return await prisma.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });
}
