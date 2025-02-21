import { H1 } from "@/components/typography";
import { AccountForm } from "@/components/Forms/account-form";
import { getListValues } from "@/server/actions/lists";

export default async function NewAccountPage() {
  const [
    accountTypes,
    maritalStatusTypes,
    riskToleranceTypes,
    timeHorizonTypes,
    invObjectiveTypes,
  ] = await Promise.all([
    getListValues("account_types"),
    getListValues("marital_status"),
    getListValues("risk_tolerance"),
    getListValues("time_horizon"),
    getListValues("investment_objectives"),
  ]);

  const lists = {
    account_types: accountTypes,
    marital_status: maritalStatusTypes,
    risk_tolerance: riskToleranceTypes,
    time_horizon: timeHorizonTypes,
    investment_objectives: invObjectiveTypes,
  };

  return (
    <div className="container py-6">
      <H1>Create New Account</H1>
      <AccountForm lists={lists} />
    </div>
  );
}
