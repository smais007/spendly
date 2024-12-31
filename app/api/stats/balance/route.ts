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

  const stats = await getBalanceStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(stats);
}

export type GetBalanceStatsResponse = Awaited<
  ReturnType<typeof getBalanceStats>
>;

async function getBalanceStats(userId: string, from: Date, to: Date) {
  const totals = await prisma.transaction.groupBy({
    by: ["type"],
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
  });

  return {
    income: totals.find((t) => t.type === "income")?._sum.amount || 0,
    expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
  };
}
