"use client";

import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusSquare, TrashIcon, TrendingDown, TrendingUp } from "lucide-react";
import React, { ReactNode, useEffect } from "react";
import CreateCategoryDialog from "../_components/CreateCategoryDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import DeleteCategoryDialog from "../_components/DeleteCategoryDialog";

const ManagePage = () => {
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  if (!loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b bg-card">
        <div className="container flex flex-wrap gap-6 py-8 items-center justify-between">
          <div>
            <p className="text-3xl font-bold">Manage</p>
            <p className="text-muted-foreground">
              Manage your account settings and catagories
            </p>
          </div>
        </div>
      </div>
      <div className="container flex flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>Set your default currency</CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <CategoryList type="expense" />
        <CategoryList type="income" />
      </div>
    </div>
  );
};

export default ManagePage;

function CategoryList({ type }: { type: TransactionType }) {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const availableData = categoriesQuery.data && categoriesQuery.data.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {type === "expense" ? (
              <TrendingDown className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-400" />
            ) : (
              <TrendingUp className="h-12 w-12 items-center rounded-lg bg-green-400/10 p-2 text-green-400" />
            )}

            <div>
              {type === "expense" ? "Expenses" : "Incomes"}{" "}
              <span> categories</span>
              <div className="text-sm text-muted-foreground">
                <p>Sorted by name</p>
              </div>
            </div>
          </div>
          <CreateCategoryDialog
            type={type}
            successCallback={() => categoriesQuery.refetch()}
            trigger={
              <Button className="gap-2 text-sm">
                <PlusSquare className="h-4 w-4" />
                Create category
              </Button>
            }
          />
        </CardTitle>
      </CardHeader>
      <Separator />
      {!availableData && (
        <div className="flex h-40 w-full flex-col  items-center justify-center">
          <p>
            No
            <span
              className={cn(
                "m-1",
                type === "expense" ? "text-red-400" : "text-green-400"
              )}
            >
              {type}
            </span>
            category yet
          </p>
          <p className="text-sm text-muted-foreground">
            Create a category to get started
          </p>
        </div>
      )}

      {availableData && (
        <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categoriesQuery.data.map((category: Category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      )}
    </Card>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>

      {/* <DeleteCategoryDialog
        category={category}
        trigger={
          <Button className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20">
            <TrashIcon className="h-4 w-4" />
            Remove
          </Button>
        }
      /> */}
    </div>
  );
}
