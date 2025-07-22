import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const SubmitButton: React.FC<{
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
}> = ({ children, disabled, loading, loadingText }) => (
  <Button type="submit" disabled={disabled || loading} className="w-full">
    {loading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {loadingText || "Processing..."}
      </>
    ) : (
      children || "Submit"
    )}
  </Button>
);
