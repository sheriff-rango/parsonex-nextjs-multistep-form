"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createRep, updateRep } from "@/server/actions/reps";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { RepData, RepFormValues } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useActionState } from "@/hooks/use-action-state";
import { RepContactFormStep } from "@/components/contact-form-step";
import { RepGeneralFormStep } from "@/components/rep-general-form-step";
import { repFormSchema } from "@/types/forms";

interface RepFormProps {
  data?: RepData;
  repId?: string;
}

export function RepForm({ data, repId }: RepFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isLoading, setLoading, setError } = useActionState<RepData>();

  const form = useForm<RepFormValues>({
    resolver: zodResolver(repFormSchema),
    mode: "onChange",
    defaultValues: data || {
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
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.match(/^(firstName|middleName|lastName)$/)) {
        const { firstName, middleName, lastName } = value;
        const fullName = [firstName, middleName, lastName]
          .filter(Boolean)
          .join(" ");
        form.setValue("fullName", fullName);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(values: RepFormValues) {
    setLoading(true);

    try {
      if (repId) {
        await updateRep(repId, values);
        toast.success("Rep updated successfully");
      } else {
        await createRep(values);
        toast.success("Rep created successfully");
      }
      router.push("/dashboard/reps");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Unknown error");
      toast.error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  const handleNextStep = async () => {
    if (isTransitioning) return;

    // Validate step one before proceeding
    if (step === 1) {
      // Clear any existing errors for these fields
      form.clearErrors(["firstName", "lastName", "repType"]);
      const isValid = await form.trigger(["firstName", "lastName", "repType"]);
      if (!isValid) {
        return;
      }
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setStep(step + 1);
      setIsTransitioning(false);
    }, 0);
  };

  const handlePreviousStep = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(step - 1);
      setIsTransitioning(false);
    }, 0);
  };

  return (
    <Card className="mt-4 pt-4">
      <CardContent className="h-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative flex h-full flex-col space-y-4"
          >
            <div className="px-1">
              {step === 1 && <RepGeneralFormStep form={form} />}
              {step === 2 && <RepContactFormStep form={form} />}
            </div>

            <div className="flex w-full justify-between">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={isTransitioning}
                >
                  Previous
                </Button>
              )}
              {step < 2 ? (
                <Button
                  type="button"
                  disabled={isTransitioning}
                  onClick={handleNextStep}
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || isTransitioning}
                  className="ml-auto"
                >
                  {repId
                    ? isLoading
                      ? "Updating..."
                      : "Update Rep"
                    : isLoading
                      ? "Creating..."
                      : "Create Rep"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
