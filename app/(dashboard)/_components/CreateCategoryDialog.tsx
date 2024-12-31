"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schemas/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleOff, Loader2, PlusSquare } from "lucide-react";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCatagory } from "../_actions/catagories";
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface Props {
  type: TransactionType;
  successCallback: (category: Category) => void;
}
const CreateCategoryDialog = ({ type, successCallback }: Props) => {
  const [open, setOpen] = React.useState(false);

  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      type,
    },
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCatagory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: "",
        icon: "",
        type,
      });
      toast.success(`Category ${data.name} created successfully`, {
        id: "create-category",
      });

      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setOpen((prev) => !prev);
    },

    onError: () => {
      toast.error("Failed to create category", {
        id: "create-category",
      });
    },
  });

  const onSubmit = useCallback(
    (values: CreateCategorySchemaType) => {
      toast.loading("Creating category...", {
        id: "create-category",
      });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          variant={"outline"}
          className="flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground"
        >
          <PlusSquare className="mr-2 h-4 w-4" />
          Create new category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create{" "}
            <span
              className={cn(
                "font-bold",
                type === "expense" ? "text-red-500" : "text-green-500"
              )}
            >
              {type}
            </span>{" "}
            category
          </DialogTitle>
          <DialogDescription>
            Categories are used to group your transactions
          </DialogDescription>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input defaultValue={""} {...field} />
                    </FormControl>
                    <FormDescription>Transaction category name</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-[100px] w-full"
                          >
                            {form.watch("icon") ? (
                              <div className="flex items-center flex-col gap-2">
                                <span className="text-5xl" role="img">
                                  {field.value}
                                </span>
                                <p className="text-muted-foreground text-xs">
                                  Click to change icon
                                </p>
                              </div>
                            ) : (
                              <div className="flex items-center flex-col gap-2">
                                <CircleOff className="h-[48px] w-[48px]" />
                                <p className="text-muted-foreground text-xs">
                                  Click to select icon
                                </p>
                              </div>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full">
                          <Picker
                            theme={theme.resolvedTheme}
                            data={data}
                            onEmojiSelect={(emoji: { native: string }) => {
                              field.onChange(emoji.native);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>
                      This is how ypur categorry will appear in this application
                    </FormDescription>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => {
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
              {!isPending && "Create"}
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
