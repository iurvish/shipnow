// Example usage of SelectCommand component with AutoForm

import { z } from "zod";
import { ZodProvider, fieldConfig } from "@autoform/zod";
import { AutoForm } from "@/components/ui/autoform";
import SelectCommand from "./select-command";

// Example with static options
const exampleSchema = z.object({
  category: z.string().superRefine(
    fieldConfig({
      label: "Category",
      fieldType: "select-command", // This should match your formComponents registration
      inputProps: {
        placeholder: "Select a category...",
        options: [
          { value: "tech", label: "Technology" },
          { value: "design", label: "Design" },
          { value: "marketing", label: "Marketing" },
        ],
      },
    })
  ),
});

// Example with async options
const asyncExampleSchema = z.object({
  user: z.string().superRefine(
    fieldConfig({
      label: "User",
      fieldType: "select-command",
      inputProps: {
        placeholder: "Select a user...",
        options: async () => {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return [
            { value: "1", label: "John Doe" },
            { value: "2", label: "Jane Smith" },
            { value: "3", label: "Bob Johnson" },
          ];
        },
      },
    })
  ),
});

// Example with conditional options
const conditionalExampleSchema = z.object({
  country: z.string().superRefine(
    fieldConfig({
      label: "Country",
      fieldType: "select-command",
      inputProps: {
        placeholder: "Select a country...",
        options: [
          { value: "us", label: "United States" },
          { value: "ca", label: "Canada" },
          { value: "uk", label: "United Kingdom" },
        ],
      },
    })
  ),
  state: z.string().superRefine(
    fieldConfig({
      label: "State/Province",
      fieldType: "select-command",
      inputProps: {
        placeholder: "Select a state...",
        conditionalOptions: {
          fieldName: "country",
          fn: async (countryValue: string) => {
            // Simulate API call based on country
            await new Promise((resolve) => setTimeout(resolve, 500));

            const statesByCountry: Record<
              string,
              Array<{ value: string; label: string }>
            > = {
              us: [
                { value: "ca", label: "California" },
                { value: "ny", label: "New York" },
                { value: "tx", label: "Texas" },
              ],
              ca: [
                { value: "on", label: "Ontario" },
                { value: "bc", label: "British Columbia" },
                { value: "qc", label: "Quebec" },
              ],
              uk: [
                { value: "en", label: "England" },
                { value: "sc", label: "Scotland" },
                { value: "wa", label: "Wales" },
              ],
            };

            return statesByCountry[countryValue] || [];
          },
        },
      },
    })
  ),
});

// Example component using SelectCommand
export const SelectCommandExample = () => {
  return (
    <AutoForm
      schema={new ZodProvider(conditionalExampleSchema)}
      formComponents={{
        "select-command": SelectCommand, // Register the component
      }}
      onSubmit={(data) => {
        console.log("Form submitted:", data);
      }}
    />
  );
};
