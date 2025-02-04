import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RepMenu } from "@/components/rep-menu";
import { H1, H2, H3 } from "@/components/typography";
import { DataTable } from "@/components/data-table";
import { columns } from "@/app/dashboard/(admin)/accounts/columns";

import {
  getRepAddresses,
  getRepPhones,
  getRepEmails,
  getRepProfile,
} from "@/server/actions/reps";
import { getAccountsByPCM } from "@/server/actions/accounts";

interface RepProfilePageProps {
  params: {
    id: string;
  };
}

export default async function RepProfilePage({ params }: RepProfilePageProps) {
  const { id } = params;

  const [rep, addresses, emails, phones] = await Promise.all([
    getRepProfile(id),
    getRepAddresses(id),
    getRepEmails(id),
    getRepPhones(id),
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
    { label: "TIN", value: rep.tin || "N/A" },
  ];

  return (
    <div className="max-h-screen overflow-y-auto overflow-x-hidden">
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
                  <div className="w-40 font-semibold">{field.label}:</div>
                  <div>{field.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <H2>Contact</H2>
          </CardHeader>
          <CardContent>
            <div>
              <H3>Email</H3>
              {emails.map((email) => (
                <div key={email.emailId} className="mb-2">
                  <div className="font-medium capitalize">
                    {email.emailType}
                  </div>
                  <div>{email.emailAddress}</div>
                </div>
              ))}
              {emails.length === 0 && (
                <div className="text-gray-500">No associated emails</div>
              )}

              <H3 className="mt-2">Phone</H3>
              {phones.map((phone) => (
                <div key={phone.phoneId} className="mb-2">
                  <div className="font-medium capitalize">
                    {phone.phoneType}
                  </div>
                  <div>{phone.phoneNumber}</div>
                </div>
              ))}
              {phones.length === 0 && (
                <div className="text-gray-500">No associated phone numbers</div>
              )}

              <H3 className="mb-1 mt-2">Address</H3>
              {addresses.map((address) => (
                <div key={address.addressId} className="mb-2">
                  <div className="font-medium capitalize">
                    {address.addressType}
                  </div>
                  <div>
                    {address.address1} {address.address2 || ""}
                  </div>
                  <div>
                    {address.city}, {address.state} {address.zip}
                  </div>
                </div>
              ))}
              {addresses.length === 0 && (
                <div className="text-gray-500">No associated addresses</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <H2>Accounts</H2>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={accounts}
              basePath="/dashboard/accounts"
              idField="accountId"
              searchField="searchid"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
