import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Overview from "./_components/Overview";
import History from "./_components/History";

const Page = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap gap-6 py-8 items-center justify-between">
          <p className="text-3xl font-bold">
            Hello, <span>{user.firstName}</span> 🤚
          </p>

          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <div>
                  <Button
                    variant={"outline"}
                    className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-900 hover:text-white"
                  >
                    New Income
                  </Button>
                </div>
              }
              type="income"
            />

            <CreateTransactionDialog
              trigger={
                <div>
                  <Button
                    variant={"outline"}
                    className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-900 hover:text-white"
                  >
                    New Expense
                  </Button>
                </div>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
};

export default Page;
