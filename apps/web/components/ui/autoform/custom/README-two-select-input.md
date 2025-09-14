# TwoSelectInput Component

A reusable AutoForm component that provides two connected select fields where the second select's options depend on the first select's value.

## Features

- **Conditional Rendering**: Second select only appears after first select has a value
- **Dynamic Options**: Second select options are loaded based on first select value
- **AutoForm Compatible**: Integrates seamlessly with AutoForm system
- **Loading States**: Shows loading indicator while fetching second options
- **Validation**: Supports error display and validation

## Component Structure

- **First Select**: Uses `SelectCommand` component with search functionality
- **Second Select**: Uses `SelectField` component (regular select dropdown)
- **Data Flow**: Values are combined into a single object `{ first: string, second: string }`

## Usage

### 1. Basic Configuration

```typescript
import { z } from "zod";

const schema = z.object({
  categorySelection: z.object({
    first: z.string().min(1, "Please select a category"),
    second: z.string().min(1, "Please select an option"),
  }),
});

const fieldConfig = {
  categorySelection: {
    fieldType: "two-select-input",
    label: "Category & Option Selection",
    inputProps: {
      firstSelectLabel: "Select Category",
      secondSelectLabel: "Select Option",
      firstSelectPlaceholder: "Choose category...",
      secondSelectPlaceholder: "Choose option...",
      firstSelectOptions: [
        { label: "Technology", value: "tech" },
        { label: "Marketing", value: "marketing" },
        { label: "Sales", value: "sales" },
      ],
      getSecondOptions: async (firstValue: string) => {
        // Return options based on first selection
        switch (firstValue) {
          case "tech":
            return [
              { label: "Frontend", value: "frontend" },
              { label: "Backend", value: "backend" },
              { label: "DevOps", value: "devops" },
            ];
          case "marketing":
            return [
              { label: "Digital Marketing", value: "digital" },
              { label: "Content Marketing", value: "content" },
              { label: "SEO", value: "seo" },
            ];
          case "sales":
            return [
              { label: "Inside Sales", value: "inside" },
              { label: "Outside Sales", value: "outside" },
              { label: "Account Management", value: "account" },
            ];
          default:
            return [];
        }
      },
    },
  },
};
```

### 2. Separate Fields Mode

```typescript
import { z } from "zod";

const schema = z.object({
  department: z.string().min(1, "Please select a department"),
  role: z.string().min(1, "Please select a role"),
});

const fieldConfig = {
  departmentRole: {
    // This is just a container field
    fieldType: "two-select-input",
    label: "Department & Role Selection",
    inputProps: {
      separateFields: true,
      firstFieldName: "department", // Will create form field named "department"
      secondFieldName: "role", // Will create form field named "role"
      firstSelectLabel: "Select Department",
      secondSelectLabel: "Select Role",
      firstSelectPlaceholder: "Choose department...",
      secondSelectPlaceholder: "Choose role...",
      firstSelectOptions: [
        { label: "Engineering", value: "engineering" },
        { label: "Marketing", value: "marketing" },
        { label: "Sales", value: "sales" },
      ],
      getSecondOptions: async (department: string) => {
        // Return roles based on department
        const roles = await fetchRolesByDepartment(department);
        return roles;
      },
    },
  },
};

// Form data will be:
// { department: "engineering", role: "frontend" }
```

### 3. With API Integration

```typescript
const fieldConfig = {
  locationSelection: {
    fieldType: "two-select-input",
    label: "Location Selection",
    inputProps: {
      firstSelectLabel: "Select Country",
      secondSelectLabel: "Select City",
      firstSelectPlaceholder: "Choose country...",
      secondSelectPlaceholder: "Choose city...",
      firstSelectOptions: async () => {
        const response = await fetch("/api/countries");
        return response.json();
      },
      getSecondOptions: async (countryId: string) => {
        const response = await fetch(`/api/cities?country=${countryId}`);
        return response.json();
      },
    },
  },
};
```

### 3. Register with AutoForm

```typescript
// In your AutoForm setup file
import TwoSelectInput from "./custom/two-select-input";

// Register the component
AutoFormConfig.addFieldComponent("two-select-input", TwoSelectInput);
```

## Configuration Options

| Property                  | Type                                                            | Default              | Description                                               |
| ------------------------- | --------------------------------------------------------------- | -------------------- | --------------------------------------------------------- |
| `firstSelectLabel`        | `string`                                                        | "Select Category"    | Label for first select field                              |
| `secondSelectLabel`       | `string`                                                        | "Select Option"      | Label for second select field                             |
| `firstSelectPlaceholder`  | `string`                                                        | "Choose category..." | Placeholder for first select                              |
| `secondSelectPlaceholder` | `string`                                                        | "Choose option..."   | Placeholder for second select                             |
| `firstSelectOptions`      | `OptionType[] \| () => Promise<OptionType[]>`                   | `[]`                 | Options for first select                                  |
| `getSecondOptions`        | `(firstValue: string) => OptionType[] \| Promise<OptionType[]>` | Required             | Function to get second options                            |
| `disabled`                | `boolean`                                                       | `false`              | Disable both selects                                      |
| `separateFields`          | `boolean`                                                       | `false`              | Handle as separate form fields instead of combined object |
| `firstFieldName`          | `string`                                                        | `{fieldKey}_first`   | Custom name for first field (when separateFields=true)    |
| `secondFieldName`         | `string`                                                        | `{fieldKey}_second`  | Custom name for second field (when separateFields=true)   |

## Data Structure

### Combined Object Mode (default)

When `separateFields` is `false` or not specified, the component returns data in the following format:

```typescript
{
  first: string; // Value from first select
  second: string; // Value from second select
}
```

### Separate Fields Mode

When `separateFields` is `true`, the component creates two separate form fields with individual names:

```typescript
// Two separate string values in the form data
{
  [firstFieldName]: string;  // Value from first select
  [secondFieldName]: string; // Value from second select
}
```

## Behavior

1. **Initial State**: Only first select is visible
2. **First Selection**: When user selects from first dropdown, second dropdown appears
3. **Loading**: While fetching second options, a loading indicator is shown
4. **Reset**: When first selection changes, second selection is cleared
5. **Validation**: Component supports error display for the overall field

## Error Handling

- If `getSecondOptions` throws an error, second select will show empty options
- Errors are logged to console for debugging
- Component gracefully handles missing or invalid configuration

## Styling

The component uses Tailwind CSS classes and follows the existing AutoForm styling patterns:

- `space-y-4`: Vertical spacing between elements
- Labels use `text-sm font-medium mb-2 block`
- Loading state uses `bg-muted animate-pulse`
- Error messages use `text-destructive`

## Examples

### Department & Role Selection

```typescript
getSecondOptions: async (department: string) => {
  const roles = {
    engineering: [
      { label: "Software Engineer", value: "swe" },
      { label: "DevOps Engineer", value: "devops" },
      { label: "QA Engineer", value: "qa" },
    ],
    product: [
      { label: "Product Manager", value: "pm" },
      { label: "Product Designer", value: "designer" },
      { label: "Product Analyst", value: "analyst" },
    ],
  };
  return roles[department] || [];
};
```

### Skill Category & Specific Skills

```typescript
getSecondOptions: async (category: string) => {
  const response = await fetch(`/api/skills?category=${category}`);
  return response.json();
};
```
