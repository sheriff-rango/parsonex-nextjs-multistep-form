import { UseFormReturn } from "react-hook-form";
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
import { H2 } from "@/components/typography";

interface FormFieldData {
  name: string;
  label: string;
  type: "text" | "date" | "select" | "checkbox";
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}

interface FormStepProps {
  title: string;
  fields: FormFieldData[];
  form: UseFormReturn<any>;
  gridCols?: number;
}

export function FormStep({ title, fields, form, gridCols = 2 }: FormStepProps) {
  const renderField = (field: FormFieldData) => {
    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => {
          if (field.type === "checkbox") {
            return (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{field.label}</FormLabel>
                </div>
              </FormItem>
            );
          }

          return (
            <FormItem className={field.className}>
              <FormLabel>
                {field.label}
                {field.required && "*"}
              </FormLabel>
              <FormControl>
                {field.type === "select" ? (
                  <Select
                    onValueChange={formField.onChange}
                    defaultValue={formField.value || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          field.placeholder || `Select ${field.label}`
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    {...formField}
                    type={field.type}
                    value={formField.value || ""}
                    placeholder={field.placeholder}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    );
  };

  const gridFields = fields.filter((f) => f.type !== "checkbox");
  const checkboxFields = fields.filter((f) => f.type === "checkbox");

  return (
    <div className="space-y-4">
      <H2>{title}</H2>
      <div className={`grid grid-cols-${gridCols} gap-4`}>
        {gridFields.map(renderField)}
      </div>
      {checkboxFields.length > 0 && (
        <div className="space-y-4">{checkboxFields.map(renderField)}</div>
      )}
    </div>
  );
}
