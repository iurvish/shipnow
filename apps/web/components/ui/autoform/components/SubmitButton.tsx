import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const SubmitButton: React.FC<{
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}> = ({ children, disabled, loading }) => (
  <Button type="submit" disabled={disabled || loading} className="w-full">
    {loading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Signing in...
      </>
    ) : (
      children || "Sign in"
    )}
  </Button>
);
