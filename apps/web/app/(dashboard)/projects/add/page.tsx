"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormMultiSelect } from "@/components/ui/form-fields";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { createProject } from "@/lib/actions/projects";
import { ProjectInput } from "@/lib/types";
import { toast } from "sonner";

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

export default function AddProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      // Data is already in the correct format for the API
      await createProject(data);
      toast.success("Project added successfully!");
      router.push("/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Add New Project</h1>
          <p className="text-muted-foreground mt-2">
            Showcase your work and technical skills
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    name="project_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Image URL</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://example.com/screenshot.png"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Upload your screenshot to a service like Imgur or use
                          a direct URL
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="case_summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Summary *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of what this project does and why it's useful..."
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

              {/* Links */}
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

              <Card>
                <CardHeader>
                  <CardTitle>Technologies Used</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormMultiSelect
                    name="tags"
                    label="Technologies Used"
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
                      {
                        value: "SEO Optimized",
                        label: "SEO Optimized",
                      },
                      {
                        value: "Progressive Web App",
                        label: "Progressive Web App",
                      },
                      {
                        value: "Multi-language Support",
                        label: "Multi-language Support",
                      },
                      { value: "Dark Mode", label: "Dark Mode" },
                      {
                        value: "Offline Support",
                        label: "Offline Support",
                      },
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Project
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
