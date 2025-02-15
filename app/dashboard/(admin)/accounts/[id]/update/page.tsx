import { getAccountProfile } from "@/server/actions/accounts";
import { getListValues } from "@/server/actions/lists";
import { AccountForm } from "@/components/account-form";
import { H1 } from "@/components/typography";
import { AccountFormValues } from "@/types/forms";

export default async function UpdateAccountPage({
  params,
}: {
  params: { id: string };
}) {
  const id = decodeURIComponent(params.id);
  const [
    account,
    accountTypes,
    maritalStatusTypes,
    riskToleranceTypes,
    timeHorizonTypes,
    invObjectiveTypes,
  ] = await Promise.all([
    getAccountProfile(id),
    getListValues("account_types"),
    getListValues("marital_status"),
    getListValues("risk_tolerance"),
    getListValues("time_horizon"),
    getListValues("investment_objectives"),
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

  const lists = {
    account_types: accountTypes,
    marital_status: maritalStatusTypes,
    risk_tolerance: riskToleranceTypes,
    time_horizon: timeHorizonTypes,
    investment_objectives: invObjectiveTypes,
  };

  return (
    <div className="flex h-full flex-col p-4">
      <H1>Update Account</H1>
      <AccountForm data={formData} accountId={id} lists={lists} />
    </div>
  );
}
