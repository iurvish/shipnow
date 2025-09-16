# User Names Management Guide

## Overview

This implementation ensures user names (first_name, last_name) are synchronized between:

1. **`public.users` table** - Your application's user profile data
2. **`auth.users` table** - Supabase Auth's user metadata

## What Gets Updated

### During Onboarding

When a user completes the onboarding process, the system updates:

**In `public.users` table:**

- `first_name`
- `last_name`
- `username`
- `email`
- `avatar_url`
- `bio`
- `onboarded = true`
- `updated_at`

**In `auth.users` metadata:**

- `first_name`
- `last_name`
- `full_name` (concatenated first + last name)
- `username`
- `onboarded = true`

## Why Update Both Tables?

### `public.users` Table

- **Primary data storage** for your application
- **Relational queries** with other tables
- **Custom fields** like bio, avatar_url, etc.
- **Full control** over data structure

### `auth.users` Metadata

- **JWT token data** - accessible client-side
- **Quick access** without database queries
- **Supabase Auth integration** features
- **Third-party auth provider** compatibility

## Usage Examples

### In Server Actions

```typescript
import { updateUserNames } from "@/lib/user-names";

// Update current user's names
const result = await updateUserNames("John", "Doe");

if (result.success) {
  console.log("Names updated successfully");
} else {
  console.error("Error:", result.error);
}
```

### Getting User Names

```typescript
import { getUserNames } from "@/lib/user-names";

const result = await getUserNames();

if (result.success) {
  console.log("First name:", result.data?.first_name);
  console.log("Last name:", result.data?.last_name);
  console.log("Full name:", result.data?.full_name);
}
```

### Client-Side Access (from JWT)

```typescript
import { createClient } from "@/lib/client";

const supabase = createClient();
const {
  data: { user },
} = await supabase.auth.getUser();

// Access from user metadata (updated during onboarding)
const firstName = user?.user_metadata?.first_name;
const lastName = user?.user_metadata?.last_name;
const fullName = user?.user_metadata?.full_name;
```

## Benefits of This Approach

### ✅ **Consistency**

- Both tables always have the same name data
- No sync issues between auth and profile data

### ✅ **Performance**

- Names available in JWT without database queries
- Faster client-side access to user names

### ✅ **Flexibility**

- Can use either data source depending on needs
- Fallback options if one source fails

### ✅ **Auth Provider Compatibility**

- Works with Google, GitHub, etc. auth providers
- Standardized metadata structure

## Error Handling

The implementation includes comprehensive error handling:

- **Non-critical failures**: Auth metadata updates won't break onboarding
- **Detailed logging**: All operations logged for debugging
- **Graceful degradation**: App continues working if metadata fails
- **Clear error messages**: User-friendly error responses

## Database Schema Requirements

Ensure your `public.users` table has these columns:

```sql
CREATE TABLE public.users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name varchar(100),
  last_name varchar(100),
  username text,
  email text,
  avatar_url text,
  bio text,
  onboarded boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

## Testing Checklist

### ✅ **Onboarding Flow**

- [ ] Complete onboarding form
- [ ] Verify names in `public.users` table
- [ ] Check `auth.users` metadata via Supabase dashboard
- [ ] Confirm JWT token contains name metadata

### ✅ **Name Updates**

- [ ] Update names using utility function
- [ ] Verify both tables updated
- [ ] Check client-side access to new names

### ✅ **Error Scenarios**

- [ ] Test with network issues
- [ ] Verify graceful failure handling
- [ ] Check error message clarity

This implementation provides a robust foundation for user name management across your entire application! 🚀
