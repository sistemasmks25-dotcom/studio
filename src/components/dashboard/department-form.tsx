"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Department } from "@/lib/data";
import { saveDepartment } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type DepartmentFormProps = {
  department?: Department | null;
  onFormSubmit: () => void;
};

export function DepartmentForm({ department, onFormSubmit }: DepartmentFormProps) {
  const [isSavePending, startSaveTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: department?.name || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startSaveTransition(async () => {
        const payload = {
            ...values,
            id: department?.id,
        };
        const result = await saveDepartment(payload);
        if (result.success) {
            toast({ title: "Department Saved", description: "The department has been saved successfully." });
            onFormSubmit();
        } else {
            toast({ variant: 'destructive', title: 'Save Failed', description: result.error });
        }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField name="name" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Department Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Engineering" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <Button type="submit" className="w-full" disabled={isSavePending}>
            {isSavePending ? 'Saving...' : 'Save Department'}
        </Button>
      </form>
    </Form>
  );
}