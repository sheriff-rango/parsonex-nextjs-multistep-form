"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { DataType, IMultiStepForm } from "./types";

const MultiStepForm: React.FC<IMultiStepForm<DataType>> = (props) => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { title, options, gridCols = 2, subscriptionCallback, events } = props;
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
        <h1>MultiStepForm</h1>
      </div>
    </div>
  );
};

export default MultiStepForm;

export * from "./types";
