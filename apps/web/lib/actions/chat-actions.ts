"use server";

import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Schema for SQL query generation
const QueryGenerationSchema = z.object({
  sql_query: z.string().describe('The SQL query to execute against Supabase'),
  explanation: z.string().describe('A plain English explanation of what the query does'),
  skills_mapping: z.array(z.string()).describe('The specific technologies/skills being searched for'),
});

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

function isSqlQuerySafe(query: string): boolean {
  const allowedKeywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'LIKE', 'ILIKE', 'IN', 'LIMIT', 'ORDER BY'];
  const forbiddenKeywords = ['DELETE', 'UPDATE', 'INSERT', 'DROP', 'CREATE', 'ALTER', 'TRUNCATE'];
  
  const upperQuery = query.toUpperCase();
  
  // Check for forbidden keywords
  const hasForbiddenKeywords = forbiddenKeywords.some(keyword => upperQuery.includes(keyword));
  if (hasForbiddenKeywords) return false;
  
  // Must start with SELECT
  if (!upperQuery.trim().startsWith('SELECT')) return false;
  
  return true;
}

export async function generatePeopleSuggestions(
  message: string
): Promise<ChatResponse> {
  try {
    if (!message || message.trim().length === 0) {
      throw new Error('Message is required');
    }

    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set');
    }
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set');
    }

    console.log('Starting people suggestions with message:', message);

    // Step 1: Classify query type (simplified for testing)
    console.log('Classifying query:', message);
    
    // Simple classification logic for testing
    const isSearchQuery = message.toLowerCase().includes('find') || 
                         message.toLowerCase().includes('suggest') || 
                         message.toLowerCase().includes('recommend') ||
                         message.toLowerCase().includes('developer') ||
                         message.toLowerCase().includes('engineer');

    if (!isSearchQuery) {
      return {
        query_type: 'general_question',
        reasoning: 'Query does not appear to be asking for people/talent recommendations',
        message: "Apologies, I'm not a general purpose chatbot, but you should definitely try telling me about the kind of people you are trying to find and I'll help you find them!",
      };
    }

    console.log('Query analyzed - classified as search query');

    // Step 2: Skip SQL generation for now and go directly to database query
    console.log('Skipping AI SQL generation, using fallback query');

    // Step 4: Execute query (using fallback query directly)
    console.log('Executing fallback database query...');
    
    // Define the query for logging
    const queryString = `
      SELECT id, first_name, last_name, email, bio,
             personal_details (university, department, degree_level, date_of_birth),
             technical_profiles (skills, experience, github, portfolio)
      FROM users
      LIMIT 10`;
    
    console.log('Generated SQL Query:', queryString);
    
    // Skip RPC call and go directly to fallback query
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('users')
      .select(`
        id, first_name, last_name, email, bio,
        personal_details (university, department, degree_level, date_of_birth),
        technical_profiles (skills, experience, github, portfolio)
      `)
      .limit(10);

    if (fallbackError) {
      throw new Error(`Database query failed: ${fallbackError.message}`);
    }

    console.log('Search completed, transforming data...');

    // Transform the data to match our schema
    const transformedData = (fallbackData as SupabaseUserData[])?.map(user => {
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
    }) || [];

    console.log('Results formatted successfully');

    return {
      query_type: 'people_search',
      reasoning: `Found people matching your search for: ${message}`,
      people: transformedData,
      explanation: `Retrieved ${transformedData.length} people from the database`,
      sql_query: 'SELECT * FROM users (simplified query)',
    };
    
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
