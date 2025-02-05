"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createRep, updateRep } from "@/server/actions/reps";
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
import { RepData, ContactField } from "@/types";

type ContactType = "phone" | "email" | "address";
type ContactArrayType = "phones" | "emails" | "addresses";

interface RepFormProps {
  data?: RepData;
  repId?: string;
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

export function RepForm({ data, repId }: RepFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [repData, setRepData] = useState<RepData>(
    data || {
      firstName: "",
      middleName: "",
      lastName: "",
      fullName: "",
      repType: "",
      isActive: true,
      isBranchMgr: false,
      dob: null,
      gender: null,
      phones: [{ type: "mobile", value: "", isPrimary: true }],
      emails: [{ type: "work", value: "", isPrimary: true }],
      addresses: [{ type: "home", value: "", isPrimary: true }],
    },
  );

  const isStepOneValid = () => {
    return (
      repData.firstName.trim() !== "" &&
      repData.lastName.trim() !== "" &&
      repData.repType !== ""
    );
  };

  const isStepTwoValid = () => {
    return (
      repData.phones.some((phone) => phone.value.trim() !== "") &&
      repData.emails.some((email) => email.value.trim() !== "") &&
      repData.addresses.some((address) => address.value.trim() !== "")
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setRepData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addField = (type: ContactType) => {
    setRepData((prev) => {
      const { field, template } = contactFieldMap[type];
      return {
        ...prev,
        [field]: [...prev[field], template],
      };
    });
  };

  const removeField = (type: ContactType, index: number) => {
    setRepData((prev) => {
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
    setRepData((prev) => {
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    try {
      if (repId) {
        await updateRep(repId, repData);
      } else {
        await createRep(repData);
      }
      router.push("/dashboard/reps");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="mt-4 pt-4">
      <CardContent className="h-full">
        <form
          onSubmit={handleSubmit}
          className="relative flex h-full flex-col space-y-4"
        >
          <div className="px-1">
            {step === 1 && (
              <StepOne
                repData={repData}
                handleInputChange={handleInputChange}
                setRepData={setRepData}
              />
            )}

            {step === 2 && (
              <StepTwo
                phones={repData.phones}
                emails={repData.emails}
                addresses={repData.addresses}
                addField={addField}
                removeField={removeField}
                updateContactField={updateContactField}
              />
            )}
          </div>

          <div className="flex w-full justify-between">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                Previous
              </Button>
            )}
            {step < 2 ? (
              <Button
                type="button"
                disabled={!isStepOneValid()}
                onClick={() => {
                  setStep(step + 1);
                  setIsPending(true);
                  setTimeout(() => {
                    setIsPending(false);
                  }, 0);
                }}
                className="ml-auto"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isPending || !isStepTwoValid()}
                className="ml-auto"
              >
                {repId
                  ? isPending
                    ? "Updating..."
                    : "Update Rep"
                  : isPending
                    ? "Creating..."
                    : "Create Rep"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function StepOne({
  repData,
  handleInputChange,
  setRepData,
}: {
  repData: RepData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  setRepData: React.Dispatch<React.SetStateAction<RepData>>;
}) {
  const repTypes = [
    "Admin",
    "Assistant",
    "Back Office",
    "Dual",
    "IAR",
    "RR",
    "Unassigned",
  ];

  return (
    <div key="step1" className="space-y-4">
      <H2>General Information</H2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name*</Label>
          <Input
            id="firstName"
            name="firstName"
            required
            value={repData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input id="middleName" name="middleName" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name*</Label>
          <Input
            id="lastName"
            name="lastName"
            required
            value={repData.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" name="dob" type="date" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="repType">Rep Type*</Label>
          <Select
            name="repType"
            required
            value={repData.repType}
            onValueChange={(value: string) =>
              setRepData((prev: RepData) => ({ ...prev, repType: value }))
            }
          >
            <SelectTrigger className="capitalize">
              <SelectValue placeholder="Select Rep Type" />
            </SelectTrigger>
            <SelectContent>
              {repTypes.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select name="gender">
            <SelectTrigger className="capitalize">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male" className="capitalize">
                Male
              </SelectItem>
              <SelectItem value="female" className="capitalize">
                Female
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="isActive" name="isActive" defaultChecked />
          <Label htmlFor="isActive">Active</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="isBranchMgr" name="isBranchMgr" />
          <Label htmlFor="isBranchMgr">Branch Manager</Label>
        </div>
      </div>
    </div>
  );
}

function StepTwo({
  phones,
  emails,
  addresses,
  addField,
  removeField,
  updateContactField,
}: {
  phones: ContactField[];
  emails: ContactField[];
  addresses: ContactField[];
  addField: (type: "phone" | "email" | "address") => void;
  removeField: (type: "phone" | "email" | "address", index: number) => void;
  updateContactField: (
    type: "phone" | "email" | "address",
    index: number,
    field: "type" | "value" | "isPrimary",
    value: string | boolean,
  ) => void;
}) {
  const phoneTypes = ["mobile", "home", "work", "other"];
  const emailTypes = ["work", "personal", "other"];
  const addressTypes = ["home", "work", "mailing", "other"];

  return (
    <div key="step2" className="space-y-8">
      <H2>Contact Information</H2>
      {/* Phone Numbers */}
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
        {phones.map((phone: ContactField, index: number) => (
          <div key={index} className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-3">
              <Select
                name={`phone_type_${index}`}
                value={phone.type}
                onValueChange={(value) =>
                  updateContactField("phone", index, "type", value)
                }
              >
                <SelectTrigger className="capitalize">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {phoneTypes.map((type: string) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-6">
              <Input
                name={`phone_number_${index}`}
                placeholder="Phone Number"
                type="tel"
                value={phone.value}
                onChange={(e) =>
                  updateContactField("phone", index, "value", e.target.value)
                }
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Checkbox
                id={`phone_primary_${index}`}
                name={`phone_primary_${index}`}
                checked={phone.isPrimary}
                onCheckedChange={(checked) =>
                  updateContactField("phone", index, "isPrimary", !!checked)
                }
              />
              <Label htmlFor={`phone_primary_${index}`}>Primary</Label>
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

      {/* Email Addresses */}
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
        {emails.map((email: ContactField, index: number) => (
          <div key={index} className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-3">
              <Select
                name={`email_type_${index}`}
                value={email.type}
                onValueChange={(value) =>
                  updateContactField("email", index, "type", value)
                }
              >
                <SelectTrigger className="capitalize">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {emailTypes.map((type: string) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-6">
              <Input
                name={`email_${index}`}
                placeholder="Email Address"
                type="email"
                value={email.value}
                onChange={(e) =>
                  updateContactField("email", index, "value", e.target.value)
                }
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Checkbox
                id={`email_primary_${index}`}
                name={`email_primary_${index}`}
                checked={email.isPrimary}
                onCheckedChange={(checked) =>
                  updateContactField("email", index, "isPrimary", !!checked)
                }
              />
              <Label htmlFor={`email_primary_${index}`}>Primary</Label>
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

      {/* Addresses */}
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
        {addresses.map((address: ContactField, index: number) => (
          <div key={index} className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select
                  name={`address_type_${index}`}
                  value={address.type}
                  onValueChange={(value) =>
                    updateContactField("address", index, "type", value)
                  }
                >
                  <SelectTrigger className="w-[150px] capitalize">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {addressTypes.map((type: string) => (
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
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`address_primary_${index}`}
                    name={`address_primary_${index}`}
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
                  <Label htmlFor={`address_primary_${index}`}>Primary</Label>
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
                name={`address_line1_${index}`}
                placeholder="Address Line 1"
                value={address.value.split(",")[0] || ""}
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
                name={`address_line2_${index}`}
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
                  name={`city_${index}`}
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
                  name={`state_${index}`}
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
                  name={`zip_${index}`}
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
        ))}
      </div>
    </div>
  );
}
