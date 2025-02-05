import { H1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ReportsPage() {
  return (
    <>
      <div className="sticky top-16 z-10 flex items-center justify-between bg-gray-bg">
        <H1>Reports</H1>
        <Link href="/dashboard/reports/new">
          <Button>New Report</Button>
        </Link>
      </div>
      <div className="mt-4 grid gap-4">
        <Link href="/dashboard/reports/revenue">
          <div className="rounded-lg border bg-background p-4 hover:bg-muted/50">
            <h2 className="text-lg font-semibold">Revenue Report</h2>
            <p className="text-sm text-muted-foreground">
              View annual recurring revenue by representative
            </p>
          </div>
        </Link>
      </div>
    </>
  );
}
