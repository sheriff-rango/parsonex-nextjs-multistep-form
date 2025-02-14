import { H1 } from "@/components/typography";
import { AccountForm } from "@/components/account-form";
import { getAccountTypes } from "@/server/actions/accounts";
export default async function NewAccountPage() {
  const accountTypes = await getAccountTypes();
  return (
    <div className="container py-6">
      <H1>Create New Account</H1>
      <AccountForm accountTypes={accountTypes} />
    </div>
  );
}
