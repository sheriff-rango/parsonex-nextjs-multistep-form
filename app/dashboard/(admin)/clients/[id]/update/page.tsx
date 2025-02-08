import { getClientProfile } from "@/server/actions/clients";
import { ClientForm } from "@/components/client-form";
import { H1 } from "@/components/typography";
import { ContactField, ClientData } from "@/types";

export default async function UpdateClientPage({
  params,
}: {
  params: { id: string };
}) {
  const id = decodeURIComponent(params.id);
  const result = await getClientProfile(id);

  if (!result) {
    return <div>Client not found</div>;
  }

  const { client, finProfile, addresses, emails, phones } = result;

  const formData: ClientData = {
    nameFirst: client.nameFirst || "",
    nameMiddle: client.nameMiddle || "",
    nameLast: client.nameLast || "",
    nameSuffix: client.nameSuffix || "",
    nameSalutation: client.nameSalutation || "",
    nameFull: client.nameFull || "",
    dob: client.dob,
    gender: client.gender,
    maritalstatus: client.maritalstatus,
    ssnTaxid: client.ssnTaxid || "",
    employmentStatus: client.employmentStatus || "",
    employmentOccupation: client.employmentOccupation || "",
    employer: client.employer || "",
    employerBusinessType: client.employerBusinessType || "",
    isUscitizen: Boolean(client.isUscitizen),
    riaClient: Boolean(client.riaClient),
    bdClient: Boolean(client.bdClient),
    isActive: Boolean(client.isActive),
    phones: (phones.length > 0
      ? phones.map((p) => ({
          type: p.phoneType || "mobile",
          value: p.phoneNumber || "",
          isPrimary: Boolean(p.isPrimary),
        }))
      : [{ type: "mobile", value: "", isPrimary: true }]) as ContactField[],
    emails: (emails.length > 0
      ? emails.map((e) => ({
          type: e.emailType || "work",
          value: e.emailAddress || "",
          isPrimary: Boolean(e.isPrimary),
        }))
      : [{ type: "work", value: "", isPrimary: true }]) as ContactField[],
    addresses: (addresses.length > 0
      ? addresses.map((a) => ({
          type: a.addressType || "home",
          value: [a.address1, a.address2, a.city, a.state, a.zip]
            .filter(Boolean)
            .join(","),
          isPrimary: Boolean(a.isPrimary),
        }))
      : [{ type: "home", value: "", isPrimary: true }]) as ContactField[],
    finProfile: finProfile
      ? {
          profileType: finProfile.profileType,
          networth: finProfile.networth ? Number(finProfile.networth) : null,
          networthLiquid: finProfile.networthLiquid
            ? Number(finProfile.networthLiquid)
            : null,
          incomeAnnual: finProfile.incomeAnnual
            ? Number(finProfile.incomeAnnual)
            : null,
          taxbracket: finProfile.taxbracket,
          incomeSource: finProfile.incomeSource,
          investExperience: finProfile.investExperience,
          investExperienceYears: finProfile.investExperienceYears
            ? Number(finProfile.investExperienceYears)
            : null,
          totalHeldawayAssets: finProfile.totalHeldawayAssets
            ? Number(finProfile.totalHeldawayAssets)
            : null,
          incomeSourceType: finProfile.incomeSourceType,
          incomeDescription: finProfile.incomeDescription,
          incomeSourceAdditional: finProfile.incomeSourceAdditional,
          jointClientId: finProfile.jointClientId,
        }
      : undefined,
  };

  return (
    <div className="flex h-full flex-col p-4">
      <H1>Update Client</H1>
      <ClientForm data={formData} clientId={id} />
    </div>
  );
}
