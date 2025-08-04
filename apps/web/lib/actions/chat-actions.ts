"use server";

import { generateObject } from "ai";
import { z } from "zod";
import { createClient } from '@supabase/supabase-js';
import { google } from "@ai-sdk/google";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define the schema for AI generation
const querySchema = z.object({
  supabaseQuery: z
    .string()
    .describe("The Supabase query code to execute against the database"),
  explanation: z
    .string()
    .describe("A plain English explanation of what the query does"),
  skillsMapping: z
    .array(z.string())
    .describe("The specific technologies/skills being searched for"),
});

// Define type for the schema
type QuerySchemaType = z.infer<typeof querySchema>;

// Type for raw Supabase data
type SupabaseUserData = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string | null;
  personal_details: Array<{
    university: string;
    department: string;
    degree_level: string;
    date_of_birth: string | null;
  }>;
  technical_profiles: Array<{
    skills: string[];
    experience: string;
    github: string | null;
    portfolio: string | null;
  }>;
};

// Schema for person from database
const DatabasePersonSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  bio: z.string().nullable(),
  personal_details: z.object({
    university: z.string(),
    department: z.string(),
    degree_level: z.string(),
    date_of_birth: z.string().nullable(),
  }).nullable(),
  technical_profile: z.object({
    skills: z.array(z.string()),
    experience: z.string(),
    github: z.string().nullable(),
    portfolio: z.string().nullable(),
  }).nullable(),
});

