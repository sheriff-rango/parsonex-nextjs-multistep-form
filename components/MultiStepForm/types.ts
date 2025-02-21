import { FieldValue, WatchObserver } from "react-hook-form";
import { ZodType } from "zod";

export enum TFieldItem {
  TEXT = "text",
  DATE = "date",
  SELECT = "select",
  CHECKBOX = "checkbox",
  NUMBER = "number",
}

export enum TMode {
  CREATING = "CREATING",
  EDITING = "EDITING",
}

export interface IBasicField {
  name: string;
  label: string;
  type: TFieldItem;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export interface IInputField extends IBasicField {}

export interface ISelectField extends IBasicField {
  options: { label: string; value: string }[];
}

export type IField = IBasicField | IInputField | ISelectField;

type TFormStepOption = {
  title: string;
  fields: IField[];
  gridCols?: number;
};

export type DataType = {
  [key: string]: any;
};

import { FieldValues } from "react-hook-form";

export type TEvents<DataType> = {
  onSubmit?:
    | ((values: DataType) => Promise<void>)
    | ((values: DataType) => void);
  onError?: (error: any) => void;
};

export interface IMultiStepForm<DataType extends FieldValues> {
  mode?: TMode;
  defaultValues?: DataType;
  options: TFormStepOption[];
  showProgress?: boolean;
  className?: string;
  subscriptionCallback?: WatchObserver<FieldValue<DataType>>;
  events?: TEvents<DataType>;
  resolver?: ZodType<any, any, any>;
}
