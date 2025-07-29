"use client";

import React from "react";
import { z } from "zod";
import { AutoForm } from "../AutoForm";
import { ZodProvider, fieldConfig } from "@autoform/zod";
import CustomInput from "./input";
import CustomTextArea from "./textarea";
import CustomMultiSelect from "./multiselect";
// import CustomDatePicker from "./date-picker";
// import PhoneNumberInput from "./phone-input";
// import SelectCommand from "./select-command";
import { StringField } from "../components/StringField"; // Import built-in StringField
import { Search, Mail, User, Calendar, Phone } from "lucide-react";

// Example schema with custom field configurations
const exampleSchema = z.object({
  // Custom Input with icons
  email: z
    .string()
    .email()
    .superRefine(
      fieldConfig({
        label: "Email Address",
        description: "Your email address",
        inputProps: {
          type: "email",
          placeholder: "Enter your email",
          beforeInput: <Mail className="h-4 w-4" />,
        },
      })
    ),

  // Custom Input with search icon
  search: z
    .string()
    .min(3)
    .superRefine(
      fieldConfig({
        label: "Search",
        description: "Search query",
        inputProps: {
          type: "text",
          placeholder: "Search...",
          beforeInput: <Search className="h-4 w-4" />,
        },
      })
    ),

  // Phone Input (simple tel input) - using built-in StringField
  phone: z.string().superRefine(
    fieldConfig({
      label: "Phone (Built-in)",
      description: "Phone number using built-in StringField",
      inputProps: {
        type: "tel",
        placeholder: "+1 (555) 000-0000",
      },
    })
  ),

  // Amount with prefix
  amount: z
    .number()
    .min(0)
    .superRefine(
      fieldConfig({
        label: "Amount",
        description: "Enter amount",
        inputProps: {
          type: "number",
          placeholder: "0.00",
          beforeInput: <span className="text-sm">$</span>,
        },
      })
    ),

  // Custom TextArea
  bio: z
    .string()
    .min(10)
    .superRefine(
      fieldConfig({
        label: "Bio",
        description: "Tell us about yourself",
        fieldType: "textarea",
        inputProps: {
          placeholder: "Write your bio here...",
          rows: 4,
        },
      })
    ),

  // Select Command (searchable)
  city: z.string().superRefine(
    fieldConfig({
      label: "City",
      description: "Select your city",
      fieldType: "select-command",
      inputProps: {
        placeholder: "Choose a city",
        searchPlaceholder: "Search cities...",
        options: [
          { label: "New York", value: "ny" },
          { label: "Los Angeles", value: "la" },
          { label: "Chicago", value: "chicago" },
          { label: "Houston", value: "houston" },
          { label: "Phoenix", value: "phoenix" },
          { label: "Philadelphia", value: "philadelphia" },
        ],
      },
    })
  ),

  // Multi Select
  skills: z
    .array(z.string())
    .min(1)
    .superRefine(
      fieldConfig({
        label: "Skills",
        description: "Select your skills",
        fieldType: "multiselect",
        inputProps: {
          placeholder: "Choose your skills",
          maxSelections: 5,
          options: [
            { label: "JavaScript", value: "javascript" },
            { label: "TypeScript", value: "typescript" },
            { label: "React", value: "react" },
            { label: "Node.js", value: "nodejs" },
            { label: "Python", value: "python" },
            { label: "Java", value: "java" },
            { label: "Go", value: "go" },
            { label: "Rust", value: "rust" },
          ],
        },
      })
    ),

  // Date Picker
  birthdate: z.date().superRefine(
    fieldConfig({
      label: "Birth Date",
      description: "Your date of birth",
      fieldType: "date",
      inputProps: {
        placeholder: "Select your birth date",
      },
    })
  ),
});

const schemaProvider = new ZodProvider(exampleSchema);

export function CustomInputExample() {
  const handleSubmit = (data: any) => {
    console.log("Form submitted:", data);
    alert("Form submitted! Check the console for data.");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">AutoForm Custom Components</h2>
        <p className="text-muted-foreground">
          A showcase of all custom AutoForm field components
        </p>
      </div>

      <AutoForm
        schema={schemaProvider}
        formComponents={{
          // Register custom components for different field types
          string: CustomInput,
          number: CustomInput,

          // Custom field types using fieldType in schema
          textarea: CustomTextArea,
          // "select-command": SelectCommand,
          // multiselect: CustomMultiSelect,
          // date: CustomDatePicker,

          // Built-in AutoForm component for phone (using fieldType)
          phone: StringField,
        }}
        onSubmit={handleSubmit}
        withSubmit
      />
    </div>
  );
}

export default CustomInputExample;
