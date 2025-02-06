"use client";

import { H1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud, CheckCircle2 } from "lucide-react";
import { createSubmission } from "@/server/actions/submissions";

const formSchema = z.object({
  clientFirstName: z.string().min(1, "First name is required"),
  clientLastName: z.string().min(1, "Last name is required"),
  accountType: z.string().min(1, "Account type is required"),
  tradeAmount: z.string().min(1, "Trade amount is required"),
  dateReceived: z.string().min(1, "Date received is required"),
  estGdc: z.string().min(1, "Estimated GDC is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewSubmissionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientFirstName: "",
      clientLastName: "",
      accountType: "",
      tradeAmount: "",
      dateReceived: "",
      estGdc: "",
      notes: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);
      await createSubmission({
        ...values,
        tradeAmount: parseFloat(values.tradeAmount),
        estGdc: parseFloat(values.estGdc),
        statusId: 1, // Pending
      });
      router.push("/dashboard/submissions");
    } catch (error) {
      console.error("Error creating submission:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <H1>New PSI Submission</H1>

      <div className="mt-4 space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex w-full items-center justify-center">
              <label
                htmlFor="file-upload"
                className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-muted/50"
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  {uploadedFile ? (
                    <>
                      <CheckCircle2 className="mb-2 h-8 w-8 text-green-500" />
                      <p className="text-sm text-muted-foreground">
                        {uploadedFile.name}
                      </p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        CSV, Excel, or PDF files
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadedFile(file);
                    }
                  }}
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IRA">IRA</SelectItem>
                          <SelectItem value="ROTH">Roth IRA</SelectItem>
                          <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                          <SelectItem value="JOINT">Joint</SelectItem>
                          <SelectItem value="TRUST">Trust</SelectItem>
                          <SelectItem value="401K">401(k)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tradeAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trade Amount</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateReceived"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Received</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="estGdc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated GDC</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/submissions")}
                  >
                    Cancel
                  </Button>
                  <Button disabled={isLoading} type="submit">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Submission"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
