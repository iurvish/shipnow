import { Textarea } from "@/components/ui/textarea";
import { AutoFormFieldProps } from "@autoform/react";
import React from "react";

export const TextareaField: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
  field,
}) => {
  const { key, ...props } = inputProps;

  return (
    <Textarea
      key={key}
      id={id}
      className={error ? "border-destructive" : ""}
      {...props}
    />
  );
};
