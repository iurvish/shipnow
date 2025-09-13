"use server";

import { generateObject, streamText } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/server";
import { getAuraDBDriver } from "@/lib/auradb-client";
import { google } from "@ai-sdk/google";
import { SKILLS } from "@/lib/config/skills";

// Schema for the search_people tool parameters
const SearchPeopleToolSchema = z.object({
  skills: z.array(z.string()).optional().describe("Technical skills to search for"),
  university: z.string().optional().describe("University name or 'CURRENT_USER_UNIVERSITY'"),
  department: z.string().optional().describe("Department name or 'CURRENT_USER_DEPARTMENT'"), 
  projectTags: z.array(z.string()).optional().describe("Project tags to match"),
  age_greater_than: z.number().optional().describe("Minimum age filter"),
  has_portfolio: z.boolean().optional().describe("Must have portfolio URL"),
  projectName: z.string().optional().describe("Specific project name to search"),
  projectFeature: z.string().optional().describe("Specific project feature to match"),
});

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
    github: z.string().nullable(),
    portfolio: z.string().nullable(),
  }).nullable(),
});

// Schema for chat response
const ChatResponseSchema = z.object({
  query_type: z.enum(['people_search', 'general_question']),
  reasoning: z.string(),
  people: z.array(DatabasePersonSchema).optional(),
  message: z.string().optional(),
  connections: z.array(z.object({
    path: z.string(),
    connection_strength: z.number(),
  })).optional(),
  cypher_query: z.string().optional(),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type DatabasePerson = z.infer<typeof DatabasePersonSchema>;
export type SearchPeopleParams = z.infer<typeof SearchPeopleToolSchema>;

// Define search_people tool for LLM
const searchPeopleTool = {
  name: "search_people",
  description: "Extract structured parameters for people search from natural language queries",
  parameters: {
    type: "object",
    properties: {
      skills: {
        type: "array",
        items: { type: "string" },
        description: "Technical skills to search for"
      },
      university: {
        type: "string", 
        description: "University name or use 'CURRENT_USER_UNIVERSITY' for user's university"
      },
      department: {
        type: "string",
        description: "Department name or use 'CURRENT_USER_DEPARTMENT' for user's department"
      },
      projectTags: {
        type: "array",
        items: { type: "string" },
        description: "Project tags/technologies to match"
      },
      age_greater_than: {
        type: "number",
        description: "Minimum age filter"
      },
      has_portfolio: {
        type: "boolean", 
        description: "Must have portfolio URL"
      },
      projectName: {
        type: "string",
        description: "Specific project name to search for"
      },
      projectFeature: {
        type: "string", 
        description: "Specific project feature to match"
      }
    }
  }
};

// Helper function to get current user context from session and Supabase
async function getCurrentUserContext(userId: string) {
  const supabase = await createClient();
  const { data: userProfile, error } = await supabase
    .from("users")
    .select(`
      id, first_name, last_name, email,
      personal_details!inner(university, department),
      technical_profiles(skills)
    `)
    .eq("id", userId)
    .single();
    
  if (error) {
    console.error("Failed to fetch user context:", error);
    throw new Error("User context fetch failed");
  }
  
  return {
    userId,
    university: Array.isArray(userProfile.personal_details) && userProfile.personal_details[0]?.university || null,
    department: Array.isArray(userProfile.personal_details) && userProfile.personal_details[0]?.department || null,
    skills: userProfile.technical_profiles?.[0]?.skills || []
  };
}

// Helper function to build dynamic Cypher query from search parameters
function buildDynamicCypherQuery(currentUserId: string, params: SearchPeopleParams): string {
  let query = `
    MATCH (currentUser:User {userId: $currentUserId})
    MATCH (targetUser:User)
    WHERE targetUser.userId <> $currentUserId
  `;
  
  const conditions: string[] = [];
  
  // Skills filtering
  if (params.skills && params.skills.length > 0) {
    conditions.push(`
      MATCH (targetUser)-[:HAS_SKILL]->(skill:Skill)
      WHERE skill.name IN $skills
    `);
  }
  
  // University filtering  
  if (params.university) {
    conditions.push(`
      MATCH (targetUser)-[:STUDIED_AT]->(uni:University)
      WHERE uni.name = $university
    `);
  }
  
  // Department filtering
  if (params.department) {
    conditions.push(`
      MATCH (targetUser)-[:IN_DEPARTMENT]->(dept:Department)
      WHERE dept.name = $department
    `);
  }
  
  // Project tags filtering
  if (params.projectTags && params.projectTags.length > 0) {
    conditions.push(`
      MATCH (targetUser)-[:BUILT]->(project:Project)-[:HAS_TAG]->(tag:Tag)
      WHERE tag.name IN $projectTags
    `);
  }
  
  // Project name filtering
  if (params.projectName) {
    conditions.push(`
      MATCH (targetUser)-[:BUILT]->(project:Project)
      WHERE project.name CONTAINS $projectName
    `);
  }
  
  // Project feature filtering
  if (params.projectFeature) {
    conditions.push(`
      MATCH (targetUser)-[:BUILT]->(project:Project)-[:HAS_FEATURE]->(feature:Feature)
      WHERE feature.name CONTAINS $projectFeature
    `);
  }
  
  // Portfolio filtering
  if (params.has_portfolio === true) {
    conditions.push(`
      WHERE targetUser.portfolioUrl IS NOT NULL
    `);
  }
  
  // Age filtering (based on birth year)
  if (params.age_greater_than) {
    const currentYear = new Date().getFullYear();
    const maxBirthYear = currentYear - params.age_greater_than;
    conditions.push(`
      WHERE targetUser.birthYear <= ${maxBirthYear}
    `);
  }
  
  // Add conditions to query
  query += conditions.join(' ');
  
  // Find connection paths and return results (including unconnected users)
  query += `
    WITH targetUser, currentUser
    OPTIONAL MATCH path = shortestPath((currentUser)-[*1..3]-(targetUser))
    RETURN DISTINCT targetUser.userId as userId,
           CASE 
             WHEN path IS NULL THEN 999
             ELSE length(path)
           END as connectionDistance,
           path,
           CASE 
             WHEN EXISTS((currentUser)-[:IN_DEPARTMENT]->()<-[:IN_DEPARTMENT]-(targetUser)) THEN 3
             WHEN EXISTS((currentUser)-[:STUDIED_AT]->()<-[:STUDIED_AT]-(targetUser)) THEN 2
             WHEN path IS NOT NULL THEN 1
             ELSE 0
           END as connectionStrength
    ORDER BY connectionStrength DESC, connectionDistance ASC
    LIMIT 20
  `;
  
  return query;
}

// Helper function to fetch detailed profiles from Supabase
async function fetchDetailedProfiles(userIds: string[]): Promise<DatabasePerson[]> {
  if (userIds.length === 0) return [];
  
  const supabase = await createClient();
  const { data: profiles, error } = await supabase
    .from("users")
    .select(`
      id, first_name, last_name, email, bio,
      personal_details(university, department, degree_level, date_of_birth),
      technical_profiles(skills, github, portfolio)
    `)
    .in("id", userIds);
    
  if (error) {
    console.error("Failed to fetch detailed profiles:", error);
    throw new Error("Profile fetch failed");
  }
  
  // Transform the data to match schema
  return (profiles || []).map((user: any) => {
    const personalDetail = Array.isArray(user.personal_details) && user.personal_details.length > 0 
      ? user.personal_details[0] 
      : user.personal_details || null;
    
    const technicalProfile = Array.isArray(user.technical_profiles) && user.technical_profiles.length > 0 
      ? user.technical_profiles[0] 
      : user.technical_profiles || null;

    return {
      id: String(user.id),
      first_name: user.first_name ? String(user.first_name) : "",
      last_name: user.last_name ? String(user.last_name) : "",
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
        github: technicalProfile.github ? String(technicalProfile.github) : null,
        portfolio: technicalProfile.portfolio ? String(technicalProfile.portfolio) : null,
      } : null,
    };
  });
}

// Main function: AI-powered graph search with LLM tool calling
export async function generatePeopleSuggestions(
  message: string,
  userId: string // Now required - should come from session
): Promise<ChatResponse> {
  try {
    if (!message?.trim() || !userId) {
      throw new Error('Message and userId are required');
    }

    console.log('🚀 Starting AI-powered graph search for user:', userId);
    console.log('📝 Query:', message);

    // Step 1: Retrieve current user context from Supabase
    const userContext = await getCurrentUserContext(userId);
    console.log('👤 User context:', userContext);

    // Step 2: LLM Intent Recognition & Entity Extraction  
    const availableSkills = SKILLS.slice(0, 20).map(s => s.value).join(', ');
    
    const llmResponse = await generateObject({
      model: google("gemini-2.0-flash-001"),
      system: `You are an expert people search assistant. Analyze the user's query and determine if they want to search for people or have a general conversation.
      
      If it's a people search, extract structured parameters. If it's general conversation, provide a helpful response.
      
      AVAILABLE SKILLS IN DATABASE (use exact format):
      ${availableSkills}, and more...
      
      SKILL FORMAT RULES:
      - Use exact proper case: "React" (not "react"), "Next.js" (not "nextjs"), "TypeScript" (not "typescript")
      - For "Representational State Transfer" → use "REST API"
      - For "NoSQL document database" → use "MongoDB"  
      - For "graph database" → use "Neo4j"
      - For "container orchestration" → use "Kubernetes"
      
      Current user context:
      - University: ${userContext.university || 'Unknown'}
      - Department: ${userContext.department || 'Unknown'}
      - Skills: ${userContext.skills.join(', ') || 'None'}
      
      For people searches, extract and EXPAND skills with related technologies:
      - "React developers" → skills: ["React", "Next.js", "JavaScript", "TypeScript"]
      - "Python backend" → skills: ["Python", "Django", "Flask", "FastAPI"]
      - skills: Array of technical skills (use exact database format)
      - university: University name (use "CURRENT_USER_UNIVERSITY" for user's university)
      - department: Department name (use "CURRENT_USER_DEPARTMENT" for user's department)
      - projectTags: Array of project technologies/frameworks
      - age_greater_than: Minimum age as number
      - has_portfolio: Boolean if must have portfolio
      - projectName: String for specific project name
      - projectFeature: String for specific project feature`,
      messages: [
        {
          role: "user", 
          content: message
        }
      ],
      schema: z.object({
        intent: z.enum(['people_search', 'general_conversation']),
        reasoning: z.string(),
        response: z.string().optional(),
        searchParams: z.object({
          skills: z.array(z.string()).optional(),
          university: z.string().optional(),
          department: z.string().optional(), 
          projectTags: z.array(z.string()).optional(),
          age_greater_than: z.number().optional(),
          has_portfolio: z.boolean().optional(),
          projectName: z.string().optional(),
          projectFeature: z.string().optional(),
        }).optional()
      })
    });

    const intent = llmResponse.object;
    console.log('🧠 LLM Intent:', intent);

    // Step 3: Check intent and process search
    if (intent.intent === 'people_search' && intent.searchParams) {
      const searchParams = intent.searchParams;
      console.log('🔍 Search parameters:', searchParams);
      
      // Step 4: Substitute placeholders with actual user context
      const processedParams = { ...searchParams };
      if (processedParams.university === 'CURRENT_USER_UNIVERSITY') {
        processedParams.university = userContext.university;
      }
      if (processedParams.department === 'CURRENT_USER_DEPARTMENT') {
        processedParams.department = userContext.department;  
      }
      
      console.log('🔄 Processed search params:', processedParams);
      
      // Step 5: Build and execute Cypher query on AuraDB
      const cypherQuery = buildDynamicCypherQuery(userId, processedParams);
      console.log('📊 Cypher query:', cypherQuery);
      
      const driver = getAuraDBDriver();
      const session = driver.session();
      
      try {
        const cypherResult = await session.run(cypherQuery, {
          currentUserId: userId,
          skills: processedParams.skills,
          university: processedParams.university,
          department: processedParams.department,
          projectTags: processedParams.projectTags,
          projectName: processedParams.projectName,
          projectFeature: processedParams.projectFeature
        });
        
        const foundUserIds = cypherResult.records.map(record => record.get('userId'));
        const connections = cypherResult.records.map(record => {
          const connectionStrength = record.get('connectionStrength');
          return {
            path: record.get('path')?.toString() || '',
            connection_strength: typeof connectionStrength?.toNumber === 'function' 
              ? connectionStrength.toNumber() 
              : (typeof connectionStrength === 'number' ? connectionStrength : 1)
          };
        });
        
        console.log('📈 Found user IDs:', foundUserIds);
        console.log('🔗 Connections:', connections);
        
        // Step 6: Fetch detailed profiles from Supabase
        const detailedProfiles = await fetchDetailedProfiles(foundUserIds);
        console.log('👥 Detailed profiles count:', detailedProfiles.length);
        
        return {
          query_type: 'people_search',
          reasoning: intent.reasoning,
          people: detailedProfiles,
          connections: connections,
          cypher_query: cypherQuery
        };
        
      } finally {
        await session.close();
      }
      
    } else {
      // Step 7: Handle non-search queries with conversational response
      return {
        query_type: 'general_question',
        reasoning: intent.reasoning,
        message: intent.response || "I'm here to help you find people and connections. Try asking me to find someone with specific skills or from your university!"
      };
    }
    
  } catch (error) {
    console.error('❌ Chat action error:', error);
    
    return {
      query_type: 'general_question',
      reasoning: 'An error occurred while processing your request',
      message: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`
    };
  }
}
