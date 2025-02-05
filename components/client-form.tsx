"use client";

import * as React from "react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";
import { H2 } from "@/components/typography";
import { ContactField, ClientData } from "@/types";
import { createClient, updateClient } from "@/server/actions/clients";

type ContactType = "phone" | "email" | "address";
type ContactArrayType = "phones" | "emails" | "addresses";

interface ClientFormProps {
  data?: ClientData;
  clientId?: string;
}

const contactFieldMap: Record<
  ContactType,
  { field: ContactArrayType; template: ContactField }
> = {
  phone: {
    field: "phones",
    template: { type: "mobile", value: "", isPrimary: false },
  },
  email: {
    field: "emails",
    template: { type: "work", value: "", isPrimary: false },
  },
  address: {
    field: "addresses",
    template: { type: "home", value: "", isPrimary: false },
  },
};

const PROFILE_TYPES = ["Individual", "Joint", "Trust", "Corporate"] as const;
const TAX_BRACKETS = ["0-12%", "22-24%", "32-35%", "37%+"] as const;
const INCOME_SOURCES = [
  "Employment",
  "Business",
  "Investment",
  "Other",
] as const;
const INVESTMENT_EXPERIENCE = ["None", "Limited", "Good", "Extensive"] as const;

export function ClientForm({ data, clientId }: ClientFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState<ClientData>(
    data || {
      nameFirst: "",
      nameMiddle: "",
      nameLast: "",
      nameSuffix: "",
      nameSalutation: "",
      nameFull: "",
      dob: null,
      gender: null,
      maritalstatus: null,
      ssnTaxid: "",
      employmentStatus: "",
      employmentOccupation: "",
      employer: "",
      employerBusinessType: "",
      isUscitizen: false,
      riaClient: false,
      bdClient: false,
      isActive: true,
      phones: [{ type: "mobile", value: "", isPrimary: true }],
      emails: [{ type: "work", value: "", isPrimary: true }],
      addresses: [{ type: "home", value: "", isPrimary: true }],
      finProfile: {
        profileType: null,
        networth: null,
        networthLiquid: null,
        incomeAnnual: null,
        taxbracket: null,
        incomeSource: null,
        investExperience: null,
        investExperienceYears: null,
        totalHeldawayAssets: null,
        incomeSourceType: null,
        incomeDescription: null,
        incomeSourceAdditional: null,
        jointClientId: null,
      },
    },
  );

  const isStepOneValid = () => {
    return (
      formData.nameFirst.trim() !== "" &&
      formData.nameLast.trim() !== "" &&
      formData.ssnTaxid.trim() !== ""
    );
  };

  const isStepTwoValid = () => {
    return (
      formData.phones.some((phone) => phone.value.trim() !== "") &&
      formData.emails.some((email) => email.value.trim() !== "") &&
      formData.addresses.some(
        (address) => address.value.split(",")[0]?.trim() !== "",
      )
    );
  };

  const isStepThreeValid = () => {
    return (
      formData.finProfile?.profileType !== null &&
      formData.finProfile?.profileType !== ""
    );
  };

  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        return isStepOneValid();
      case 2:
        return isStepTwoValid();
      case 3:
        return isStepThreeValid();
      default:
        return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };
      // Update full name when any name component changes
      if (
        ["nameFirst", "nameMiddle", "nameLast", "nameSuffix"].includes(name)
      ) {
        newData.nameFull = [
          newData.nameFirst,
          newData.nameMiddle,
          newData.nameLast,
          newData.nameSuffix,
        ]
          .filter(Boolean)
          .join(" ");
      }
      return newData;
    });
  };

  const addField = (type: ContactType) => {
    setFormData((prev) => {
      const { field, template } = contactFieldMap[type];
      return {
        ...prev,
        [field]: [...prev[field], template],
      };
    });
  };

  const removeField = (type: ContactType, index: number) => {
    setFormData((prev) => {
      const { field } = contactFieldMap[type];
      return {
        ...prev,
        [field]: prev[field].filter(
          (_: ContactField, i: number) => i !== index,
        ),
      };
    });
  };

  const updateContactField = (
    type: ContactType,
    index: number,
    field: keyof ContactField,
    value: string | boolean,
  ) => {
    setFormData((prev) => {
      const { field: arrayField } = contactFieldMap[type];

      if (field === "isPrimary" && value === true) {
        const newArray = prev[arrayField].map(
          (item: ContactField, i: number) => ({
            ...item,
            isPrimary: i === index,
          }),
        );
        return {
          ...prev,
          [arrayField]: newArray,
        };
      }

      const newArray = prev[arrayField].map((item: ContactField, i: number) =>
        i === index ? { ...item, [field]: value } : item,
      );

      return {
        ...prev,
        [arrayField]: newArray,
      };
    });
  };

  const handleFinProfileChange = (
    field: keyof NonNullable<ClientData["finProfile"]>,
    value: string | number | null,
  ) => {
    setFormData((prev) => ({
      ...prev,
      finProfile: {
        ...prev.finProfile,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      if (clientId) {
        await updateClient(clientId, formData);
        toast.success("Client updated successfully");
      } else {
        await createClient(formData);
        toast.success("Client created successfully");
      }
      router.push("/dashboard/clients");
      router.refresh();
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error("Failed to save client");
    } finally {
      setIsPending(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <H2>General Information</H2>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameSalutation">Salutation</Label>
                <Select
                  value={formData.nameSalutation}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      nameSalutation: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select salutation" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameFirst">First Name*</Label>
                <Input
                  id="nameFirst"
                  name="nameFirst"
                  required
                  value={formData.nameFirst}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameMiddle">Middle Name</Label>
                <Input
                  id="nameMiddle"
                  name="nameMiddle"
                  value={formData.nameMiddle}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameLast">Last Name*</Label>
                <Input
                  id="nameLast"
                  name="nameLast"
                  required
                  value={formData.nameLast}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameSuffix">Suffix</Label>
                <Input
                  id="nameSuffix"
                  name="nameSuffix"
                  value={formData.nameSuffix}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Male", "Female", "Other"].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maritalstatus">Marital Status</Label>
                <Select
                  value={formData.maritalstatus || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, maritalstatus: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Single", "Married", "Divorced", "Widowed"].map(
                      (option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ssnTaxid">SSN/Tax ID*</Label>
                <Input
                  id="ssnTaxid"
                  name="ssnTaxid"
                  required
                  value={formData.ssnTaxid}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentStatus">Employment Status</Label>
                <Select
                  value={formData.employmentStatus}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      employmentStatus: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Employed",
                      "Self-Employed",
                      "Retired",
                      "Student",
                      "Unemployed",
                    ].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentOccupation">Occupation</Label>
                <Input
                  id="employmentOccupation"
                  name="employmentOccupation"
                  value={formData.employmentOccupation}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employer">Employer</Label>
                <Input
                  id="employer"
                  name="employer"
                  value={formData.employer}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employerBusinessType">
                  Employer Business Type
                </Label>
                <Input
                  id="employerBusinessType"
                  name="employerBusinessType"
                  value={formData.employerBusinessType}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <H2>Contact Information</H2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Phone Numbers</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addField("phone")}
                >
                  <Plus className="h-4 w-4" />
                  Add Phone
                </Button>
              </div>
              {formData.phones.map((phone: ContactField, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-12 items-center gap-4"
                >
                  <div className="col-span-3">
                    <Select
                      value={phone.type}
                      onValueChange={(value) =>
                        updateContactField("phone", index, "type", value)
                      }
                    >
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {["mobile", "home", "work", "other"].map(
                          (type: string) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="capitalize"
                            >
                              {type}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-6">
                    <Input
                      placeholder="Phone Number"
                      type="tel"
                      value={phone.value}
                      onChange={(e) =>
                        updateContactField(
                          "phone",
                          index,
                          "value",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Checkbox
                      checked={phone.isPrimary}
                      onCheckedChange={(checked) =>
                        updateContactField(
                          "phone",
                          index,
                          "isPrimary",
                          !!checked,
                        )
                      }
                    />
                    <Label>Primary</Label>
                  </div>
                  <div className="col-span-1">
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField("phone", index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Email Addresses</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addField("email")}
                >
                  <Plus className="h-4 w-4" />
                  Add Email
                </Button>
              </div>
              {formData.emails.map((email: ContactField, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-12 items-center gap-4"
                >
                  <div className="col-span-3">
                    <Select
                      value={email.type}
                      onValueChange={(value) =>
                        updateContactField("email", index, "type", value)
                      }
                    >
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {["work", "personal", "other"].map((type: string) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-6">
                    <Input
                      placeholder="Email Address"
                      type="email"
                      value={email.value}
                      onChange={(e) =>
                        updateContactField(
                          "email",
                          index,
                          "value",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Checkbox
                      checked={email.isPrimary}
                      onCheckedChange={(checked) =>
                        updateContactField(
                          "email",
                          index,
                          "isPrimary",
                          !!checked,
                        )
                      }
                    />
                    <Label>Primary</Label>
                  </div>
                  <div className="col-span-1">
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField("email", index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Addresses</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addField("address")}
                >
                  <Plus className="h-4 w-4" />
                  Add Address
                </Button>
              </div>

              {formData.addresses.map(
                (address: ContactField, index: number) => (
                  <div key={index} className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Select
                          value={address.type}
                          onValueChange={(value) =>
                            updateContactField("address", index, "type", value)
                          }
                        >
                          <SelectTrigger className="w-[150px] capitalize">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {["home", "work", "mailing", "other"].map(
                              (type: string) => (
                                <SelectItem
                                  key={type}
                                  value={type}
                                  className="capitalize"
                                >
                                  {type}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={address.isPrimary}
                            onCheckedChange={(checked) =>
                              updateContactField(
                                "address",
                                index,
                                "isPrimary",
                                !!checked,
                              )
                            }
                          />
                          <Label>Primary</Label>
                        </div>
                      </div>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField("address", index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <Input
                        placeholder="Address Line 1"
                        value={address.value.split(",")[0]?.trim() || ""}
                        onChange={(e) => {
                          const addressParts = address.value.split(",");
                          addressParts[0] = e.target.value;
                          updateContactField(
                            "address",
                            index,
                            "value",
                            addressParts.join(","),
                          );
                        }}
                      />
                      <Input
                        placeholder="Address Line 2"
                        value={address.value.split(",")[1]?.trim() || ""}
                        onChange={(e) => {
                          const addressParts = address.value.split(",");
                          addressParts[1] = e.target.value;
                          updateContactField(
                            "address",
                            index,
                            "value",
                            addressParts.join(","),
                          );
                        }}
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          placeholder="City"
                          value={address.value.split(",")[2]?.trim() || ""}
                          onChange={(e) => {
                            const addressParts = address.value.split(",");
                            addressParts[2] = e.target.value;
                            updateContactField(
                              "address",
                              index,
                              "value",
                              addressParts.join(","),
                            );
                          }}
                        />
                        <Input
                          placeholder="State"
                          value={address.value.split(",")[3]?.trim() || ""}
                          onChange={(e) => {
                            const addressParts = address.value.split(",");
                            addressParts[3] = e.target.value;
                            updateContactField(
                              "address",
                              index,
                              "value",
                              addressParts.join(","),
                            );
                          }}
                        />
                        <Input
                          placeholder="ZIP Code"
                          value={address.value.split(",")[4]?.trim() || ""}
                          onChange={(e) => {
                            const addressParts = address.value.split(",");
                            addressParts[4] = e.target.value;
                            updateContactField(
                              "address",
                              index,
                              "value",
                              addressParts.join(","),
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <H2>Financial Profile</H2>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="profileType">Profile Type</Label>
                <Select
                  value={formData.finProfile?.profileType || ""}
                  onValueChange={(value) =>
                    handleFinProfileChange("profileType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select profile type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFILE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="networth">Net Worth</Label>
                <Input
                  id="networth"
                  type="number"
                  value={formData.finProfile?.networth || ""}
                  onChange={(e) => {
                    handleFinProfileChange(
                      "networth",
                      e.target.value ? Number(e.target.value) : null,
                    );
                  }}
                />
              </div>

              <div>
                <Label htmlFor="networthLiquid">Liquid Net Worth</Label>
                <Input
                  id="networthLiquid"
                  type="number"
                  value={formData.finProfile?.networthLiquid || ""}
                  onChange={(e) =>
                    handleFinProfileChange(
                      "networthLiquid",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                />
              </div>

              <div>
                <Label htmlFor="incomeAnnual">Annual Income</Label>
                <Input
                  id="incomeAnnual"
                  type="number"
                  value={formData.finProfile?.incomeAnnual || ""}
                  onChange={(e) =>
                    handleFinProfileChange(
                      "incomeAnnual",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                />
              </div>

              <div>
                <Label htmlFor="taxbracket">Tax Bracket</Label>
                <Select
                  value={formData.finProfile?.taxbracket || ""}
                  onValueChange={(value) =>
                    handleFinProfileChange("taxbracket", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax bracket" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAX_BRACKETS.map((bracket) => (
                      <SelectItem key={bracket} value={bracket}>
                        {bracket}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="incomeSource">Primary Income Source</Label>
                <Select
                  value={formData.finProfile?.incomeSource || ""}
                  onValueChange={(value) =>
                    handleFinProfileChange("incomeSource", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select income source" />
                  </SelectTrigger>
                  <SelectContent>
                    {INCOME_SOURCES.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="investExperience">Investment Experience</Label>
                <Select
                  value={formData.finProfile?.investExperience || ""}
                  onValueChange={(value) =>
                    handleFinProfileChange("investExperience", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select investment experience" />
                  </SelectTrigger>
                  <SelectContent>
                    {INVESTMENT_EXPERIENCE.map((exp) => (
                      <SelectItem key={exp} value={exp}>
                        {exp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="investExperienceYears">
                  Years of Investment Experience
                </Label>
                <Input
                  id="investExperienceYears"
                  type="number"
                  value={formData.finProfile?.investExperienceYears || ""}
                  onChange={(e) =>
                    handleFinProfileChange(
                      "investExperienceYears",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                />
              </div>

              <div>
                <Label htmlFor="totalHeldawayAssets">
                  Total Held-Away Assets
                </Label>
                <Input
                  id="totalHeldawayAssets"
                  type="number"
                  value={formData.finProfile?.totalHeldawayAssets || ""}
                  onChange={(e) =>
                    handleFinProfileChange(
                      "totalHeldawayAssets",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                />
              </div>

              <div>
                <Label htmlFor="incomeDescription">Income Description</Label>
                <Input
                  id="incomeDescription"
                  value={formData.finProfile?.incomeDescription || ""}
                  onChange={(e) =>
                    handleFinProfileChange("incomeDescription", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="incomeSourceAdditional">
                  Additional Income Sources
                </Label>
                <Input
                  id="incomeSourceAdditional"
                  value={formData.finProfile?.incomeSourceAdditional || ""}
                  onChange={(e) =>
                    handleFinProfileChange(
                      "incomeSourceAdditional",
                      e.target.value,
                    )
                  }
                />
              </div>

              {formData.finProfile?.profileType === "Joint" && (
                <div>
                  <Label htmlFor="jointClientId">Joint Client ID</Label>
                  <Input
                    id="jointClientId"
                    value={formData.finProfile?.jointClientId || ""}
                    onChange={(e) =>
                      handleFinProfileChange("jointClientId", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="mt-4 grow overflow-y-auto overflow-x-hidden py-4">
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="relative flex h-full flex-col space-y-4"
        >
          {renderStep()}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            {step < 3 ? (
              <Button
                type="button"
                onClick={() => {
                  setIsPending(true);
                  setStep((s) => Math.min(3, s + 1));
                  setTimeout(() => {
                    setIsPending(false);
                  }, 10);
                }}
                disabled={!canProceedToNextStep()}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!canProceedToNextStep() || isPending}
              >
                {isPending ? "Saving..." : "Save Client"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
