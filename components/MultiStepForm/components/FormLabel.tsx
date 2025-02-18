import { Root } from "@radix-ui/react-label";
import { useFormField } from "../hooks";
import { forwardRef } from "react";
import { Label } from "./Label";
import { cn } from "../utils";

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
