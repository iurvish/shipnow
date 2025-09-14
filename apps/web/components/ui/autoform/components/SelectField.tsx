import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AutoFormFieldProps } from "@autoform/react";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const SelectField: React.FC<AutoFormFieldProps> = ({
  field,
  inputProps,
  error,
  id,
}) => {
  const { key, ...props } = inputProps;
  const [selectValue, setSelectValue] = useState<string>("");

  // Initialize value from props or from form data
  useEffect(() => {
    let initialValue = props.value || field.default || "";

    // If no value from props, try to get it from form data in DOM
    if (!initialValue) {
      const formElement = document.querySelector("form");
      if (formElement) {
        const formDataAttr = formElement.getAttribute("data-form-values");
        if (formDataAttr) {
          try {
            const formData = JSON.parse(formDataAttr);
            if (formData[field.key]) {
              initialValue = formData[field.key];
            }
          } catch (e) {
            // Ignore JSON parse errors
          }
        }
      }
    }

    // Only update if we have a valid value and it's different from current
    if (initialValue && initialValue !== selectValue) {
      setSelectValue(initialValue);

      // Immediately sync with form state by triggering onChange
      const syntheticEvent = {
        target: {
          value: initialValue,
          name: field.key,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      props.onChange(syntheticEvent);

      // Debug only for degree_level to reduce console noise
      if (field.key === "degree_level") {
        console.log(`SelectField ${field.key} initialized with:`, {
          propsValue: props.value,
          fieldDefault: field.default,
          finalValue: initialValue,
        });
      }
    }
  }, [props.value, field.default, field.key, selectValue]);

  const handleValueChange = (value: string) => {
    if (value !== selectValue) {
      setSelectValue(value);

      if (field.key === "degree_level") {
        console.log(`SelectField ${field.key} changed to:`, value);
      }

      const syntheticEvent = {
        target: {
          value,
          name: field.key,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      props.onChange(syntheticEvent);
    }
  };

  return (
    <Select {...props} onValueChange={handleValueChange} value={selectValue}>
      <SelectTrigger
        id={id}
        className={cn(
          "w-full",
          error ? "border-destructive" : "",
          props.className
        )}
      >
        <SelectValue
          placeholder={props.placeholder || "Select an option"}
          className="truncate"
        />
      </SelectTrigger>
      <SelectContent>
        {(field.options || []).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            <span className="truncate">{label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
