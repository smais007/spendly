"use client";

import { Tabs } from "@/components/ui/tabs";
import { Period, Timeframe } from "@/lib/types";
import { useQueries, useQuery } from "@tanstack/react-query";
import React from "react";

interface HistoryPeriodSelectorProps {
  period: Period;
  setPeriod: (period: Period) => void;
  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
}

const HistoryPeriodSelector = ({
  period,
  setPeriod,
  timeframe,
  setTimeframe,
}: HistoryPeriodSelectorProps) => {
  const historyPeriods = useQuery({
    queryKey: ["history", "periods", "overview"],
    queryFn: () => fetch("/api/history-periods").then((res) => res.json()),
  });

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Tabs
        value={timeframe}
        onValueChange={(value) => setTimeframe(value as Timeframe)}
      ></Tabs>
    </div>
  );
};

export default HistoryPeriodSelector;
