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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { Loader2 } from "lucide-react";
import { generateReport } from "@/server/actions/reports";
import { toast } from "sonner";

const formSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  productType: z.string().optional(),
  isArr: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewReportPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      isArr: false,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);
      setHasSubmitted(true);
      const result = await generateReport(values);
      if (result) {
        setData(result);
      } else {
        toast.error("Error generating report");
      }
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <H1>Generate Report</H1>

      <div className="mt-4 space-y-4">
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
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Products</SelectItem>
                          <SelectItem value="MF~">Mutual Fund</SelectItem>
                          <SelectItem value="MFT">
                            Mutual Fund Trails
                          </SelectItem>
                          <SelectItem value="IN~">Insurance</SelectItem>
                          <SelectItem value="VA~">Variable Annuity</SelectItem>
                          <SelectItem value="VAT">
                            Variable Annuity Trails
                          </SelectItem>
                          <SelectItem value="TRL">Trails (General)</SelectItem>
                          <SelectItem value="AM~">
                            Asset Management Fees
                          </SelectItem>
                          <SelectItem value="FXA">Fixed Annuity</SelectItem>
                          <SelectItem value="529">529s</SelectItem>
                          <SelectItem value="5TR">529 Trails</SelectItem>
                          <SelectItem value="AFF">
                            Affiliate Referrals
                          </SelectItem>
                          <SelectItem value="4KT">401k Trail</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isArr"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Annual Recurring Revenue Only</FormLabel>
                    </FormItem>
                  )}
                />

                <Button disabled={isLoading} type="submit">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Report"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {hasSubmitted && (
          <>
            {data.length > 0 ? (
              <DataTable
                columns={columns}
                data={data}
                searchField="rep_name"
                stickySearch={false}
              />
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No results found for the selected criteria.
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
