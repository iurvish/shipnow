"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, Github, Play, Edit, Trash2 } from "lucide-react";
import { getUserProjects, deleteProject } from "@/lib/actions/projects";
import { Project } from "@/lib/types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const userProjects = await getUserProjects();
      setProjects(userProjects);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    setDeletingId(projectId);
    try {
      await deleteProject(projectId);
      setProjects(projects.filter((p) => p.id !== projectId));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold line-clamp-1">
            {project.project_name}
          </CardTitle>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                router.push(`/dashboard/projects/edit/${project.id}`)
              }
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={deletingId === project.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{project.project_name}"?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(project.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Project Image */}
        {project.project_image && (
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src={project.project_image}
              alt={project.project_name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Summary */}
        {project.case_summary && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {project.case_summary}
          </p>
        )}

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{project.tags.length - 4} more
              </Badge>
            )}
          </div>
        )}

        {/* Key Features */}
        {project.key_features.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Key Features:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {project.key_features.slice(0, 2).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  {feature}
                </li>
              ))}
              {project.key_features.length > 2 && (
                <li className="text-xs text-muted-foreground">
                  +{project.key_features.length - 2} more features
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Links */}
        <div className="flex gap-2 pt-2">
          {project.live_site_url && (
            <Button size="sm" variant="outline" asChild>
              <a
                href={project.live_site_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Live Site
              </a>
            </Button>
          )}
          {project.github_link && (
            <Button size="sm" variant="outline" asChild>
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4 mr-2" />
                Code
              </a>
            </Button>
          )}
          {project.video_url && (
            <Button size="sm" variant="outline" asChild>
              <a
                href={project.video_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="h-4 w-4 mr-2" />
                Demo
              </a>
            </Button>
          )}
        </div>

        {/* Date */}
        <p className="text-xs text-muted-foreground">
          Created {new Date(project.created_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Projects</h1>
              <p className="text-muted-foreground mt-2">
                Showcase your technical skills and experience
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-32 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Projects</h1>
            <p className="text-muted-foreground mt-2">
              Showcase your technical skills and experience
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/projects/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Link>
          </Button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Start building your portfolio by adding your first project
              </p>
              <Button asChild>
                <Link href="/dashboard/projects/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Project
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
