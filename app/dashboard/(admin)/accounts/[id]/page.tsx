import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { H1, H2 } from "@/components/typography";
import {
  getAccountProfile,
  getAccountHoldings,
} from "@/server/actions/accounts";
import { DataTable } from "@/components/data-table";
import { columns } from "@/app/dashboard/(admin)/holdings/columns";
import { AccountMenu } from "@/components/account-menu";

interface AccountProfilePageProps {
  params: {
    id: string;
  };
}

export default async function AccountProfilePage({
  params,
}: AccountProfilePageProps) {
  const { id } = params;
  const decodedId = decodeURIComponent(id);

  const [account, holdings] = await Promise.all([
    getAccountProfile(decodedId),
    getAccountHoldings(decodedId),
  ]);

  if (!account) {
    return <div>Account not found</div>;
  }

  const riskTolerances = {
    "HA~": "Highly Aggressive",
    AGG: "Aggressive",
    "MA~": "Moderate Aggressive",
    "M~~": "Moderate",
    "MC~": "Moderate Conservative",
    CON: "Conservative",
    "D~~": "Defensive",
    "~~~": "None",
  };

  const leftColumnFields = [
    { label: "Status", value: account.status || "N/A" },
    {
      label: "Established Date",
      value: account.estDate
        ? new Date(account.estDate).toLocaleDateString()
        : "N/A",
    },
    { label: "Tax ID", value: account.tin || "N/A" },
    { label: "Account Type", value: account.accountType || "N/A" },
    { label: "PCM", value: account.pcm || "N/A" },
    { label: "Branch", value: account.branch || "N/A" },
    { label: "Email", value: account.accountEmail || "N/A" },
    { label: "Registration 1", value: account.registration1 || "N/A" },
    { label: "Registration 2", value: account.registration2 || "N/A" },
  ];

  const rightColumnFields = [
    { label: "Registration 3", value: account.registration3 || "N/A" },
    { label: "Client Residence State", value: account.clientResState || "N/A" },
    { label: "Investment Objective", value: account.invObjective || "N/A" },
    {
      label: "Risk Tolerance",
      value:
        riskTolerances[account.riskTolerance as keyof typeof riskTolerances] ||
        "N/A",
    },
    { label: "Time Horizon", value: account.timeHorizon || "N/A" },
    {
      label: "17a-3 Date",
      value: account.date17A3
        ? new Date(account.date17A3).toLocaleDateString()
        : "N/A",
    },
    { label: "17a-3 Method", value: account.method17A3 || "N/A" },
    { label: "Email Authorization", value: account.emailAuth ? "Yes" : "No" },
  ];

  return (
    <div className="p-4 outline-none">
      <div className="flex items-center justify-between">
        <H1>{account.searchid || account.accountId}</H1>
        <AccountMenu account={account} />
      </div>

      <div className="outline-none">
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <H2>Account Details</H2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leftColumnFields.map((field) => (
                  <div key={field.label} className="flex items-center gap-2">
                    <div className="w-1/2 font-semibold">{field.label}:</div>
                    <div>{field.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <H2>Additional Information</H2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rightColumnFields.map((field) => (
                  <div key={field.label} className="flex items-center gap-2">
                    <div className="w-1/2 font-semibold">{field.label}:</div>
                    <div>{field.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {holdings && (
          <div className="mt-4">
            <H2>Holdings</H2>
            <DataTable
              columns={columns}
              data={holdings}
              basePath="/dashboard/holdings"
              idField="holdingId"
              searchField="securityName"
              stickySearch={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
