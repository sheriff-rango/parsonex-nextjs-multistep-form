"use client";

import MultiStepForm, { TFieldItem } from "@/components/MultiStepForm";
import { createClient } from "@/server/actions/clients";
import { ClientData, ClientFormValues } from "@/types";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function MultiStep() {
  const [defaultValue, setDefaultValue] = useState<any>({
    nameFirst: "First",
    nameLast: "Last",
    dob: "1111-11-11",
    gender: "male",
    maritalstatus: "single",
    tin: "TIN",
    isUscitizen: false,
    riaClient: false,
    bdClient: false,
    isActive: true,
    finProfile: {
      profileType: "type1",
      networth: 1000,
      networthLiquid: 2000,
      incomeAnnual: 3000,
      taxbracket: "bracket1",
      incomeSource: "source1",
      investExperience: "experience1",
      investExperienceYears: 4,
      totalHeldawayAssets: 5000,
      incomeSourceType: "Income Source Type",
      incomeDescription: "Income Description",
      incomeSourceAdditional: "Additional Income Source",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setDefaultValue({
        nameFirst: "First After",
        nameLast: "Last After",
        dob: "1111-11-11",
        gender: "male",
        maritalstatus: "single",
        tin: "TIN",
        isUscitizen: false,
        riaClient: false,
        bdClient: false,
        isActive: true,
        finProfile: {
          profileType: "type1",
          networth: 1000,
          networthLiquid: 2000,
          incomeAnnual: 3000,
          taxbracket: "bracket1",
          incomeSource: "source1",
          investExperience: "experience1",
          investExperienceYears: 4,
          totalHeldawayAssets: 5000,
          incomeSourceType: "Income Source Type",
          incomeDescription: "Income Description",
          incomeSourceAdditional: "Additional Income Source",
        },
      });
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleOnSubmit = async (values: ClientFormValues) => {
    console.log("debug handle on submit", values);
  };

  return (
    <MultiStepForm
      isLoading={isLoading}
      defaultValues={defaultValue}
      options={[
        {
          title: "Personal Information",
          fields: [
            {
              name: "nameFirst",
              label: "First Name",
              type: TFieldItem.TEXT,
              required: true,
              //   resolver: z.string().min(1, "First name is required"),
            },
            {
              name: "nameMiddle",
              label: "Middle Name",
              type: TFieldItem.TEXT,
              //   resolver: z.string().optional().default(""),
            },
            {
              name: "nameLast",
              label: "Last Name",
              type: TFieldItem.TEXT,
              required: true,
              //   resolver: z.string().min(1, "Last name is required"),
            },
            {
              name: "nameSuffix",
              label: "Suffix",
              type: TFieldItem.TEXT,
              //   resolver: z.string().optional().default(""),
            },
            {
              name: "nameSalutation",
              label: "Salutation",
              type: TFieldItem.TEXT,
              //   resolver: z.string().optional().default(""),
            },
            {
              name: "dob",
              label: "Date of Birth",
              type: TFieldItem.DATE,
              //   resolver: z.string().nullable(),
            },
            {
              name: "gender",
              label: "Gender",
              type: TFieldItem.SELECT,
              options: [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ],
              //   resolver: z.string().nullable(),
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
              //   resolver: z.string().nullable(),
            },
            {
              name: "tin",
              label: "TIN",
              type: TFieldItem.TEXT,
              required: true,
              //   resolver: z.string().min(1, "TIN is required"),
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
              //   resolver: z.string().optional().default(""),
            },
            {
              name: "employmentOccupation",
              label: "Occupation",
              type: TFieldItem.TEXT,
              //   resolver: z.string().optional().default(""),
            },
            {
              name: "employer",
              label: "Employer",
              type: TFieldItem.TEXT,
              //   resolver: z.string().optional().default(""),
            },
            {
              name: "employerBusinessType",
              label: "Employer Business Type",
              type: TFieldItem.TEXT,
              //   resolver: z.string().optional().default(""),
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
              //   resolver: z.boolean().default(false),
            },
            {
              name: "riaClient",
              label: "RIA Client",
              type: TFieldItem.CHECKBOX,
              //   resolver: z.boolean().default(false),
            },
            {
              name: "bdClient",
              label: "BD Client",
              type: TFieldItem.CHECKBOX,
              //   resolver: z.boolean().default(false),
            },
            {
              name: "isActive",
              label: "Active",
              type: TFieldItem.CHECKBOX,
              //   resolver: z.boolean().default(true),
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
              options: [{ label: "TYPE1", value: "type1" }],
            },
            {
              name: "finProfile.networth",
              label: "Net Worth",
              type: TFieldItem.NUMBER,
            },
            {
              name: "finProfile.networthLiquid",
              label: "Liquid Net Worth",
              type: TFieldItem.NUMBER,
            },
            {
              name: "finProfile.incomeAnnual",
              label: "Annual Income",
              type: TFieldItem.NUMBER,
            },
            {
              name: "finProfile.taxbracket",
              label: "Tax Bracket",
              type: TFieldItem.SELECT,
              options: [{ label: "BRACKET1", value: "bracket1" }],
            },
            {
              name: "finProfile.incomeSource",
              label: "Income Source",
              type: TFieldItem.SELECT,
              options: [{ label: "SOURCE1", value: "source1" }],
            },
            {
              name: "finProfile.investExperience",
              label: "Investment Experience",
              type: TFieldItem.SELECT,
              options: [{ label: "EXPERIENCE1", value: "experience1" }],
            },
            {
              name: "finProfile.investExperienceYears",
              label: "Years of Investment Experience",
              type: TFieldItem.NUMBER,
            },
            {
              name: "finProfile.totalHeldawayAssets",
              label: "Total Heldaway Assets",
              type: TFieldItem.NUMBER,
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
      resolver={z.object({
        nameFirst: z.string().min(1, "First name is required").default(""),
        nameMiddle: z.string().optional().default(""),
        nameLast: z.string().min(1, "Last name is required").default(""),
        nameSuffix: z.string().optional().default(""),
        nameSalutation: z.string().optional().default(""),
        // nameFull: z.string(),
        dob: z.string().nullable(),
        gender: z.string().nullable(),
        maritalstatus: z.string().nullable(),
        tin: z.string().min(1, "TIN is required").default(""),
        employmentStatus: z.string().optional().default(""),
        employmentOccupation: z.string().optional().default(""),
        employer: z.string().optional().default(""),
        employerBusinessType: z.string().optional().default(""),
        isUscitizen: z.boolean().default(false),
        riaClient: z.boolean().default(false),
        bdClient: z.boolean().default(false),
        isActive: z.boolean().default(true),
        finProfile: z
          .object({
            profileType: z.string().nullable(),
            networth: z.number().nullable(),
            networthLiquid: z.number().nullable(),
            incomeAnnual: z.number().nullable(),
            taxbracket: z.string().nullable(),
            incomeSource: z.string().nullable(),
            investExperience: z.string().nullable(),
            investExperienceYears: z.number().nullable(),
            totalHeldawayAssets: z.number().nullable(),
            incomeSourceType: z.string().nullable(),
            incomeDescription: z.string().nullable(),
            incomeSourceAdditional: z.string().nullable(),
            // jointClientId: z.string().nullable(),
          })
          .optional(),
      })}
      events={{
        onSubmit: handleOnSubmit,
      }}
    />
  );
}
