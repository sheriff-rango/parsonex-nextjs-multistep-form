import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { H1, H2, H3 } from "@/components/typography";
import { DataTable } from "@/components/data-table";
import { columns } from "@/app/dashboard/(admin)/accounts/columns";
import { getClientProfile } from "@/server/actions/clients";
import { emails, phones, addresses } from "@/server/db/schema";
import { InferSelectModel } from "drizzle-orm";

interface ClientProfilePageProps {
  params: {
    id: string;
  };
}

type Email = InferSelectModel<typeof emails>;
type Phone = InferSelectModel<typeof phones>;
type Address = InferSelectModel<typeof addresses>;

export default async function ClientProfilePage({
  params,
}: ClientProfilePageProps) {
  const { id } = params;
  const decodedId = decodeURIComponent(id);
  console.log("Page received client ID:", id);
  console.log("Decoded client ID:", decodedId);

  const result = await getClientProfile(decodedId);

  if (!result) {
    return <div>Client not found</div>;
  }

  const { client, finProfile, addresses, emails, phones, accounts } = result;

  const clientFields = [
    { label: "Status", value: client.isActive ? "Active" : "Inactive" },
    {
      label: "Date of Birth",
      value: client.dob ? new Date(client.dob).toLocaleDateString() : "N/A",
    },
    { label: "Marital Status", value: client.maritalstatus || "N/A" },
    { label: "Gender", value: client.gender || "N/A" },
    { label: "SSN/Tax ID", value: client.ssnTaxid || "N/A" },
    { label: "Employment Status", value: client.employmentStatus || "N/A" },
    { label: "Occupation", value: client.employmentOccupation || "N/A" },
    { label: "Employer", value: client.employer || "N/A" },
    { label: "US Citizen", value: client.isUscitizen ? "Yes" : "No" },
  ];

  const finProfileFields = finProfile
    ? [
        {
          label: "Net Worth",
          value: finProfile.networth
            ? `$${Number(finProfile.networth).toLocaleString()}`
            : "N/A",
        },
        {
          label: "Liquid Net Worth",
          value: finProfile.networthLiquid
            ? `$${Number(finProfile.networthLiquid).toLocaleString()}`
            : "N/A",
        },
        {
          label: "Annual Income",
          value: finProfile.incomeAnnual
            ? `$${Number(finProfile.incomeAnnual).toLocaleString()}`
            : "N/A",
        },
        { label: "Tax Bracket", value: finProfile.taxbracket || "N/A" },
        {
          label: "Investment Experience",
          value: finProfile.investExperience || "N/A",
        },
        {
          label: "Experience Years",
          value: finProfile.investExperienceYears || "N/A",
        },
      ]
    : [];

  return (
    <div className="max-h-screen overflow-y-auto overflow-x-hidden outline-none">
      <div className="flex items-center justify-between">
        <div>
          <H1>{client.nameFull}</H1>
          <H3>
            {client.riaClient ? "RIA" : ""} {client.bdClient ? "BD" : ""} Client
            | Rep: {client.repFullname}
          </H3>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <H2>General Information</H2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {clientFields.map((field) => (
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
            <H2>Financial Profile</H2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {finProfileFields.map((field) => (
                <div key={field.label} className="flex items-center gap-2">
                  <div className="w-40 font-semibold">{field.label}:</div>
                  <div>{field.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <H2>Contact Information</H2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <H3>Email</H3>
                {emails.map((email: Email) => (
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
              </div>

              <div>
                <H3>Phone</H3>
                {phones.map((phone: Phone) => (
                  <div key={phone.phoneId} className="mb-2">
                    <div className="font-medium capitalize">
                      {phone.phoneType}
                    </div>
                    <div>{phone.phoneNumber}</div>
                  </div>
                ))}
                {phones.length === 0 && (
                  <div className="text-gray-500">
                    No associated phone numbers
                  </div>
                )}
              </div>

              <div>
                <H3>Address</H3>
                {addresses.map((address: Address) => (
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
