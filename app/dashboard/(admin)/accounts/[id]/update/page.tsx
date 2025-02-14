import { getAccountProfile, getAccountTypes } from "@/server/actions/accounts";
import { AccountForm } from "@/components/account-form";
import { H1 } from "@/components/typography";
import { AccountFormValues } from "@/types/forms";

export default async function UpdateAccountPage({
  params,
}: {
  params: { id: string };
}) {
  const id = decodeURIComponent(params.id);
  const [account, accountTypes] = await Promise.all([
    getAccountProfile(id),
    getAccountTypes(),
  ]);

  if (!account) {
    return <div>Account not found</div>;
  }

  const formData: AccountFormValues = {
    accountType: account.accountType || "",
    pcm: account.pcm || "",
    primaryClientId: account.clientIdPrimary || "",
    jointClientId: account.clientIdJoint || "",
    status: account.status || "active",
    openDate: account.estDate,
    closeDate: account.termDate,
    branch: account.branch || "",
    invObjective: account.invObjective || "",
    riskTolerance: account.riskTolerance || "",
    timeHorizon: account.timeHorizon || "",
    date17A3: account.date17A3,
    method17A3: account.method17A3 || "",
  };

  return (
    <div className="flex h-full flex-col p-4">
      <H1>Update Account</H1>
      <AccountForm data={formData} accountId={id} accountTypes={accountTypes} />
    </div>
  );
}
