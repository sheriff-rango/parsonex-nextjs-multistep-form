import { H1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import Link from "next/link";
import { getSubmissions } from "@/server/actions/submissions";

export default async function SubmissionsPage() {
  const submissions = await getSubmissions();

  return (
    <>
      <div className="flex items-center justify-between">
        <H1>PSI Submissions</H1>
        <Button asChild>
          <Link href="/dashboard/submissions/new">New Submission</Link>
        </Button>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={submissions}
          searchField="clientLastName"
          basePath="/dashboard/submissions"
          idField="submissionId"
        />
      </div>
    </>
  );
}
