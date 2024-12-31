import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get("type");

  const validator = z.enum(["income", "expense"]).nullable();
  const queryParams = validator.safeParse(paramType);
  if (!queryParams.success) {
    return Response.json(queryParams.error, { status: 400 });
  }

  const type = queryParams.data;

  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }),
    },
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(categories);
}
