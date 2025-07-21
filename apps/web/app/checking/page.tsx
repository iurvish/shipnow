"use client";

import React from "react";
import { z } from "zod";
import { ZodProvider } from "@autoform/zod";
import { AutoForm } from "@/components/ui/autoform/AutoForm";
import { Button } from "@/components/ui/button";

// Create a comprehensive schema with descriptions and validations
const userSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .describe("Your full name"),

  email: z.string().email("Invalid email address").describe("Email address"),
});

// Create schema provider
const schemaProvider = new ZodProvider(userSchema);

const UserRegistrationPage = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">User Registration</h1>
        <p className="text-muted-foreground">
          Fill out the form below to create your account
        </p>
      </div>

      <AutoForm
        schema={schemaProvider}
        onSubmit={(data: any) => {
          console.log("Form submitted with data:", data);
          alert("Form submitted successfully! Check console for data");
        }}
        defaultValues={{
          notifications: true,
        }}
        formProps={{
          className: "space-y-6",
        }}
      >
              <Button type="submit">Save</Button>

      </AutoForm>

      <div className="text-sm text-muted-foreground">
        By submitting this form, you agree to our{" "}
        <a href="#" className="underline hover:text-primary">
          terms and conditions
        </a>
        .
      </div>
    </div>
  );
};

export default UserRegistrationPage;
