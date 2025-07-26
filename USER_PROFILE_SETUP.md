# User Profile Schema Setup

This project now includes a comprehensive user profile schema designed for a recommendation system, integrated with Supabase Auth.

## 📋 What's Included

### Database Schema

- **`user_profiles`** - Basic user information (auto-created on signup)
- **`personal_details`** - University, education, and personal info
- **`technical_profiles`** - Skills, experience, interests, and portfolio links
- **`complete_user_profiles`** - View combining all profile data

### TypeScript Types

- Complete type definitions in `apps/web/lib/user-profile-types.ts`
- Interfaces for all tables and API operations
- Types for recommendation system data

## 🚀 Getting Started

### 1. Run the Migration

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the content from `manual_migration.sql`
4. Run the migration

### 2. Key Features

- **Auto Profile Creation**: When users sign up through Supabase Auth, a basic profile is automatically created
- **Row Level Security**: Users can only access their own profile data
- **Flexible Schema**: All profile fields are optional, allowing users to complete their profiles gradually
- **Recommendation Ready**: Schema designed to support user matching and recommendations

### 3. Database Tables

#### `user_profiles` (Primary table)

```sql
id UUID (references auth.users)
image TEXT
first_name TEXT
last_name TEXT
email TEXT
username TEXT
bio TEXT
date_of_birth DATE
profile_picture_url TEXT
onboarded BOOLEAN (default: false)
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### `personal_details` (Education & Personal Info)

```sql
id UUID (primary key)
user_id UUID (references user_profiles)
university TEXT
department TEXT
degree_level ENUM ('associate', 'bachelor', 'master', 'doctorate', 'bootcamp', 'self_taught')
phone TEXT
profile_picture TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### `technical_profiles` (Skills & Experience)

```sql
id UUID (primary key)
user_id UUID (references user_profiles)
primary_skills TEXT[]
experience_level ENUM ('beginner', 'intermediate', 'advanced', 'expert')
interests TEXT[]
preferred_roles TEXT[]
github_url TEXT
linkedin_url TEXT
portfolio_url TEXT
tools_proficiency TEXT[]
created_at TIMESTAMP
updated_at TIMESTAMP
```

## 🔧 Usage in Your App

### Accessing User Profile Data

```typescript
import { createClient } from "./lib/supabase";
import { CompleteUserProfile } from "./lib/user-profile-types";

// Get complete user profile
const { data: profile } = await supabase
  .from("complete_user_profiles")
  .select("*")
  .eq("id", userId)
  .single();

// Update user profile
const { error } = await supabase
  .from("user_profiles")
  .update({ first_name: "John", last_name: "Doe" })
  .eq("id", userId);
```

### Creating Profile Sections

```typescript
// Add personal details
const { error } = await supabase.from("personal_details").insert({
  user_id: userId,
  university: "MIT",
  department: "Computer Science",
  degree_level: "bachelor",
});

// Add technical profile
const { error } = await supabase.from("technical_profiles").insert({
  user_id: userId,
  primary_skills: ["JavaScript", "React", "Node.js"],
  experience_level: "intermediate",
  interests: ["Web Development", "AI/ML"],
});
```

## 🛡️ Security Features

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own profile data
- Automatic profile creation with error handling
- Safe trigger that won't break auth signup process

## 🔍 Recommendation System Ready

The schema includes all necessary fields for building a recommendation system:

- Skills and experience matching
- Interest-based recommendations
- Education and university connections
- Role and career path matching

Use the `complete_user_profiles` view for recommendation queries, or query individual tables for specific matching algorithms.

## 📁 File Structure

```
manual_migration.sql              # Run this in Supabase SQL Editor
apps/web/lib/user-profile-types.ts  # TypeScript type definitions
USER_PROFILE_SETUP.md            # This documentation
```

## ✅ Next Steps

1. Run the migration in Supabase
2. Test user signup to verify automatic profile creation
3. Build your profile forms using the TypeScript types
4. Implement recommendation algorithms using the profile data
5. Add any additional fields specific to your use case

Your user profile schema is now ready for building a comprehensive recommendation system! 🎉
