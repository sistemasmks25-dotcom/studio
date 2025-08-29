"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Password } from "@/lib/data";
import { PasswordGenerator } from "../password-generator";
import { getPasswordExpirySuggestion, savePassword } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  passwordValue: z.string().min(1, "Password is required"),
  url: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  notes: z.string().optional(),
  folder: z.string().min(1, "Folder is required"),
  usageFrequency: z.coerce.number().min(0, "Usage frequency must be positive"),
  expiryDate: z.date().optional(),
});

type PasswordFormProps = {
  password?: Password | null;
  onFormSubmit: () => void;
};

export function PasswordForm({ password, onFormSubmit }: PasswordFormProps) {
  const [isAISuggestionPending, startAISuggestionTransition] = useTransition();
  const [isSavePending, startSaveTransition] = useTransition();
  const [suggestion, setSuggestion] = useState<{ expiryDate: string; reason: string } | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: password?.name || "",
      username: password?.username || "",
      passwordValue: password?.passwordValue || "",
      url: password?.url || "",
      notes: password?.notes || "",
      folder: password?.folder || "Uncategorized",
      usageFrequency: 5, // Default value
      expiryDate: password?.expiryDate ? new Date(password.expiryDate) : undefined,
    },
  });

  const passwordValue = useWatch({ control: form.control, name: "passwordValue" });
  const usageFrequency = useWatch({ control: form.control, name: "usageFrequency" });

  useEffect(() => {
    if (passwordValue && passwordValue.length > 5) {
      const handler = setTimeout(() => {
        startAISuggestionTransition(async () => {
          setSuggestion(null);
          const result = await getPasswordExpirySuggestion({
            password: passwordValue,
            lastChangedDate: new Date().toISOString(),
            usageFrequency: usageFrequency,
          });
          if ('expiryDate' in result) {
            setSuggestion(result);
          } else {
            toast({ variant: 'destructive', title: 'AI Suggestion Failed', description: result.error });
          }
        });
      }, 1000); // Debounce
      return () => clearTimeout(handler);
    }
  }, [passwordValue, usageFrequency, toast]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    startSaveTransition(async () => {
        const payload = {
            ...values,
            id: password?.id,
            expiryDate: values.expiryDate ? format(values.expiryDate, 'yyyy-MM-dd') : undefined,
        };
        const result = await savePassword(payload);
        if (result.success) {
            toast({ title: "Password Saved", description: "Your password has been saved successfully." });
            onFormSubmit();
        } else {
            toast({ variant: 'destructive', title: 'Save Failed', description: result.error });
        }
    });
  }
  
  const applySuggestion = () => {
    if (suggestion) {
      form.setValue('expiryDate', new Date(suggestion.expiryDate));
      setSuggestion(null);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField name="name" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g., Google Account" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField name="username" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="name@company.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="passwordValue" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Password</FormLabel><FormControl><PasswordGenerator onPasswordGenerated={(p) => field.onChange(p)} initialPassword={field.value} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <FormField name="url" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>URL</FormLabel><FormControl><Input placeholder="https://google.com" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField name="folder" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Folder</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a folder" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Work">Work</SelectItem><SelectItem value="Personal">Personal</SelectItem><SelectItem value="Uncategorized">Uncategorized</SelectItem></SelectContent></Select><FormMessage /></FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField name="usageFrequency" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Logins per week</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="expiryDate" control={form.control} render={({ field }) => (
            <FormItem className="flex flex-col"><FormLabel>Expiry Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
            )} />
        </div>

        { (isAISuggestionPending || suggestion) &&
          <div className="p-3 rounded-md border bg-accent/10 border-accent/20">
            <div className="flex items-center gap-2 text-sm font-semibold text-accent mb-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>AI Suggestion</span>
              {isAISuggestionPending && <span className="text-xs font-normal animate-pulse">(analyzing...)</span>}
            </div>
            {suggestion && !isAISuggestionPending && (
                <>
                    <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                    <Button type="button" size="sm" variant="outline" className="mt-2" onClick={applySuggestion}>
                        Apply suggestion: {format(new Date(suggestion.expiryDate), 'PPP')}
                    </Button>
                </>
            )}
          </div>
        }

        <FormField name="notes" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea placeholder="Any additional information..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <Button type="submit" className="w-full" disabled={isSavePending}>
            {isSavePending ? 'Saving...' : 'Save Password'}
        </Button>
      </form>
    </Form>
  );
}
