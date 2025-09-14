"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { fieldConfig, ZodProvider } from "@autoform/zod";
import { SubmitButton } from "../ui/autoform/components/SubmitButton";
import { AutoForm } from "../ui/autoform";
import { Alert, AlertDescription } from "../ui/alert";
import PasswordInputField from "../ui/autoform/custom/password-input";

const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .superRefine(
      fieldConfig({
        label: "New Password",
        fieldType: "password-input",
        inputProps: {
          placeholder: "Enter your new password",
        },
      })
    ),
});

const schemaProvider = new ZodProvider(updatePasswordSchema);

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (
    values: z.infer<typeof updatePasswordSchema>
  ) => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/protected");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <AutoForm
              schema={schemaProvider}
              onSubmit={handleForgotPassword}
              withSubmit
              formComponents={{
                "password-input": PasswordInputField,
              }}
              uiComponents={{
                SubmitButton: (props: any) => (
                  <SubmitButton
                    {...props}
                    loading={isLoading}
                    disabled={isLoading}
                    loadingText="Saving..."
                  >
                    Save new password
                  </SubmitButton>
                ),
              }}
            />
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}{" "}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save new password"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
