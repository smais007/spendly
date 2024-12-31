import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schemas/overview";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error, { status: 400 });
  }

  const stats = await getCategoriedStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(stats);
}

export type GetCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriedStats>
>;

async function getCategoriedStats(userId: string, from: Date, to: Date) {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  return stats;
}
