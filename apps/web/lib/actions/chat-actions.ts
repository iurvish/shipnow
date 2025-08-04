"use server";

import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
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
  message: string,
  onStatusUpdate?: (status: ToolStatus) => void
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

    // Step 1: Classify query type
    onStatusUpdate?.({ step: 'classify', message: 'Analyzing your query...', completed: false });

    console.log('Calling Google AI for classification...');
    const classification = await generateObject({
      model: google('models/gemini-1.5-flash'),
      schema: z.object({
        is_people_search: z.boolean().describe('Whether this query is asking for people/talent recommendations'),
        reasoning: z.string().describe('Brief explanation of the classification'),
      }),
      prompt: `
        Analyze this user query and determine if they are asking for people, talent, or professional recommendations.
        
        Examples of PEOPLE SEARCH queries:
        - "suggest me react developers"
        - "find me a UX designer"
        - "I need a backend engineer"
        - "recommend some data scientists"
        - "looking for project managers"
        - "find frontend developers"
        - "suggest full stack engineers"
        
        Examples of GENERAL QUESTIONS (not people search):
        - "write a Java function"
        - "how to implement authentication"
        - "delete all users from database"
        - "create a REST API"
        - "what is machine learning"
        - "help me with coding"
        - "explain how to use React"
        
        User query: "${message}"
      `,
    });
    
    console.log('Classification result:', classification.object);

    onStatusUpdate?.({ step: 'classify', message: 'Query analyzed', completed: true });

    if (!classification.object.is_people_search) {
      return {
        query_type: 'general_question',
        reasoning: classification.object.reasoning,
        message: "Apologies, I'm not a general purpose chatbot, but you should definitely try telling me about the kind of people you are trying to find and I'll help you find them!",
      };
    }

    // Step 2: Generate SQL query
    onStatusUpdate?.({ step: 'generate', message: 'Generating database query...', completed: false });

    const queryGeneration = await generateObject({
      model: google('models/gemini-1.5-flash'),
      schema: QueryGenerationSchema,
      prompt: `
        You are an AI assistant that creates SQL queries for Supabase based on natural language.
        
        DATABASE SCHEMA:
        Table: users
        - id (text, primary key)
        - first_name (text)
        - last_name (text)
        - email (text, unique)
        - bio (text, nullable)
        
        Table: personal_details
        - id (text, primary key)
        - user_id (text, foreign key to users.id)
        - university (text)
        - department (text)
        - degree_level (text) // values: 'UNDERGRADUATE', 'GRADUATE', 'PHD'
        - date_of_birth (date, nullable)
        
        Table: technical_profiles
        - id (text, primary key)
        - user_id (text, foreign key to users.id)
        - skills (text[]) // array of skills
        - experience (text) // values: 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'SENIOR'
        - github (text, nullable)
        - portfolio (text, nullable)
        
        TECHNOLOGY MAPPINGS:
        - For "web development" or "web developers", search for: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Angular", "Vue", "Next.js", "Node.js"]
        - For "mobile development", search for: ["React Native", "Flutter", "Swift", "Kotlin", "Android", "iOS"]
        - For "data science", search for: ["Python", "R", "SQL", "TensorFlow", "PyTorch", "Pandas", "NumPy"]
        - For "cloud", search for: ["AWS", "Azure", "GCP", "Docker", "Kubernetes"]
        - For "backend", search for: ["Node.js", "Java", "Python", "C#", "Go", "Ruby", "PHP", "Express"]
        - For "frontend", search for: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Angular", "Vue"]
        
        Your task is to create a query that:
        1. Maps general categories to specific technologies
        2. Uses ILIKE for case-insensitive searching with ANY() for arrays
        3. Always searches for specific technologies, not generic terms
        4. Limit results to 10 users
        5. Include JOINs to get personal_details and technical_profiles
        
        For experience levels:
        - "experienced" or "with experience" should filter for 'INTERMEDIATE' or 'ADVANCED'
        - "beginners" should filter for 'BEGINNER'
        
        Example query structure:
        SELECT 
          u.id, u.first_name, u.last_name, u.email, u.bio,
          row_to_json(pd.*) as personal_details,
          row_to_json(tp.*) as technical_profile
        FROM users u
        LEFT JOIN personal_details pd ON u.id = pd.user_id
        LEFT JOIN technical_profiles tp ON u.id = tp.user_id
        WHERE tp.skills && ARRAY['React', 'JavaScript', 'TypeScript']
        AND tp.experience IN ('INTERMEDIATE', 'ADVANCED')
        LIMIT 10;
        
        User query: "${message}"
      `,
    });

    onStatusUpdate?.({ step: 'generate', message: 'Database query generated', completed: true });

    // Step 3: Validate SQL query
    onStatusUpdate?.({ step: 'validate', message: 'Validating query safety...', completed: false });

    const sqlQuery = queryGeneration.object.sql_query;
    
    if (!isSqlQuerySafe(sqlQuery)) {
      throw new Error('Generated query contains unsafe operations');
    }

    onStatusUpdate?.({ step: 'validate', message: 'Query validated', completed: true });

    // Step 4: Execute query
    onStatusUpdate?.({ step: 'search', message: 'Searching database...', completed: false });

    const { data, error } = await supabase.rpc('execute_sql', { 
      query: sqlQuery 
    });

    if (error) {
      console.error('Supabase query error:', error);
      // If RPC doesn't work, try direct query (this is a simplified example)
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

      onStatusUpdate?.({ step: 'search', message: 'Search completed', completed: true });

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

      return {
        query_type: 'people_search',
        reasoning: queryGeneration.object.explanation,
        people: transformedData,
        explanation: queryGeneration.object.explanation,
        sql_query: sqlQuery,
      };
    }

    onStatusUpdate?.({ step: 'search', message: 'Search completed', completed: true });

    // Step 5: Format results
    onStatusUpdate?.({ step: 'format', message: 'Formatting results...', completed: false });

    const formattedResults = Array.isArray(data) ? data : [];

    onStatusUpdate?.({ step: 'format', message: 'Results formatted', completed: true });

    return {
      query_type: 'people_search',
      reasoning: queryGeneration.object.explanation,
      people: formattedResults,
      explanation: queryGeneration.object.explanation,
      sql_query: sqlQuery,
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
