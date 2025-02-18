import { H1 } from "@/components/typography";
import { RepForm } from "@/components/rep-form";
import MultiStepForm, { TFieldItem } from "@/components/MultiStepForm";

export default async function MultiStep() {
  return (
    <MultiStepForm
      options={[
        {
          title: "Personal Information",
          fields: [
            {
              name: "nameFirst",
              label: "First Name",
              type: TFieldItem.TEXT,
              required: true,
            },
            {
              name: "nameMiddle",
              label: "Middle Name",
              type: TFieldItem.TEXT,
            },
            {
              name: "nameLast",
              label: "Last Name",
              type: TFieldItem.TEXT,
              required: true,
            },
            {
              name: "nameSuffix",
              label: "Suffix",
              type: TFieldItem.TEXT,
            },
            {
              name: "nameSalutation",
              label: "Salutation",
              type: TFieldItem.TEXT,
            },
            {
              name: "dob",
              label: "Date of Birth",
              type: TFieldItem.DATE,
            },
            {
              name: "gender",
              label: "Gender",
              type: TFieldItem.SELECT,
              options: [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ],
            },
            {
              name: "maritalstatus",
              label: "Marital Status",
              type: TFieldItem.SELECT,
              options: [
                { label: "Single", value: "single" },
                { label: "Married", value: "married" },
                { label: "Divorced", value: "divorced" },
                { label: "Widowed", value: "widowed" },
              ],
            },
            {
              name: "tin",
              label: "TIN",
              type: TFieldItem.TEXT,
              required: true,
            },
          ],
        },
        {
          title: "Employment Information",
          fields: [
            {
              name: "employmentStatus",
              label: "Employment Status",
              type: TFieldItem.TEXT,
            },
            {
              name: "employmentOccupation",
              label: "Occupation",
              type: TFieldItem.TEXT,
            },
            {
              name: "employer",
              label: "Employer",
              type: TFieldItem.TEXT,
            },
            {
              name: "employerBusinessType",
              label: "Employer Business Type",
              type: TFieldItem.TEXT,
            },
          ],
        },
        {
          title: "Status Information",
          fields: [
            {
              name: "isUscitizen",
              label: "US Citizen",
              type: TFieldItem.CHECKBOX,
            },
            {
              name: "riaClient",
              label: "RIA Client",
              type: TFieldItem.CHECKBOX,
            },
            {
              name: "bdClient",
              label: "BD Client",
              type: TFieldItem.CHECKBOX,
            },
            {
              name: "isActive",
              label: "Active",
              type: TFieldItem.CHECKBOX,
            },
          ],
          gridCols: 1,
        },
        {
          title: "Financial Profile",
          fields: [
            {
              name: "finProfile.profileType",
              label: "Profile Type",
              type: TFieldItem.SELECT,
              options: [],
            },
            {
              name: "finProfile.networth",
              label: "Net Worth",
              type: TFieldItem.TEXT,
            },
            {
              name: "finProfile.networthLiquid",
              label: "Liquid Net Worth",
              type: TFieldItem.TEXT,
            },
            {
              name: "finProfile.incomeAnnual",
              label: "Annual Income",
              type: TFieldItem.TEXT,
            },
            {
              name: "finProfile.taxbracket",
              label: "Tax Bracket",
              type: TFieldItem.SELECT,
              options: [],
            },
            {
              name: "finProfile.incomeSource",
              label: "Income Source",
              type: TFieldItem.SELECT,
              options: [],
            },
            {
              name: "finProfile.investExperience",
              label: "Investment Experience",
              type: TFieldItem.SELECT,
              options: [],
            },
            {
              name: "finProfile.investExperienceYears",
              label: "Years of Investment Experience",
              type: TFieldItem.TEXT,
            },
            {
              name: "finProfile.totalHeldawayAssets",
              label: "Total Heldaway Assets",
              type: TFieldItem.TEXT,
            },
            {
              name: "finProfile.incomeSourceType",
              label: "Income Source Type",
              type: TFieldItem.TEXT,
            },
            {
              name: "finProfile.incomeDescription",
              label: "Income Description",
              type: TFieldItem.TEXT,
            },
            {
              name: "finProfile.incomeSourceAdditional",
              label: "Additional Income Source",
              type: TFieldItem.TEXT,
            },
          ],
        },
      ]}
    />
  );
}
