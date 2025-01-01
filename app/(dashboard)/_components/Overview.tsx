"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { UserSettings } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import StatsCard from "./StatsCard";
import CategoryStats from "./CategoryStats";

const Overview = ({ userSettings }: { userSettings: UserSettings }) => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  if (!loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <DateRangePicker
          initialCompareFrom={dateRange.from}
          initialDateTo={dateRange.to}
          showCompare={false}
          onUpdate={(values) => {
            const { from, to } = values.range;
            if (!from || !to) return;
            if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
              toast.error(
                `Date range cannot be more than ${MAX_DATE_RANGE_DAYS} days`
              );
              return;
            }
            setDateRange({ from, to });
          }}
        />
      </div>
      <StatsCard
        userSettings={userSettings}
        from={dateRange.from}
        to={dateRange.to}
      />
      <CategoryStats
        userSettings={userSettings}
        from={dateRange.from}
        to={dateRange.to}
      />
    </>
  );
};

export default Overview;
