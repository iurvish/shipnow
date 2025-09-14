"use server";

import { createClient } from "@/lib/server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { 
  syncUserProfileToAuraDB, 
  transformOnboardingDataForAuraDB,
  checkUserSkillsInAuraDB 
} from "@/lib/auradb-service";
import { validateSkills } from "@/lib/config/skills";

// Define the complete onboarding schema
const onboardingSchema = z.object({
  // Personal Details
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  date_of_birth: z.string().optional(),
  university: z.string().min(2, "University is required"),
  institute: z.string().min(1, "Institute is required"),
  department: z.string().min(1, "Department is required"),
  degree_level: z.enum(["Bachelor", "Master", "Self_taught", "Diploma", "Other"]),
  
  // Technical Profile
  skills: z
    .array(z.string())
    .min(1, "At least one skill is required")
    .refine(
      (skills) => validateSkills(skills),
      { message: "Invalid skill selected" }
    ),
  github: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return undefined;
      
      // Clean the input: remove existing protocol and www prefix if present
      let cleanVal = val.trim();
      cleanVal = cleanVal.replace(/^https?:\/\//, ''); // Remove http:// or https://
      cleanVal = cleanVal.replace(/^www\./, ''); // Remove www.
      
      // Add https:// prefix for storage
      return `https://${cleanVal}`;
    })
    .refine(
      (val) => {
        if (!val) return true; // Optional field
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Please enter a valid URL (e.g., github.com/username)",
      }
    ),
  portfolio: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return undefined;
      
      // Clean the input: remove existing protocol and www prefix if present
      let cleanVal = val.trim();
      cleanVal = cleanVal.replace(/^https?:\/\//, ''); // Remove http:// or https://
      cleanVal = cleanVal.replace(/^www\./, ''); // Remove www.
      
      // Add https:// prefix for storage
      return `https://${cleanVal}`;
    })
    .refine(
      (val) => {
        if (!val) return true; // Optional field
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Please enter a valid URL (e.g., portfolio.com)",
      }
    ),
  
  linkedin: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return undefined;
      
      // Clean the input: remove existing protocol and www prefix if present
      let cleanVal = val.trim();
      cleanVal = cleanVal.replace(/^https?:\/\//, ''); // Remove http:// or https://
      cleanVal = cleanVal.replace(/^www\./, ''); // Remove www.
      
      // Add https:// prefix for storage
      return `https://${cleanVal}`;
    })
    .refine(
      (val) => {
        if (!val) return true; // Optional field
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Please enter a valid LinkedIn URL (e.g., linkedin.com/in/username)",
      }
    ),
  
  // Setup Profile
  profilePhoto: z.string().url().optional().or(z.literal("")),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(200, "Bio must be at most 200 characters").optional(),
});



