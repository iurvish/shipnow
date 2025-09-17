"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormMultiSelect, FormProfilePhoto } from "@/components/ui/form-fields";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, Loader } from "lucide-react";
import { Project, ProjectInput } from "@/lib/types";
import { updateProject, getProject } from "@/lib/actions/projects";

const formSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  case_summary: z.string().min(1, "Project description is required"),
  project_image: z.string().url().optional().or(z.literal("")),
  live_site_url: z.string().url().optional().or(z.literal("")),
  github_link: z.string().url().optional().or(z.literal("")),
  video_url: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()),
  key_features: z.array(z.string()),
  build_journey: z.string().optional(),
  results: z.string().optional(),
});

type ProjectFormData = z.infer<typeof formSchema>;

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_name: "",
      case_summary: "",
      project_image: "",
      live_site_url: "",
      github_link: "",
      video_url: "",
      tags: [],
      key_features: [],
      build_journey: "",
      results: "",
    },
  });

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectData = await getProject(resolvedParams.id);
        if (projectData) {
          setProject(projectData);
          form.reset({
            project_name: projectData.project_name || "",
            case_summary: projectData.case_summary || "",
            project_image: projectData.project_image || "",
            live_site_url: projectData.live_site_url || "",
            github_link: projectData.github_link || "",
            video_url: projectData.video_url || "",
            tags: projectData.tags || [],
            key_features: projectData.key_features || [],
            build_journey: projectData.build_journey || "",
            results: projectData.results || "",
          });
        } else {
          toast.error("Project not found");
          router.push("/projects");
        }
      } catch (error) {
        toast.error("Failed to load project");
        router.push("/projects");
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [resolvedParams.id, router]);

  const onSubmit = async (data: ProjectFormData) => {
    if (!project) return;

    setIsSubmitting(true);
    try {
      // Data is already in the correct format for the API
      await updateProject(project.id, data);
      toast.success("Project updated successfully!");
      router.push("/projects");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Button onClick={() => router.push("/projects")}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground mt-2">
            Update your project details and information.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="project_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="My Awesome Project" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="case_summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of what your project does..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="project_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Image URL</FormLabel>
                        <FormControl>
                          <FormControl>
                            <FormProfilePhoto
                              name={field.name}
                              label={undefined}
                              placeholder="Upload project image"
                              aspectRatio={16 / 10}
                              cropShape="rect"
                              accept="image/*"
                            />
                          </FormControl>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Project Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="live_site_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Live Site URL</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://myproject.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="github_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub Repository</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://github.com/username/project"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="video_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demo Video URL</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://youtube.com/watch?v=..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Technologies */}
              <Card>
                <CardHeader>
                  <CardTitle>Technologies & Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormMultiSelect
                    name="tags"
                    label="Technologies & Tools"
                    placeholder="Select technologies..."
                    options={[
                      { value: "React", label: "React" },
                      { value: "Next.js", label: "Next.js" },
                      { value: "TypeScript", label: "TypeScript" },
                      { value: "JavaScript", label: "JavaScript" },
                      { value: "Node.js", label: "Node.js" },
                      { value: "Python", label: "Python" },
                      { value: "Tailwind CSS", label: "Tailwind CSS" },
                      { value: "Prisma", label: "Prisma" },
                      { value: "Supabase", label: "Supabase" },
                      { value: "PostgreSQL", label: "PostgreSQL" },
                      { value: "MySQL", label: "MySQL" },
                      { value: "MongoDB", label: "MongoDB" },
                      { value: "Redis", label: "Redis" },
                      { value: "Docker", label: "Docker" },
                      { value: "Kubernetes", label: "Kubernetes" },
                      { value: "AWS", label: "AWS" },
                      { value: "Azure", label: "Azure" },
                      { value: "Google Cloud", label: "Google Cloud" },
                      { value: "Vercel", label: "Vercel" },
                      { value: "Netlify", label: "Netlify" },
                    ]}
                  />
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormMultiSelect
                    name="key_features"
                    label="Key Features"
                    placeholder="Select key features..."
                    options={[
                      {
                        value: "User Authentication",
                        label: "User Authentication",
                      },
                      {
                        value: "Real-time Updates",
                        label: "Real-time Updates",
                      },
                      {
                        value: "Responsive Design",
                        label: "Responsive Design",
                      },
                      { value: "REST API", label: "REST API" },
                      { value: "GraphQL API", label: "GraphQL API" },
                      {
                        value: "Database Integration",
                        label: "Database Integration",
                      },
                      {
                        value: "Payment Processing",
                        label: "Payment Processing",
                      },
                      {
                        value: "Search Functionality",
                        label: "Search Functionality",
                      },
                      {
                        value: "Analytics Dashboard",
                        label: "Analytics Dashboard",
                      },
                      {
                        value: "Push Notifications",
                        label: "Push Notifications",
                      },
                      { value: "Chat System", label: "Chat System" },
                      { value: "File Upload", label: "File Upload" },
                      { value: "Admin Panel", label: "Admin Panel" },
                      { value: "SEO Optimized", label: "SEO Optimized" },
                      {
                        value: "Progressive Web App",
                        label: "Progressive Web App",
                      },
                      {
                        value: "Multi-language Support",
                        label: "Multi-language Support",
                      },
                      { value: "Dark Mode", label: "Dark Mode" },
                      { value: "Offline Support", label: "Offline Support" },
                      {
                        value: "Email Integration",
                        label: "Email Integration",
                      },
                      { value: "Social Login", label: "Social Login" },
                    ]}
                  />

                  <FormField
                    control={form.control}
                    name="build_journey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Development Journey</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the development process, challenges you faced, and how you solved them..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="results"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Results & Impact</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What did you achieve? User metrics, personal learnings, feedback received..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Project
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
