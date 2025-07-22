"use client";

import { cn } from "@/lib/utils";
import { login } from "@/lib/auth";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { ZodProvider, fieldConfig } from "@autoform/zod";
import { buildZodFieldConfig } from "@autoform/react";
import { SubmitButton } from "../ui/autoform/components/SubmitButton";
import { AutoForm } from "../ui/autoform";


const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .superRefine(
      fieldConfig({
        label: "Email address",
        inputProps: {
          type: "email",
          placeholder: "Enter your email address",
        },
      })
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .superRefine(
      fieldConfig({
        label: "Password",
        inputProps: {
          type: "password",
          placeholder: "Enter your password",
        },
      })
    ),
});

const schemaProvider = new ZodProvider(loginSchema);

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await login(values.email, values.password);
      if (error) throw error;
      router.push("/protected");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full mx-auto">
        <CardHeader className="space-y-2 ">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center text-base">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <AutoForm
            schema={schemaProvider}
            onSubmit={handleLogin}
            withSubmit
            uiComponents={{
              SubmitButton: (props: any) => (
                <SubmitButton
                  {...props}
                  loading={isLoading}
                  disabled={isLoading}
                  loadingText="Signing in..."
                >
                  Sign in
                </SubmitButton>
              ),
            }}
          />

          <div className="pt-6 border-t">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
