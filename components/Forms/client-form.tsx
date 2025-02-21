"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createClient, updateClient } from "@/server/actions/clients";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { ClientData } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useActionState } from "@/hooks/use-action-state";
import { ClientContactFormStep } from "@/components/Forms/contact-form-step";
import { ClientGeneralFormStep } from "@/components/Forms/client-general-form-step";
import { clientFormSchema, ClientFormValues } from "@/types/forms";

interface ClientFormProps {
  data?: ClientData;
  clientId?: string;
}

export function ClientForm({ data, clientId }: ClientFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isLoading, setLoading, setError } = useActionState<ClientData>();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    mode: "onChange",
    defaultValues: data || {
      nameFirst: "",
      nameMiddle: "",
      nameLast: "",
      nameSuffix: "",
      nameSalutation: "",
      nameFull: "",
      dob: null,
      gender: null,
      maritalstatus: null,
      tin: "",
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
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.match(/^(nameFirst|nameMiddle|nameLast|nameSuffix)$/)) {
        const { nameFirst, nameMiddle, nameLast, nameSuffix } = value;
        const nameFull = [nameFirst, nameMiddle, nameLast, nameSuffix]
          .filter(Boolean)
          .join(" ");
        form.setValue("nameFull", nameFull);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(values: ClientFormValues) {
    setLoading(true);

    try {
      const formattedValues: ClientData = {
        ...values,
        nameFirst: values.nameFirst || "",
        nameMiddle: values.nameMiddle || "",
        nameLast: values.nameLast || "",
        nameSuffix: values.nameSuffix || "",
        nameSalutation: values.nameSalutation || "",
        nameFull: values.nameFull || "",
        employmentStatus: values.employmentStatus || "",
        employmentOccupation: values.employmentOccupation || "",
        employer: values.employer || "",
        employerBusinessType: values.employerBusinessType || "",
      };

      if (clientId) {
        await updateClient(clientId, formattedValues);
        toast.success("Client updated successfully");
      } else {
        await createClient(formattedValues);
        toast.success("Client created successfully");
      }
      router.push("/dashboard/clients");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Unknown error");
      toast.error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  const handleNextStep = async () => {
    if (isTransitioning) return;

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
              {step === 1 && <ClientGeneralFormStep form={form} />}
              {step === 2 && <ClientContactFormStep form={form} />}
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
                  {clientId
                    ? isLoading
                      ? "Updating..."
                      : "Update Client"
                    : isLoading
                      ? "Creating..."
                      : "Create Client"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
