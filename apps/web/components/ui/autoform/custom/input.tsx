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
  const {
    key,
    onChange,
    beforeInput: _beforeInput,
    afterInput: _afterInput,
    type: _type,
    ...props
  } = inputProps;

  // Get custom props from fieldConfig if available
  const beforeInput = field.fieldConfig?.inputProps?.beforeInput;
  const afterInput = field.fieldConfig?.inputProps?.afterInput;
  const customType = field.fieldConfig?.inputProps?.type;
  const placeholder = field.fieldConfig?.inputProps?.placeholder;

  const hasBefore = !!beforeInput;
  const hasAfter = !!afterInput;

  return (
    <div className="relative">
      {beforeInput && (
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          {beforeInput}
        </div>
      )}

      <Input
        key={key}
        id={id}
        {...props}
        className={cn(
          error ? "border-destructive" : "",
          hasBefore && "ps-9",
          hasAfter && "pe-9"
        )}
        placeholder={placeholder || props.placeholder}
        type={customType || props.type || "text"}
      />

      {afterInput && (
        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
          {afterInput}
        </div>
      )}
    </div>
  );
};

export default CustomInput;
