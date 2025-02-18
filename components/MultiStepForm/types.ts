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

export interface IMultiStepForm {
  title?: string;
  options: TFormStepOption[];
  showProgress?: boolean;
  className?: string;
  gridCols?: number;
}
