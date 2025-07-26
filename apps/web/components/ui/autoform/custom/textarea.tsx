import React from "react";
import { AutoFormFieldProps } from "@autoform/react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const CustomTextArea: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
  field,
}) => {
  const { key, ...props } = inputProps;

  // Get custom props from fieldConfig
  const rows = field.fieldConfig?.inputProps?.rows || 3;
  const cols = field.fieldConfig?.inputProps?.cols;
  const placeholder = field.fieldConfig?.inputProps?.placeholder;

  return (
    <Textarea
      key={key}
      id={id}
      {...props}
      className={cn(error ? "border-destructive" : "")}
      rows={rows}
      cols={cols}
      placeholder={placeholder || props.placeholder}
    />
  );
};

export default CustomTextArea;
