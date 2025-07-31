import React, { useRef } from "react";
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

  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);

  const hasAfter = !!afterInput;

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
    <div className="relative">
      {beforeInput ? (
        <div className="flex">
          {/* Prefix section with border */}
          <div
            ref={beforeRef}
            className={cn(
              "flex items-center justify-center px-3 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input border rounded-l-md text-muted-foreground text-sm",
              "transition-colors duration-200"
              // Focus styles will be applied via CSS when input is focused
            )}
          >
            {beforeInput}
          </div>

          {/* Input with connected border */}
          <Input
            key={key}
            id={id}
            {...props}
            className={cn(
              "rounded-l-none border-l-0 focus:border-l-0 focus-visible:ring-offset-0",
              error ? "border-destructive" : "",
              props.className
            )}
            placeholder={placeholder || props.placeholder}
            type={customType || props.type || "text"}
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <Input
          key={key}
          id={id}
          {...props}
          className={cn(error ? "border-destructive" : "", props.className)}
          style={{
            paddingRight: hasAfter ? "2.5rem" : undefined,
          }}
          placeholder={placeholder || props.placeholder}
          type={customType || props.type || "text"}
          onChange={handleFileChange}
        />
      )}

      {afterInput && !beforeInput && (
        <div
          ref={afterRef}
          className=" pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 text-muted-foreground/80 peer-disabled:opacity-50"
        >
          {afterInput}
        </div>
      )}

      {/* <style jsx>{`
        .flex:focus-within > div:first-child {
          border-color: hsl(var(--ring));
        }
        .flex:focus-within > input {
          border-color: hsl(var(--ring));
        }
      `}</style> */}
    </div>
  );
};

export default CustomInput;
