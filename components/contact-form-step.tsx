import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray } from "react-hook-form";
import { Plus, Minus } from "lucide-react";
import { H2 } from "@/components/typography";
import { ContactField, RepFormValues } from "@/types";

type ContactType = "phone" | "email" | "address";
type ContactArrayType = "phones" | "emails" | "addresses";

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

interface ContactFormStepProps {
  form: UseFormReturn<RepFormValues>;
}

export function ContactFormStep({ form }: ContactFormStepProps) {
  const phoneTypes = ["mobile", "home", "work", "other"];
  const emailTypes = ["work", "personal", "other"];
  const addressTypes = ["home", "work", "mailing", "other"];

  const { fields: phones } = useFieldArray({
    name: "phones",
    control: form.control,
  });

  const { fields: emails } = useFieldArray({
    name: "emails",
    control: form.control,
  });

  const { fields: addresses } = useFieldArray({
    name: "addresses",
    control: form.control,
  });

  const addField = (type: ContactType) => {
    const { field, template } = contactFieldMap[type];
    const currentFields = form.getValues(field);
    form.setValue(field, [...currentFields, template]);
  };

  const removeField = (type: ContactType, index: number) => {
    const { field } = contactFieldMap[type];
    const currentFields = form.getValues(field);
    form.setValue(
      field,
      currentFields.filter((_: ContactField, i: number) => i !== index),
    );
  };

  const handleAddressChange = (index: number, part: number, value: string) => {
    const currentAddress = form.getValues(`addresses.${index}.value`) || "";
    const parts = currentAddress.split(",").map((part: string) => part.trim());
    while (parts.length < 5) parts.push("");
    parts[part] = value;
    form.setValue(`addresses.${index}.value`, parts.join(", "));
  };

  const getAddressPart = (value: string, index: number) => {
    const parts = (value || "").split(",").map((part: string) => part.trim());
    while (parts.length < 5) parts.push("");
    return parts[index];
  };

  return (
    <div className="space-y-8">
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
        {phones.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-3">
              <FormField
                control={form.control}
                name={`phones.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {phoneTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6">
              <FormField
                control={form.control}
                name={`phones.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Phone Number" type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-2">
              <FormField
                control={form.control}
                name={`phones.${index}.isPrimary`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Primary</FormLabel>
                  </FormItem>
                )}
              />
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
        {emails.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-3">
              <FormField
                control={form.control}
                name={`emails.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {emailTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6">
              <FormField
                control={form.control}
                name={`emails.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Email Address"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-2">
              <FormField
                control={form.control}
                name={`emails.${index}.isPrimary`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Primary</FormLabel>
                  </FormItem>
                )}
              />
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
        {addresses.map((field, index) => (
          <div key={field.id} className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name={`addresses.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {addressTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`addresses.${index}.isPrimary`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Primary</FormLabel>
                    </FormItem>
                  )}
                />
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
              <FormField
                control={form.control}
                name={`addresses.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Address Line 1"
                        value={getAddressPart(field.value, 0)}
                        onChange={(e) =>
                          handleAddressChange(index, 0, e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`addresses.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Address Line 2"
                        value={getAddressPart(field.value, 1)}
                        onChange={(e) =>
                          handleAddressChange(index, 1, e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name={`addresses.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="City"
                          value={getAddressPart(field.value, 2)}
                          onChange={(e) =>
                            handleAddressChange(index, 2, e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`addresses.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="State"
                          value={getAddressPart(field.value, 3)}
                          onChange={(e) =>
                            handleAddressChange(index, 3, e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`addresses.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="ZIP Code"
                          value={getAddressPart(field.value, 4)}
                          onChange={(e) =>
                            handleAddressChange(index, 4, e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
