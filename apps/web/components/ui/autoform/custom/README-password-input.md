# Password Input Field Component

A custom AutoForm field component for password inputs with show/hide functionality.

## Features

- **Show/Hide Toggle**: Click the eye icon to toggle password visibility
- **Custom Icons**: Support for custom icons via `beforeInput` prop
- **Default Lock Icon**: Shows a lock icon by default if no custom icon is provided
- **Error Handling**: Built-in error message display
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Validation**: Works seamlessly with Zod validation
- **Responsive**: Adapts to different screen sizes

## Usage

### Basic Usage

```tsx
import { z } from "zod";
import { fieldConfig } from "@autoform/zod";
import { AutoForm } from "@/components/ui/autoform";

const schema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .superRefine(
      fieldConfig({
        label: "Password",
        fieldType: "password-input",
        inputProps: {
          placeholder: "Enter your password",
        },
      })
    ),
});

function LoginForm() {
  return <AutoForm schema={schema} onSubmit={(data) => console.log(data)} />;
}
```

### With Custom Icon

```tsx
import { Shield, Lock } from "lucide-react";

const signupSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .superRefine(
        fieldConfig({
          label: "Create Password",
          fieldType: "password-input",
          inputProps: {
            placeholder: "Create a secure password",
            beforeInput: <Shield className="h-4 w-4" />,
          },
        })
      ),
    confirmPassword: z
      .string()
      .min(8)
      .superRefine(
        fieldConfig({
          label: "Confirm Password",
          fieldType: "password-input",
          inputProps: {
            placeholder: "Confirm your password",
            beforeInput: <Lock className="h-4 w-4" />,
          },
        })
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
```

### Advanced Validation

```tsx
const securePasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number, and special character"
    )
    .superRefine(
      fieldConfig({
        label: "Secure Password",
        fieldType: "password-input",
        inputProps: {
          placeholder: "Create a strong password",
        },
      })
    ),
});
```

## Props

The component accepts all standard input props plus:

| Prop          | Type        | Default               | Description                                           |
| ------------- | ----------- | --------------------- | ----------------------------------------------------- |
| `beforeInput` | `ReactNode` | `<Lock />`            | Icon or element shown before input                    |
| `afterInput`  | `ReactNode` | -                     | Icon or element shown after input (before eye button) |
| `placeholder` | `string`    | "Enter your password" | Input placeholder text                                |
| `disabled`    | `boolean`   | `false`               | Whether the input is disabled                         |
| `error`       | `string`    | -                     | Error message to display                              |

## Integration with AutoForm

The password input component is automatically registered with AutoForm and can be used by setting the `fieldType` to `"password-input"` in your Zod schema using `fieldConfig()`.

```tsx
import { AutoForm } from "@/components/ui/autoform";

// The component is automatically available as "password-input"
<AutoForm
  schema={yourSchema}
  formComponents={{
    "password-input": PasswordInputField, // Already registered by default
  }}
/>;
```

## Styling

The component uses Tailwind CSS classes and follows the design system established by other form components. It automatically handles:

- Error states (red border when error exists)
- Focus states
- Disabled states
- Hover effects on the toggle button

## Accessibility

- Proper ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- Screen reader announcements for password visibility state

## Examples

See `password-input-examples.tsx` for complete working examples including login forms, signup forms, and password change forms.
