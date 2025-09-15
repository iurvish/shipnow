"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, X, Loader2 } from "lucide-react";
import { checkUsernameAvailability } from "@/lib/actions/onboarding";
import { useDebounce } from "@/hooks/use-debounce";

interface FormUsernameInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

type ValidationState =
  | "idle"
  | "checking"
  | "available"
  | "unavailable"
  | "invalid";

const FormUsernameInput = React.forwardRef<
  HTMLInputElement,
  FormUsernameInputProps
>(
  (
    {
      className,
      value = "",
      onChange,
      onBlur,
      placeholder,
      disabled,
      ...props
    },
    ref
  ) => {
    const [validationState, setValidationState] =
      useState<ValidationState>("idle");
    const [validationMessage, setValidationMessage] = useState<string>("");

    // Debounce the username value to avoid too many API calls
    const debouncedUsername = useDebounce(value, 500);

    // Client-side validation function
    const validateUsernameFormat = useCallback(
      (username: string): { valid: boolean; message?: string } => {
        if (!username) return { valid: false };
        if (username.length < 3)
          return {
            valid: false,
            message: "Username must be at least 3 characters",
          };
        if (username.length > 20)
          return {
            valid: false,
            message: "Username must be at most 20 characters",
          };

        const usernameRegex = /^[a-zA-Z0-9._]+$/;
        if (!usernameRegex.test(username)) {
          return {
            valid: false,
            message:
              "Username can only contain letters, numbers, dots, and underscores",
          };
        }

        if (
          username.startsWith(".") ||
          username.startsWith("_") ||
          username.endsWith(".") ||
          username.endsWith("_")
        ) {
          return {
            valid: false,
            message: "Username cannot start or end with dots or underscores",
          };
        }

        if (
          username.includes("..") ||
          username.includes("__") ||
          username.includes("._") ||
          username.includes("_.")
        ) {
          return {
            valid: false,
            message: "Username cannot have consecutive dots or underscores",
          };
        }

        return { valid: true };
      },
      []
    );

    // Check username availability when debounced value changes
    useEffect(() => {
      const checkAvailability = async () => {
        if (!debouncedUsername) {
          setValidationState("idle");
          setValidationMessage("");
          return;
        }

        // First check client-side format validation
        const formatCheck = validateUsernameFormat(debouncedUsername);
        if (!formatCheck.valid) {
          setValidationState("invalid");
          setValidationMessage(
            formatCheck.message || "Invalid username format"
          );
          return;
        }

        // If format is valid, check availability on server
        setValidationState("checking");
        setValidationMessage("Checking availability...");

        try {
          const result = await checkUsernameAvailability(debouncedUsername);

          if (result.success) {
            if (result.data.available) {
              setValidationState("available");
              setValidationMessage("Username is available!");
            } else {
              setValidationState("unavailable");
              setValidationMessage("Username is already taken");
            }
          } else {
            setValidationState("invalid");
            setValidationMessage(result.error || "Error checking username");
          }
        } catch (error) {
          setValidationState("invalid");
          setValidationMessage("Error checking username availability");
          console.error("Username check error:", error);
        }
      };

      checkAvailability();
    }, [debouncedUsername, validateUsernameFormat]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange?.(newValue);

      // Reset validation state on immediate change
      if (validationState !== "idle" && validationState !== "checking") {
        setValidationState("idle");
        setValidationMessage("");
      }
    };

    // Get the appropriate icon based on validation state
    const getValidationIcon = () => {
      switch (validationState) {
        case "checking":
          return (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          );
        case "available":
          return <Check className="h-4 w-4 text-green-500" />;
        case "unavailable":
        case "invalid":
          return <X className="h-4 w-4 text-red-500" />;
        default:
          return null;
      }
    };

    // Get input border color based on validation state
    const getBorderColor = () => {
      switch (validationState) {
        case "available":
          return "border-green-500 focus:border-green-500 focus:ring-green-500";
        case "unavailable":
        case "invalid":
          return "border-red-500 focus:border-red-500 focus:ring-red-500";
        case "checking":
          return "border-blue-500 focus:border-blue-500 focus:ring-blue-500";
        default:
          return "";
      }
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-muted-foreground text-sm">@</span>
          </div>
          <Input
            ref={ref}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("pl-8 pr-10", getBorderColor(), className)}
            autoComplete="username"
            spellCheck={false}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {getValidationIcon()}
          </div>
        </div>

        {/* Validation message */}
        {validationMessage && validationState !== "idle" && (
          <p
            className={cn(
              "text-sm",
              validationState === "available" && "text-green-600",
              validationState === "checking" && "text-blue-600",
              (validationState === "unavailable" ||
                validationState === "invalid") &&
                "text-red-600"
            )}
          >
            {validationMessage}
          </p>
        )}
      </div>
    );
  }
);

FormUsernameInput.displayName = "FormUsernameInput";

export { FormUsernameInput };