// Schema for final response
const ChatResponseSchema = z.object({
  query_type: z.enum(['people_search', 'general_question']).describe('Type of query'),
  reasoning: z.string().describe('Why this query type was chosen'),
  people: z.array(DatabasePersonSchema).optional().describe('List of people from database if query_type is people_search'),
  message: z.string().optional().describe('Response message for general questions'),
  sql_query: z.string().optional().describe('The SQL query that was executed'),
  explanation: z.string().optional().describe('Explanation of the search'),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type DatabasePerson = z.infer<typeof DatabasePersonSchema>;

// Tool calling status type
export type ToolStatus = {
  step: string;
  message: string;
  completed: boolean;
};

function isSupabaseQuerySafe(query: string): boolean {
  // Check for safe Supabase operations only
  const allowedMethods = [
    ".from(",
    ".select(",
    ".eq(",
    ".ilike(",
    ".contains(",
    ".overlaps(",
    ".in(",
    ".limit(",
    ".order(",
  ];

  const hasAllowedMethods = allowedMethods.some(method => query.includes(method));
  
  // Ensure no dangerous operations
  const hasNoDangerousOps = 
    !query.includes(".delete") &&
    !query.includes(".update") &&
    !query.includes(".insert") &&
    !query.includes(".upsert") &&
    !query.includes("DROP") &&
    !query.includes("DELETE") &&
    !query.includes("UPDATE") &&
    !query.includes("INSERT");

  const startsWithSupabase = query.trim().startsWith("supabase");

  return hasAllowedMethods && hasNoDangerousOps && startsWithSupabase;
}

export async function generatePeopleSuggestions(
  message: string
): Promise<ChatResponse> {
  try {
    if (!message || message.trim().length === 0) {
      throw new Error('Message is required');
    }

    console.log('Starting AI-powered people suggestions with message:', message);

    // Generate the Supabase query using AI
    const response = await generateObject({
      model: google("gemini-2.0-flash-001"),
      system: `You are an AI assistant that creates Supabase queries based on natural language.
      
      DATABASE SCHEMA:
      Table: users
      - id (text, primary key)
      - first_name (text)
      - last_name (text)
      - email (text)
      - bio (text)
      - username (text)
      - onboarded (boolean)
      
      Table: personal_details
      - user_id (text, foreign key to users.id)
      - university (text)
      - department (text)
      - degree_level (text) // UNDERGRADUATE, GRADUATE, PHD
      - date_of_birth (date)
      
      Table: technical_profiles
      - user_id (text, foreign key to users.id)
      - skills (text[]) // Array of skills
      - experience (text) // Beginner, Mid-level, Senior
      - github (text)
      - portfolio (text)
      
      IMPORTANT: The database stores skills with specific technology names, not generic categories.
      
      TECHNOLOGY MAPPINGS:
      - For "web development" or "web developers", search for: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Angular", "Vue", "Next.js", "Node.js"]
      - For "mobile development", search for: ["React Native", "Flutter", "Swift", "Kotlin", "Android", "iOS"]
      - For "data science", search for: ["Python", "R", "SQL", "TensorFlow", "PyTorch", "Pandas", "NumPy"]
      - For "cloud", search for: ["AWS", "Azure", "GCP", "Docker", "Kubernetes"]
      - For "backend", search for: ["Node.js", "Java", "Python", "C#", "Go", "Ruby", "PHP", "Express"]
      - For "frontend", search for: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Angular", "Vue"]
      
      Your task is to create a Supabase query that:
      1. Maps general categories to specific technologies
      2. Uses the overlaps operator for array searches
      3. Always searches for specific technologies, not generic terms
      4. Limit results to 10 users
      5. Include joins with personal_details and technical_profiles
      
      For experience levels:
      - "experienced" or "with experience" should filter for "Senior" or "Mid-level"
      - "beginners" should filter for "Beginner"
      
      Return only a valid Supabase JavaScript query like:
      supabase
        .from('users')
        .select(\`
          id, first_name, last_name, email, bio,
          personal_details (university, department, degree_level, date_of_birth),
          technical_profiles (skills, experience, github, portfolio)
        \`)
        .eq('technical_profiles.skills', 'cs.{React,JavaScript,TypeScript}')
        .limit(10)
        
      For skills searches, always use the overlaps operator with an array of technologies.
      If no specific skills are mentioned, return all users.`,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      schema: querySchema,
    });

    // Extract the generated values
    const data = response.object;
    const supabaseQuery = data.supabaseQuery;
    const explanation = data.explanation;
    const skillsMapping = data.skillsMapping;

    console.log("Generated Supabase Query:", supabaseQuery);
    console.log("Explanation:", explanation);
    console.log("Skills Mapping:", skillsMapping);

    // Safety check
    if (!isSupabaseQuerySafe(supabaseQuery)) {
      throw new Error("Generated query contains unsafe operations");
    }

    // Execute the Supabase query safely
    try {
      const queryFunction = new Function("supabase", `return ${supabaseQuery}`);
      const queryResult = await queryFunction(supabase);
      
      console.log('Query execution result:', queryResult);

      const { data: results, error } = queryResult;
      
      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Query execution failed: ${error.message}`);
      }

      console.log('Raw results from database:', results);

      // Transform the data to match our schema
      const transformedData = (results || []).map((user: any) => {
        const personalDetail = Array.isArray(user.personal_details) && user.personal_details.length > 0 
          ? user.personal_details[0] 
          : null;
        const technicalProfile = Array.isArray(user.technical_profiles) && user.technical_profiles.length > 0 
          ? user.technical_profiles[0] 
          : null;

        return {
          id: String(user.id),
          first_name: String(user.first_name),
          last_name: String(user.last_name),
          email: String(user.email),
          bio: user.bio ? String(user.bio) : null,
          personal_details: personalDetail ? {
            university: String(personalDetail.university || ''),
            department: String(personalDetail.department || ''),
            degree_level: String(personalDetail.degree_level || ''),
            date_of_birth: personalDetail.date_of_birth ? String(personalDetail.date_of_birth) : null,
          } : null,
          technical_profile: technicalProfile ? {
            skills: Array.isArray(technicalProfile.skills) 
              ? technicalProfile.skills.map(String)
              : [],
            experience: String(technicalProfile.experience || ''),
            github: technicalProfile.github ? String(technicalProfile.github) : null,
            portfolio: technicalProfile.portfolio ? String(technicalProfile.portfolio) : null,
          } : null,
        };
      });

      console.log('Transformed data:', transformedData);

      return {
        query_type: 'people_search',
        reasoning: `Found people matching your search for: ${message}`,
        people: transformedData,
        explanation: explanation,
        sql_query: supabaseQuery,
      };

    } catch (queryError) {
      console.error("Error executing query:", queryError);
      throw new Error(
        `Failed to execute query: ${queryError instanceof Error ? queryError.message : String(queryError)}`
      );
    }
    
  } catch (error) {
    console.error('Chat action error:', error);
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Return a more informative error response instead of throwing
    return {
      query_type: 'general_question' as const,
      reasoning: 'An error occurred while processing your request',
      message: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or check your environment configuration.`,
    };
  }
}
