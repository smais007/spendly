"use client";
import { GetBalanceStatsResponse } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import CountUp from "react-countup";

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

const StatsCard = ({ from, to, userSettings }: Props) => {
  const statsQuery = useQuery<GetBalanceStatsResponse>({
    queryKey: ["stats", "overview", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;

  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      {/* <SkeletonWrapper isLoading={statsQuery.isFetching}> */}
      <StatCard
        formatter={formatter}
        value={income}
        title="Income"
        icon={<TrendingUp className="text-green-500 size-12" />}
      />
      {/* </SkeletonWrapper> */}
      <StatCard
        formatter={formatter}
        value={expense}
        title="Expense"
        icon={<TrendingDown className="text-green-500 size-12" />}
      />
      <StatCard
        formatter={formatter}
        value={balance}
        title="Balance"
        icon={<Wallet className="text-green-500 size-12" />}
      />
    </div>
  );
};

export default StatsCard;

interface StatCardProps {
  formatter: Intl.NumberFormat;
  value: number;
  title: string;
  icon: React.ReactNode;
}

function StatCard({ formatter, value, title, icon }: StatCardProps) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className="flex h-24 w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-center gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
