"use server";

import { createClient } from "@/lib/server";
import { Project, ProjectInput } from "@/lib/types";
import { revalidatePath } from "next/cache";

// Get all projects for a user
export async function getUserProjects(userId?: string): Promise<Project[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  } else {
    // If no userId provided, get for current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return data || [];
}

// Get a single project by ID
export async function getProject(projectId: string): Promise<Project | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Project not found
    }
    console.error('Error fetching project:', error);
    throw new Error(`Failed to fetch project: ${error.message}`);
  }

  return data;
}

// Create a new project
export async function createProject(projectData: ProjectInput): Promise<Project> {
  const supabase = await createClient();
  
  // Get current user if user_id not provided
  let userId = projectData.user_id;
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    userId = user.id;
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        ...projectData,
        user_id: userId,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw new Error(`Failed to create project: ${error.message}`);
  }

  revalidatePath('/'); // Revalidate any cached pages
  return data;
}

// Update an existing project
export async function updateProject(
  projectId: string, 
  projectData: Partial<ProjectInput>
): Promise<Project> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw new Error(`Failed to update project: ${error.message}`);
  }

  revalidatePath('/'); // Revalidate any cached pages
  return data;
}

// Delete a project
export async function deleteProject(projectId: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    console.error('Error deleting project:', error);
    throw new Error(`Failed to delete project: ${error.message}`);
  }

  revalidatePath('/'); // Revalidate any cached pages
}

// Get projects with specific tags
export async function getProjectsByTags(tags: string[]): Promise<Project[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .overlaps('tags', tags)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects by tags:', error);
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return data || [];
}

// Search projects by name or description
export async function searchProjects(query: string): Promise<Project[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .or(`project_name.ilike.%${query}%,case_summary.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching projects:', error);
    throw new Error(`Failed to search projects: ${error.message}`);
  }

  return data || [];
}
