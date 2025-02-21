import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Root } from "@radix-ui/react-label";
import { forwardRef } from "react";
import { useFormField } from "../hooks";

const FormLabel = forwardRef<
  React.ElementRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

export { FormLabel };