export type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface ActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function submitOnboardingForm(formData: OnboardingFormData): Promise<ActionResult> {
  try {
    // Create Supabase client
    const supabase = await createClient();

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }

    // Validate the form data
    const validationResult = onboardingSchema.safeParse(formData);
    
    if (!validationResult.success) {
      return {
        success: false,
        error: "Invalid form data: " + validationResult.error.issues.map(issue => issue.message).join(", ")
      };
    }

    const validatedData = validationResult.data;

    // Start a transaction by using the database client
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id, username')
      .eq('id', user.id)
      .single();

    if (userCheckError && userCheckError.code !== 'PGRST116') { // PGRST116 is "not found"
      return {
        success: false,
        error: "Error checking user: " + userCheckError.message
      };
    }

    // Check if username is already taken (excluding current user)
    if (validatedData.username) {
      const { data: usernameCheck, error: usernameError } = await supabase
        .from('users')
        .select('id')
        .eq('username', validatedData.username)
        .neq('id', user.id)
        .maybeSingle();

      if (usernameError) {
        return {
          success: false,
          error: "Error checking username availability: " + usernameError.message
        };
      }

      if (usernameCheck) {
        return {
          success: false,
          error: "Username is already taken"
        };
      }
    }

    // Update or insert user record (including bio from setup profile step)
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        username: validatedData.username,
        email: user.email,
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        avatar_url: validatedData.profilePhoto || null,
        bio: validatedData.bio || null, // Bio goes in users table, not technical_profiles
        onboarded: true,
        updated_at: new Date().toISOString()
      });

    if (userError) {
      return {
        success: false,
        error: "Error updating user: " + userError.message
      };
    }

    // Insert or update personal details (no first_name/last_name here anymore)
    const { error: personalError } = await supabase
      .from('personal_details')
      .upsert({
        user_id: user.id,
        date_of_birth: validatedData.date_of_birth || null,
        university: validatedData.university,
        institute: validatedData.institute,
        department: validatedData.department,
        degree_level: validatedData.degree_level,
        updated_at: new Date().toISOString()
      });

    if (personalError) {
      return {
        success: false,
        error: "Error saving personal details: " + personalError.message
      };
    }

    // Insert or update technical profile (bio removed, it's now in users table)
    const { error: technicalError } = await supabase
      .from('technical_profiles')
      .upsert({
        user_id: user.id,
        skills: validatedData.skills,
        github: validatedData.github || null,
        portfolio: validatedData.portfolio || null,
        linkedin: validatedData.linkedin || null,
        updated_at: new Date().toISOString()
      });

    if (technicalError) {
      return {
        success: false,
        error: "Error saving technical profile: " + technicalError.message
      };
    }

    // Revalidate relevant paths
    revalidatePath('/onboarding');
    revalidatePath('/chat');
    revalidatePath('/');

    // Step 4: Sync to AuraDB for AI-powered search
    try {
      console.log("🔄 Syncing user profile to AuraDB...");
      
      // Transform the data for AuraDB (no projects during onboarding)
      const auraDBProfile = transformOnboardingDataForAuraDB(
        user.id,
        user.email || '',
        {
          first_name: validatedData.first_name,
          last_name: validatedData.last_name,
          date_of_birth: validatedData.date_of_birth,
          university: validatedData.university,
          institute: validatedData.institute,
          department: validatedData.department,
          degree_level: validatedData.degree_level,
          skills: validatedData.skills,
          github: validatedData.github,
          portfolio: validatedData.portfolio,
          linkedin: validatedData.linkedin,
          profilePhoto: validatedData.profilePhoto,
          username: validatedData.username,
          bio: validatedData.bio,
        },
        [] // Empty projects array - projects will be added when user creates them
      );
      
      // Sync to AuraDB
      await syncUserProfileToAuraDB(auraDBProfile);
      
      console.log("✅ User profile synced to AuraDB successfully!");
      
      // Debug: Check what was actually created in AuraDB
      setTimeout(async () => {
        try {
          await checkUserSkillsInAuraDB(user.id);
        } catch (debugError) {
          console.error("Debug check failed:", debugError);
        }
      }, 1000); // Wait 1 second to allow sync to complete
      
    } catch (auraDBError) {
      console.error("⚠️  Warning: Failed to sync to AuraDB:", auraDBError);
      // Don't fail the entire onboarding process if AuraDB sync fails
      // This allows the app to continue working even if the graph database is down
    }

    return {
      success: true,
      data: {
        user_id: user.id,
        username: validatedData.username
      }
    };

  } catch (error) {
    console.error('Onboarding submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

export async function checkUsernameAvailability(username: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: "User not authenticated"
      };
    }

    // Validate username format
    if (username.length < 3 || username.length > 20) {
      return {
        success: false,
        error: "Username must be between 3 and 20 characters"
      };
    }

    // Check if username exists (excluding current user)
    const { data: existingUser, error } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .neq('id', user.id)
      .maybeSingle();

    if (error) {
      return {
        success: false,
        error: "Error checking username: " + error.message
      };
    }

    return {
      success: true,
      data: {
        available: !existingUser,
        message: existingUser ? "Username is already taken" : "Username is available"
      }
    };

  } catch (error) {
    console.error('Username check error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

export async function getUniversityDepartments(universityValue: string): Promise<ActionResult> {
  try {
    // Simulate API call delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Common departments for most universities
    const commonDepartments = [
      { value: "computer-science", label: "Computer Science" },
      { value: "engineering", label: "Engineering" },
      { value: "business", label: "Business Administration" },
      { value: "mathematics", label: "Mathematics" },
      { value: "physics", label: "Physics" },
      { value: "chemistry", label: "Chemistry" },
      { value: "biology", label: "Biology" },
      { value: "psychology", label: "Psychology" },
      { value: "economics", label: "Economics" },
      { value: "english", label: "English Literature" },
      { value: "history", label: "History" },
      { value: "political-science", label: "Political Science" },
      { value: "art", label: "Art & Design" },
      { value: "music", label: "Music" },
      { value: "philosophy", label: "Philosophy" },
      { value: "sociology", label: "Sociology" },
      { value: "anthropology", label: "Anthropology" },
      { value: "environmental-science", label: "Environmental Science" },
      { value: "medicine", label: "Medicine" },
      { value: "law", label: "Law" },
    ];

    // Special departments for tech-focused universities
    const techDepartments = [
      { value: "computer-science", label: "Computer Science" },
      { value: "software-engineering", label: "Software Engineering" },
      { value: "electrical-engineering", label: "Electrical Engineering" },
      { value: "mechanical-engineering", label: "Mechanical Engineering" },
      { value: "civil-engineering", label: "Civil Engineering" },
      { value: "aerospace-engineering", label: "Aerospace Engineering" },
      { value: "biomedical-engineering", label: "Biomedical Engineering" },
      { value: "chemical-engineering", label: "Chemical Engineering" },
      { value: "data-science", label: "Data Science" },
      { value: "artificial-intelligence", label: "Artificial Intelligence" },
      { value: "cybersecurity", label: "Cybersecurity" },
      { value: "robotics", label: "Robotics" },
      { value: "information-systems", label: "Information Systems" },
      { value: "mathematics", label: "Mathematics" },
      { value: "physics", label: "Physics" },
      { value: "statistics", label: "Statistics" },
    ];

    // Return departments based on university
    let departments;
    switch (universityValue) {
      case "mit":
      case "caltech":
      case "stanford":
      case "carnegie-mellon":
        departments = techDepartments;
        break;
      case "other":
        departments = [
          ...commonDepartments,
          { value: "other", label: "Other (Please specify)" },
        ];
        break;
      default:
        departments = commonDepartments;
    }

    return {
      success: true,
      data: departments
    };

  } catch (error) {
    console.error('Department fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}
