// Comprehensive Cypher query for integrating user profile data into AuraDB
// This query is idempotent and handles nested project data structure

export const SYNC_USER_PROFILE_CYPHER = `
WITH $userProfile as data
// Step 1: MERGE User node with all core properties
MERGE (u:User {userId: data.userId})
SET u.name = data.name,
    u.email = data.email,
    u.avatarUrl = data.avatarUrl,
    u.githubUrl = data.githubUrl,
    u.portfolioUrl = data.portfolioUrl,
    u.linkedinUrl = data.linkedinUrl,
    u.dateOfBirth = data.dateOfBirth,
    u.birthYear = CASE 
      WHEN data.dateOfBirth IS NOT NULL 
      THEN toInteger(substring(data.dateOfBirth, 0, 4))
      ELSE NULL 
    END,
    u.bio = data.bio,
    u.username = data.username,
    u.degreeLevel = data.degreeLevel,
    u.updatedAt = datetime()

// Step 2: Handle Skills (UNWIND the skills array)
WITH u, data
UNWIND CASE WHEN data.skills IS NOT NULL AND size(data.skills) > 0 
            THEN data.skills 
            ELSE [null] END AS skillName
WITH u, data, skillName
WHERE skillName IS NOT NULL
MERGE (s:Skill {name: skillName})
MERGE (u)-[:HAS_SKILL]->(s)

// Step 3: Handle University and Department
WITH u, data
WHERE data.university IS NOT NULL
MERGE (uni:University {name: data.university})
MERGE (u)-[:STUDIED_AT]->(uni)

WITH u, data, uni
WHERE data.department IS NOT NULL
MERGE (dept:Department {name: data.department})
MERGE (u)-[:IN_DEPARTMENT]->(dept)
MERGE (dept)-[:DEPARTMENT_OF]->(uni)

// Step 4: Handle Projects (Main UNWIND for projects array)
WITH u, data
UNWIND CASE WHEN data.projects IS NOT NULL AND size(data.projects) > 0 
            THEN data.projects 
            ELSE [null] END AS project
WITH u, data, project
WHERE project IS NOT NULL

// Step 4a: MERGE Project node (unique per user + project name)
MERGE (p:Project {name: project.project_name, userId: data.userId})
SET p.summary = project.case_summary,
    p.liveSiteUrl = project.live_site_url,
    p.githubLink = project.github_link,
    p.videoUrl = project.video_url,
    p.buildJourney = project.build_journey,
    p.results = project.results,
    p.projectImage = project.project_image,
    p.createdAt = project.created_at,
    p.updatedAt = datetime()

// Step 4b: MERGE User-Project relationship
MERGE (u)-[:BUILT]->(p)

// Step 4c: Handle Project Tags (nested UNWIND)
WITH u, data, project, p
UNWIND CASE WHEN project.tags IS NOT NULL AND size(project.tags) > 0 
            THEN project.tags 
            ELSE [null] END AS tagName
WITH u, data, project, p, tagName
WHERE tagName IS NOT NULL
MERGE (t:Tag {name: tagName})
MERGE (p)-[:HAS_TAG]->(t)

// Step 4d: Handle Project Features (nested UNWIND)
WITH u, data, project, p
UNWIND CASE WHEN project.key_features IS NOT NULL AND size(project.key_features) > 0 
            THEN project.key_features 
            ELSE [null] END AS featureName
WITH u, data, project, p, featureName
WHERE featureName IS NOT NULL
MERGE (f:Feature {name: featureName})
MERGE (p)-[:HAS_FEATURE]->(f)

// Return summary of what was created/updated
WITH u, data
RETURN u.userId as userId, 
       u.name as name,
       "Profile synced successfully" as status
`;

// Cypher query for syncing individual project (for project CRUD operations)
export const SYNC_PROJECT_CYPHER = `
WITH $projectData as data, $userId as userId

// Find the user
MATCH (u:User {userId: userId})

// MERGE the project
MERGE (p:Project {name: data.project_name, userId: userId})
SET p.summary = data.case_summary,
    p.liveSiteUrl = data.live_site_url,
    p.githubLink = data.github_link,
    p.videoUrl = data.video_url,
    p.buildJourney = data.build_journey,
    p.results = data.results,
    p.projectImage = data.project_image,
    p.updatedAt = datetime()

// MERGE User-Project relationship
MERGE (u)-[:BUILT]->(p)

// Remove existing tags and features relationships for this project
WITH u, p, data
OPTIONAL MATCH (p)-[r:HAS_TAG]->(:Tag)
DELETE r
WITH u, p, data
OPTIONAL MATCH (p)-[r:HAS_FEATURE]->(:Feature)
DELETE r

// Add new tags
WITH u, p, data
UNWIND CASE WHEN data.tags IS NOT NULL AND size(data.tags) > 0 
            THEN data.tags 
            ELSE [null] END AS tagName
WITH u, p, data, tagName
WHERE tagName IS NOT NULL
MERGE (t:Tag {name: tagName})
MERGE (p)-[:HAS_TAG]->(t)

// Add new features
WITH u, p, data
UNWIND CASE WHEN data.key_features IS NOT NULL AND size(data.key_features) > 0 
            THEN data.key_features 
            ELSE [null] END AS featureName
WITH u, p, data, featureName
WHERE featureName IS NOT NULL
MERGE (f:Feature {name: featureName})
MERGE (p)-[:HAS_FEATURE]->(f)

RETURN p.name as projectName, "Project synced successfully" as status
`;

// Cypher query for deleting a project
export const DELETE_PROJECT_CYPHER = `
WITH $projectName as projectName, $userId as userId

MATCH (u:User {userId: userId})-[:BUILT]->(p:Project {name: projectName, userId: userId})

// Remove all relationships
OPTIONAL MATCH (p)-[r:HAS_TAG]->(:Tag)
DELETE r
WITH u, p
OPTIONAL MATCH (p)-[r:HAS_FEATURE]->(:Feature)
DELETE r
WITH u, p
OPTIONAL MATCH (u)-[r:BUILT]->(p)
DELETE r

// Delete the project node
DELETE p

RETURN "Project deleted successfully" as status
`;

// Query to check user-skill relationships (for debugging)
export const CHECK_USER_SKILLS_CYPHER = `
MATCH (u:User {userId: $userId})
OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
RETURN u.userId as userId, 
       u.name as userName,
       collect(s.name) as skills,
       count(s) as skillCount
`;