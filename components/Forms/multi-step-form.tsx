"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DataType, IMultiStepForm, TFieldItem, TMode } from "@/types";

const MultiStepForm: React.FC<IMultiStepForm<any>> = (props) => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    options,
    subscriptionCallback,
    events,
    mode = TMode.CREATING,
    resolver,
    defaultValues,
    isLoading: formLoading,
  } = props;

  const totalSteps = useMemo(() => options.length || 0, [options]);
  const {
    title: crrStepTitle,
    fields: crrStepFields,
    gridCols: crrGridCols = 2,
  } = useMemo(() => options[step], [options, step]);

  const form = useForm<DataType>({
    mode: "onChange",
    // reValidateMode: "onChange",
    defaultValues,
    resolver: resolver ? zodResolver(resolver) : undefined,
  });

  const formDisabled = isLoading || isTransitioning || formLoading;

  useEffect(() => {
    form.reset(defaultValues);
  }, [form, defaultValues]);

  useEffect(() => {
    const subscription = subscriptionCallback
      ? form.watch(subscriptionCallback(form))
      : null;
    return () => subscription?.unsubscribe();
  }, [form, subscriptionCallback]);

  const handleNextStep = async () => {
    if (formDisabled) return;
    if (step === totalSteps - 1) return;

    const crrStepFieldNames = crrStepFields.map((field) => field.name);
    form.clearErrors(crrStepFieldNames);
    const validationResult = await form.trigger(crrStepFieldNames);
    if (!validationResult) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setStep(step + 1);
      setIsTransitioning(false);
    }, 0);
  };

  const handlePreviousStep = async () => {
    if (formDisabled) return;
    if (step === 0) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setStep(step - 1);
      setIsTransitioning(false);
    }, 0);
  };

  async function handleOnSubmit(values: DataType) {
    if (events?.onSubmit) {
      setIsLoading(true);
      try {
        await events.onSubmit(values);
        setStep(0);
        form.reset();
      } catch (error) {
        console.error(error);
        if (events?.onError) {
          events.onError(error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="mt-4 rounded-xl border bg-card pt-4 text-card-foreground shadow">
      <div className="h-full p-6 pt-0">
        <FormProvider {...form}>
          <form
            className="relative flex h-full flex-col space-y-4"
            onSubmit={form.handleSubmit(handleOnSubmit)}
          >
            <div className="px-1">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {crrStepTitle}
                </h2>
                <div className={`grid grid-cols-${crrGridCols} gap-2`}>
                  {crrStepFields.map((field) => (
                    <FormField
                      key={field.name}
                      control={form.control}
                      name={field.name}
                      render={({ field: formField }) => {
                        const style = field.isFullWidth
                          ? { gridColumn: `span ${crrGridCols}` }
                          : {};
                        if (field.type === TFieldItem.CHECKBOX) {
                          return (
                            <FormItem
                              className="flex flex-row items-start space-x-3 space-y-0"
                              style={style}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={formField.value}
                                  onCheckedChange={formField.onChange}
                                  disabled={field.disabled || formDisabled}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>{field.label}</FormLabel>
                              </div>
                            </FormItem>
                          );
                        }
                        return (
                          <FormItem className={field.className} style={style}>
                            <FormLabel>
                              {field.label}
                              {field.required && "*"}
                            </FormLabel>
                            <FormControl>
                              {field.type === "select" ? (
                                <Select
                                  onValueChange={formField.onChange}
                                  defaultValue={formField.value || undefined}
                                  disabled={field.disabled || formDisabled}
                                >
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={
                                        field.placeholder ||
                                        `Select ${field.label}`
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[200px] overflow-y-auto">
                                    {"options" in field &&
                                      field.options?.map((option) => (
                                        <SelectItem
                                          key={option.value}
                                          value={option.value}
                                        >
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
                                  disabled={field.disabled || formDisabled}
                                  onChange={(e) => {
                                    const value =
                                      field.type === TFieldItem.NUMBER
                                        ? Number(e.target.value)
                                        : e.target.value;
                                    formField.onChange(value);
                                  }}
                                  placeholder={field.placeholder}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex w-full justify-between">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={formDisabled}
                >
                  Previous
                </Button>
              )}
              {step < totalSteps - 1 ? (
                <Button
                  type="button"
                  disabled={formDisabled}
                  onClick={handleNextStep}
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={formDisabled}
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
