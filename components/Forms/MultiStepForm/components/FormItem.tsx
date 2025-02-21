import { cn } from "@/lib/utils";
import { forwardRef, useId } from "react";
import { FormItemContext } from "../contexts";

const FormItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        className={cn("relative space-y-2 pb-4", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

export { FormItem };
