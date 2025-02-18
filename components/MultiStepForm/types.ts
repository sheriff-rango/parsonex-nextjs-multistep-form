import { FieldValue, WatchObserver } from "react-hook-form";
import { z } from "zod";

export enum TFieldItem {
  TEXT = "text",
  DATE = "date",
  SELECT = "select",
  CHECKBOX = "checkbox",
}

export interface IBasicField {
  name: string;
  label: string;
  type: TFieldItem;
  required?: boolean;
  className?: string;
  resolver?: z.ZodString;
}

export interface IInputField extends IBasicField {}

export interface ISelectField extends IBasicField {
  options: { label: string; value: string }[];
}

export type IField = IBasicField | IInputField | ISelectField;

type TFormStepOption = {
  title: string;
  fields: IField[];
};

export type DataType = {
  [x: string]: any;
};

import { FieldValues } from "react-hook-form";

export type TEvents<DataType> = {
  onSubmit: (values: DataType) => Promise<void>;
  onError: (error: any) => void;
};

export interface IMultiStepForm<DataType extends FieldValues> {
  title?: string;
  defaultValues?: DataType;
  options: TFormStepOption[];
  showProgress?: boolean;
  className?: string;
  gridCols?: number;
  subscriptionCallback?: WatchObserver<FieldValue<DataType>>;
  events?: TEvents<DataType>;
}
