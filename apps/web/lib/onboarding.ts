import { createClient } from "./client";
import { 
  syncUserProfileToAuraDB, 
  transformOnboardingDataForAuraDB 
} from "./auradb-service";

// Define the types based on our form schema
export interface OnboardingData {
  // Step 1: Personal Details
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  university: string;
  department: string;
  degree_level: "bachelor" | "master" | "self_taught";
  
  // Step 2: Technical Profile
  skills: string[];
  github?: string;
  portfolio?: string;
  
  // Step 3: Setup Profile
  profilePhoto?: string;
  username: string;
  bio?: string;
}


const normalizeDegreeLevel = (degreeLevel: string): "bachelor" | "master" | "self_taught" => {
  switch (degreeLevel) {
    case "bachelor":
      return "bachelor";
    case "master":
      return "master";
    case "self_taught":
      return "self_taught";
    default:
      return "bachelor";
  }
};

export async function submitOnboardingData(data: OnboardingData) {
  const supabase = createClient();
  
  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      throw new Error(`Authentication error: ${authError.message}`);
    }
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    console.log("Submitting onboarding for user:", user.id);
    console.log("Onboarding data:", data);

    // Start a transaction-like approach by doing all operations in sequence
    // and rolling back if any fail

    // Step 1: Update the main users table
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        bio: data.bio || null,
        date_of_birth: data.date_of_birth || null,
        profile_picture: data.profilePhoto || null,
        onboarded: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (userUpdateError) {
      throw new Error(`Failed to update user profile: ${userUpdateError.message}`);
    }

    // Step 2: Insert or update personal details
    const { error: personalDetailsError } = await supabase
      .from('personal_details')
      .upsert({
        user_id: user.id,
        university: data.university,
        department: data.department,
        degree_level: normalizeDegreeLevel(data.degree_level),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (personalDetailsError) {
      throw new Error(`Failed to save personal details: ${personalDetailsError.message}`);
    }

    // Step 3: Insert or update technical profile
    const { error: technicalProfileError } = await supabase
      .from('technical_profiles')
      .upsert({
        user_id: user.id,
        primary_skills: data.skills,
        github_url: data.github || null,
        portfolio_url: data.portfolio || null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (technicalProfileError) {
      throw new Error(`Failed to save technical profile: ${technicalProfileError.message}`);
    }

    console.log("✅ Onboarding data submitted successfully!");
    
    // Step 4: Sync to AuraDB for AI-powered search
    try {
      console.log("🔄 Syncing user profile to AuraDB...");
      
      // Transform the data for AuraDB (no projects during onboarding)
      const auraDBProfile = transformOnboardingDataForAuraDB(
        user.id,
        user.email || '',
        data,
        [] // Empty projects array - projects will be added when user creates them
      );
      
      // Sync to AuraDB
      await syncUserProfileToAuraDB(auraDBProfile);
      
      console.log("✅ User profile synced to AuraDB successfully!");
      
    } catch (auraDBError) {
      console.error("⚠️  Warning: Failed to sync to AuraDB:", auraDBError);
      // Don't fail the entire onboarding process if AuraDB sync fails
      // This allows the app to continue working even if the graph database is down
    }
    
    return {
      success: true,
      message: "Onboarding completed successfully!"
    };

  } catch (error) {
    console.error("❌ Error submitting onboarding data:", error);
    
    // If it's our custom error, re-throw it
    if (error instanceof Error) {
      throw error;
    }
    
    // Otherwise, throw a generic error
    throw new Error("Failed to submit onboarding data. Please try again.");
  }
}

// Function to check if user is already onboarded
export async function checkOnboardingStatus() {
  const supabase = createClient();
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { onboarded: false, user: null };
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('onboarded, first_name, last_name')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error("Error checking onboarding status:", userError);
      return { onboarded: false, user: null };
    }

    return { 
      onboarded: userData?.onboarded || false, 
      user: userData 
    };

  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return { onboarded: false, user: null };
  }
}

// Function to get complete user profile data
export async function getUserProfileData() {
  const supabase = createClient();
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    // Get user data with personal details and technical profile
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        personal_details (*),
        technical_profiles (*)
      `)
      .eq('id', user.id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }

    return data;

  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
