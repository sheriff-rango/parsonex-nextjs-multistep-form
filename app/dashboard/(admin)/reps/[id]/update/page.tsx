import { RepForm } from "@/components/rep-form";
import { H1 } from "@/components/typography";
import {
  getRep,
  getRepAddresses,
  getRepEmails,
  getRepPhones,
} from "@/server/actions/reps";

export default async function UpdateRepPage({
  params,
}: {
  params: { id: string };
}) {
  const [rawRepData, addressData, emailData, phoneData] = await Promise.all([
    getRep(params.id),
    getRepAddresses(params.id),
    getRepEmails(params.id),
    getRepPhones(params.id),
  ]);

  if (!rawRepData) {
    return <div>Rep not found</div>;
  }

  const sanitizedRepData = {
    ...rawRepData,
    firstName: rawRepData.firstName || "",
    middleName: rawRepData.middleName || "",
    lastName: rawRepData.lastName || "",
    fullName: rawRepData.fullName || "",
    isActive: rawRepData.isActive || true,
    isBranchMgr: rawRepData.isBranchMgr || false,
    dob: rawRepData.dob || null,
    gender: rawRepData.gender || null,
  };

  const addresses = addressData.map((address) => ({
    type: address.addressType,
    value: `${address.address1}, ${address.address2}, ${address.city}, ${address.state}, ${address.zip}`,
    isPrimary: address.isPrimary || true,
  }));

  const emails = emailData.map((email) => ({
    type: email.emailType || "",
    value: email.emailAddress || "",
    isPrimary: email.isPrimary || true,
  }));

  const phones = phoneData.map((phone) => ({
    type: phone.phoneType || "",
    value: phone.phoneNumber || "",
    isPrimary: phone.isPrimary || true,
  }));

  const repData = {
    ...sanitizedRepData,
    addresses,
    emails,
    phones,
  };

  return (
    <div className="flex h-full flex-col space-y-8 p-8">
      <H1>Update Representative</H1>
      <RepForm data={repData} repId={params.id} />
    </div>
  );
}
