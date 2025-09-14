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
  
  const { 
    onChange, 
    onBlur, 
    value, 
    placeholder = "Enter your password",
    className,
    beforeInput,
    afterInput,
    disabled,
    key, // Extract key to prevent spreading it into JSX
    ...restProps 
  } = inputProps;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        {/* Before Input Icon */}
        {beforeInput && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {beforeInput}
          </div>
        )}
        
        {/* Default Lock Icon if no beforeInput provided */}
        {!beforeInput && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock className="h-4 w-4" />
          </div>
        )}

        {/* Password Input */}
        <Input
          {...restProps}
          id={id}
          type={showPassword ? "text" : "password"}
          value={value || ""}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(
            "pr-12", // Space for the eye button
            beforeInput || !beforeInput ? "pl-10" : "pl-3", // Space for the lock icon
            afterInput ? "pr-20" : "pr-12", // Extra space if afterInput exists
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          autoComplete="current-password"
        />

        {/* Toggle Password Visibility Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={togglePasswordVisibility}
          disabled={disabled}
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
        {afterInput && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground">
            {afterInput}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
};

export default PasswordInputField;