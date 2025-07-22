import { ExtendableAutoFormProps } from "@autoform/react";
import { FieldValues } from "react-hook-form";
import { AutoFormUIComponents, AutoFormFieldComponents } from "@autoform/react";

export interface AutoFormProps<T extends FieldValues>
  extends ExtendableAutoFormProps<T> {}


export interface CustomAutoFormUIComponents extends AutoFormUIComponents {
  // Add any additional UI components specific to your integration
  // This could include theme configuration, layout components, etc.
}

export interface CustomAutoFormFieldComponents extends AutoFormFieldComponents {
  // Add any additional field components specific to your integration
}
