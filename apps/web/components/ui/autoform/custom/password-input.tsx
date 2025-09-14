"use client";

import React, { useState } from "react";
import { AutoFormFieldProps } from "@autoform/react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PasswordInputField: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
  field,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const { key, onChange, type: _type, ...props } = inputProps;

  const placeholder = field.fieldConfig?.inputProps?.placeholder;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        {/* Before Input Icon */}

        {/* Password Input */}
        <Input
          key={key}
          id={id}
          type={showPassword ? "text" : "password"}
          {...props}
          className={cn(
            "pr-12", // Space for the eye button

            error && "border-destructive focus-visible:ring-destructive",
            props.className
          )}
          placeholder={placeholder || props.placeholder}
          onChange={onChange}
          autoComplete="current-password"
        />

        {/* Toggle Password Visibility Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>

        {/* After Input Element */}
      </div>

      {/* Error Message */}
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
};

export default PasswordInputField;
