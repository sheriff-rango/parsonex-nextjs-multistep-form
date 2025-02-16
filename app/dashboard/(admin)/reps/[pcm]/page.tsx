import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RepMenu } from "@/components/rep-menu";
import { H1, H2, H3 } from "@/components/typography";
import { DataTable } from "@/components/data-table";
import { columns } from "@/app/dashboard/(admin)/accounts/columns";
import { ContactCard } from "@/components/contact-card";

import {
  getRepAddresses,
  getRepPhones,
  getRepEmails,
  getRepProfile,
} from "@/server/actions/reps";
import { getAccountsByPCM } from "@/server/actions/accounts";

type Params = Promise<{ pcm: string }>;

export default async function RepProfilePage({ params }: { params: Params }) {
  const { pcm } = await params;

  const [rep, addresses, emails, phones] = await Promise.all([
    getRepProfile(pcm),
    getRepAddresses(pcm),
    getRepEmails(pcm),
    getRepPhones(pcm),
  ]);

  if (!rep) {
    return <div>Rep not found</div>;
  }

  const accounts = rep.pcm ? await getAccountsByPCM(rep.pcm) : [];

  const repFields = [
    { label: "Rep Type", value: rep.repType || "N/A" },
    { label: "Status", value: rep.isActive ? "Active" : "Inactive" },
    { label: "Branch Manager", value: rep.isBranchMgr ? "Yes" : "No" },
    { label: "Date of Birth", value: rep.dob || "N/A" },
    { label: "Marital Status", value: rep.maritalStatus || "N/A" },
    { label: "Gender", value: rep.gender || "N/A" },
    { label: "TIN", value: rep.tin ? "XXX-XX-" + rep.tin.slice(-4) : "N/A" },
  ];

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div>
          <H1>{rep.fullName}</H1>
          <H3>
            {rep.repType} | {rep.pcm}
          </H3>
        </div>

        <RepMenu rep={rep} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <H2>General</H2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {repFields.map((field) => (
                <div key={field.label} className="flex items-center gap-2">
                  <div className="w-1/2 font-semibold">{field.label}:</div>
                  <div>{field.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <ContactCard emails={emails} phones={phones} addresses={addresses} />
      </div>

      {accounts && (
        <div className="mt-4">
          <H2>Accounts</H2>
          <DataTable
            columns={columns}
            data={accounts}
            basePath="/dashboard/accounts"
            idField="accountId"
            searchField="searchid"
            stickySearch={false}
          />
        </div>
      )}
    </div>
  );
}
