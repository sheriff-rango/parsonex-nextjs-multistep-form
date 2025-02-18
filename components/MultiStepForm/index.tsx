"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DataType, IMultiStepForm, TMode } from "./types";
import { Button } from "./components";

const MultiStepForm: React.FC<IMultiStepForm<DataType>> = (props) => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    options,
    gridCols = 2,
    subscriptionCallback,
    events,
    mode = TMode.CREATING,
  } = props;
  const totalSteps = useMemo(() => options.length || 0, [options]);

  const form = useForm<DataType>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    const subscription = subscriptionCallback
      ? form.watch(subscriptionCallback)
      : null;
    return () => subscription?.unsubscribe();
  }, [form, subscriptionCallback]);

  const handleNextStep = async () => {
    if (isLoading || isTransitioning) return;
    if (step === totalSteps - 1) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setStep(step + 1);
      setIsTransitioning(false);
    }, 0);
  };

  const handlePreviousStep = async () => {
    if (isLoading || isTransitioning) return;
    if (step === 0) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setStep(step - 1);
      setIsTransitioning(false);
    }, 0);
  };

  const handleOnSubmit = async (values: DataType) => {
    if (events?.onSubmit) {
      setIsLoading(true);
      try {
        await events.onSubmit(values);
      } catch (error) {
        console.error(error);
        if (events?.onError) {
          events.onError(error);
        }
      }
    }
  };

  return (
    <div className="mt-4 rounded-xl border bg-card pt-4 text-card-foreground shadow">
      <div className="h-full p-6 pt-0">
        <FormProvider {...form}>
          <form
            className="relative flex h-full flex-col space-y-4"
            onSubmit={form.handleSubmit(handleOnSubmit)}
          >
            <div className="px-1">Multi Step Form {step}</div>

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
              {step < totalSteps - 1 ? (
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
                  {mode === TMode.EDITING
                    ? isLoading
                      ? "Updating..."
                      : "Update"
                    : isLoading
                      ? "Creating..."
                      : "Create"}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default MultiStepForm;

export * from "./types";
