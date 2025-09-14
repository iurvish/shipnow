import React from "react";
import { Input } from "@/components/ui/input";
import { AutoFormFieldProps } from "@autoform/react";
import { cn } from "@/lib/utils";

const CustomInput: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
  field,
}) => {
  const { key, onChange, ...props } = inputProps;

  // Get custom props from fieldConfig if available
  const customType = field.fieldConfig?.inputProps?.type;
  const placeholder = field.fieldConfig?.inputProps?.placeholder;

  // Handle file input changes to convert FileList to array
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (customType === "file" && e.target.files) {
      const filesArray = Array.from(e.target.files);
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: filesArray,
          name: field.key,
        },
      };
      onChange(syntheticEvent as any);
    } else {
      onChange(e);
    }
  };

  return (
    <Input
      key={key}
      id={id}
      {...props}
      className={cn(error ? "border-destructive" : "", props.className)}
      placeholder={placeholder || props.placeholder}
      type={customType || props.type || "text"}
      onChange={handleFileChange}
    />
  );
};

export default CustomInput;
