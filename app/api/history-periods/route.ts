import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const periods = await getHistoryPeriods(user.id);
  return Response.json(periods);
}

export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

async function getHistoryPeriods(userId: string) {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: {
      year: "desc",
    },
  });

  const years = result.map((el) => el.year);

  if (years.length === 0) {
    return [new Date().getFullYear()];
  }

  return years;
}
