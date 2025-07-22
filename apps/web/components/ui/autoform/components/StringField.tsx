import { Input } from "@/components/ui/input";
import { AutoFormFieldProps } from "@autoform/react";
import React from "react";

export const StringField: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
  field,
}) => {
  const { key, ...props } = inputProps;

  return (
    <Input
      key={key}
      id={id}
      className={error ? "border-destructive" : ""}
      {...props}
    />
  );
};
