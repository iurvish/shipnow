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

  // Check if this is a password field based on id
  const isPasswordField = id?.toLowerCase().includes("password");

  return (
    <Input
      id={id}
      type={isPasswordField ? "password" : "text"}
      className={error ? "border-destructive" : ""}
      {...props}
    />
  );
};
