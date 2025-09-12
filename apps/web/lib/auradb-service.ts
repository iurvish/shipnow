import { 
  getAuraDBDriver, 
  validateUserProfileData, 
  validateProjectData,
  handleAuraDBError,
  extractRecordValue
} from './auradb-client';
import { 
  SYNC_USER_PROFILE_CYPHER,
  SYNC_PROJECT_CYPHER,
  DELETE_PROJECT_CYPHER,
  CHECK_USER_SKILLS_CYPHER
} from './auradb-queries';
import { OnboardingData } from './onboarding';
import { Project } from './types';

// Interface for user profile data that will be sent to AuraDB
export interface AuraDBUserProfile {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  dateOfBirth?: string | null;
  bio?: string | null;
  username: string;
  degreeLevel: string;
  skills: string[];
  university: string;
  department: string;
  projects: AuraDBProject[];
}

export interface AuraDBProject {
  project_name: string;
  case_summary?: string | null;
  live_site_url?: string | null;
  github_link?: string | null;
  video_url?: string | null;
  build_journey?: string | null;
  results?: string | null;
  project_image?: string | null;
  tags: string[];
  key_features: string[];
  created_at: string;
}

// Transform onboarding data to AuraDB format
export function transformOnboardingDataForAuraDB(
  userId: string,
  email: string,
  onboardingData: OnboardingData,
  projects: Project[] = []
): AuraDBUserProfile {
  const name = `${onboardingData.first_name} ${onboardingData.last_name}`.trim();
  
  const auraDBProjects: AuraDBProject[] = projects.map(project => ({
    project_name: project.project_name,
    case_summary: project.case_summary,
    live_site_url: project.live_site_url,
    github_link: project.github_link,
    video_url: project.video_url,
    build_journey: project.build_journey,
    results: project.results,
    project_image: project.project_image,
    tags: project.tags || [],
    key_features: project.key_features || [],
    created_at: project.created_at
  }));

  return {
    userId,
    name,
    email,
    avatarUrl: onboardingData.profilePhoto || null,
    githubUrl: onboardingData.github || null,
    portfolioUrl: onboardingData.portfolio || null,
    dateOfBirth: onboardingData.date_of_birth || null,
    bio: onboardingData.bio || null,
    username: onboardingData.username,
    degreeLevel: onboardingData.degree_level,
    skills: onboardingData.skills || [],
    university: onboardingData.university,
    department: onboardingData.department,
    projects: auraDBProjects
  };
}

// Transform project data to AuraDB format
export function transformProjectForAuraDB(project: Project): AuraDBProject {
  return {
    project_name: project.project_name,
    case_summary: project.case_summary,
    live_site_url: project.live_site_url,
    github_link: project.github_link,
    video_url: project.video_url,
    build_journey: project.build_journey,
    results: project.results,
    project_image: project.project_image,
    tags: project.tags || [],
    key_features: project.key_features || [],
    created_at: project.created_at
  };
}

// Main function to sync user profile to AuraDB
export async function syncUserProfileToAuraDB(userProfile: AuraDBUserProfile): Promise<void> {
  // Validate the data
  if (!validateUserProfileData(userProfile)) {
    throw new Error('Invalid user profile data');
  }

  console.log('🔄 Syncing user profile to AuraDB for user:', userProfile.userId);
  console.log('📊 User skills being synced:', userProfile.skills);
  console.log('📝 Complete user profile data:', JSON.stringify(userProfile, null, 2));

  const session = getAuraDBDriver().session();
  
  try {
    // Execute the comprehensive Cypher query
    const result = await session.run(SYNC_USER_PROFILE_CYPHER, { 
      userProfile 
    });

    if (result.records.length > 0) {
      const record = result.records[0];
      const userId = extractRecordValue(record, 'userId');
      const name = extractRecordValue(record, 'name');
      const status = extractRecordValue(record, 'status');
      
      console.log(`✅ User profile synced successfully: ${name} (${userId})`);
      console.log(`Status: ${status}`);
    } else {
      console.log('✅ User profile synced successfully (no records returned)');
    }

  } catch (error) {
    console.error('❌ Error syncing user profile to AuraDB:', error);
    throw handleAuraDBError(error, 'syncUserProfileToAuraDB');
  } finally {
    await session.close();
  }
}

// Function to sync individual project to AuraDB
export async function syncProjectToAuraDB(
  userId: string, 
  project: Project
): Promise<void> {
  // Validate the data
  if (!validateProjectData(project)) {
    throw new Error('Invalid project data');
  }

  console.log('🔄 Syncing project to AuraDB:', project.project_name);

  const session = getAuraDBDriver().session();
  
  try {
    const projectData = transformProjectForAuraDB(project);
    
    // Execute the project sync query
    const result = await session.run(SYNC_PROJECT_CYPHER, { 
      projectData,
      userId 
    });

    if (result.records.length > 0) {
      const record = result.records[0];
      const projectName = extractRecordValue(record, 'projectName');
      const status = extractRecordValue(record, 'status');
      
      console.log(`✅ Project synced successfully: ${projectName}`);
      console.log(`Status: ${status}`);
    } else {
      console.log('✅ Project synced successfully (no records returned)');
    }

  } catch (error) {
    console.error('❌ Error syncing project to AuraDB:', error);
    throw handleAuraDBError(error, 'syncProjectToAuraDB');
  } finally {
    await session.close();
  }
}

// Function to delete project from AuraDB
export async function deleteProjectFromAuraDB(
  userId: string, 
  projectName: string
): Promise<void> {
  console.log('🔄 Deleting project from AuraDB:', projectName);

  const session = getAuraDBDriver().session();
  
  try {
    const result = await session.run(DELETE_PROJECT_CYPHER, { 
      projectName,
      userId 
    });

    if (result.records.length > 0) {
      const record = result.records[0];
      const status = extractRecordValue(record, 'status');
      console.log(`✅ ${status}: ${projectName}`);
    } else {
      console.log('✅ Project deleted successfully (no records returned)');
    }

  } catch (error) {
    console.error('❌ Error deleting project from AuraDB:', error);
    throw handleAuraDBError(error, 'deleteProjectFromAuraDB');
  } finally {
    await session.close();
  }
}

// Function to check user skills in AuraDB (for debugging)
export async function checkUserSkillsInAuraDB(userId: string): Promise<any> {
  console.log('🔍 Checking user skills in AuraDB for user:', userId);
  
  const session = getAuraDBDriver().session();
  
  try {
    const result = await session.run(CHECK_USER_SKILLS_CYPHER, { userId });
    const record = result.records[0];
    
    if (record) {
      const userSkillsData = {
        userId: record.get('userId'),
        userName: record.get('userName'),
        skills: record.get('skills') || [],
        skillCount: record.get('skillCount') || 0
      };
      
      console.log('📊 User skills in AuraDB:', userSkillsData);
      return userSkillsData;
    } else {
      console.log('⚠️ No user found in AuraDB');
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to check user skills in AuraDB:', error);
    throw handleAuraDBError(error, 'checkUserSkills');
  } finally {
    await session.close();
  }
}