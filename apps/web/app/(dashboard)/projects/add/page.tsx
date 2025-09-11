"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, ArrowLeft, Save, Loader2 } from "lucide-react";
import { createProject } from "@/lib/actions/projects";
import { ProjectInput } from "@/lib/types";
import { toast } from "sonner";

export default function AddProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjectInput>({
    project_name: "",
    project_image: "",
    live_site_url: "",
    github_link: "",
    video_url: "",
    tags: [],
    case_summary: "",
    build_journey: "",
    key_features: [],
    results: "",
  });

  const [currentTag, setCurrentTag] = useState("");
  const [currentFeature, setCurrentFeature] = useState("");

  const handleInputChange = (field: keyof ProjectInput, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addFeature = () => {
    if (
      currentFeature.trim() &&
      !formData.key_features.includes(currentFeature.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        key_features: [...prev.key_features, currentFeature.trim()],
      }));
      setCurrentFeature("");
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      key_features: prev.key_features.filter(
        (feature) => feature !== featureToRemove
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.project_name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProject(formData);
      toast.success("Project added successfully!");
      router.push("/dashboard/projects");
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

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="project_name">Project Name *</Label>
                  <Input
                    id="project_name"
                    value={formData.project_name}
                    onChange={(e) =>
                      handleInputChange("project_name", e.target.value)
                    }
                    placeholder="My Awesome Project"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="project_image">Project Image URL</Label>
                  <Input
                    id="project_image"
                    type="url"
                    value={formData.project_image || ""}
                    onChange={(e) =>
                      handleInputChange("project_image", e.target.value)
                    }
                    placeholder="https://example.com/screenshot.png"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload your screenshot to a service like Imgur or use a
                    direct URL
                  </p>
                </div>

                <div>
                  <Label htmlFor="case_summary">Project Summary</Label>
                  <Textarea
                    id="case_summary"
                    value={formData.case_summary || ""}
                    onChange={(e) =>
                      handleInputChange("case_summary", e.target.value)
                    }
                    placeholder="Brief description of what this project does and why it's useful..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle>Project Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="live_site_url">Live Site URL</Label>
                  <Input
                    id="live_site_url"
                    type="url"
                    value={formData.live_site_url || ""}
                    onChange={(e) =>
                      handleInputChange("live_site_url", e.target.value)
                    }
                    placeholder="https://myproject.com"
                  />
                </div>

                <div>
                  <Label htmlFor="github_link">GitHub Repository</Label>
                  <Input
                    id="github_link"
                    type="url"
                    value={formData.github_link || ""}
                    onChange={(e) =>
                      handleInputChange("github_link", e.target.value)
                    }
                    placeholder="https://github.com/username/project"
                  />
                </div>

                <div>
                  <Label htmlFor="video_url">Demo Video URL</Label>
                  <Input
                    id="video_url"
                    type="url"
                    value={formData.video_url || ""}
                    onChange={(e) =>
                      handleInputChange("video_url", e.target.value)
                    }
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Technologies */}
            <Card>
              <CardHeader>
                <CardTitle>Technologies Used</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tags">Add Technology Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="React, TypeScript, Node.js..."
                      onKeyDown={(e) => handleKeyDown(e, addTag)}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="key_features">Key Features</Label>
                  <div className="flex gap-2">
                    <Input
                      id="key_features"
                      value={currentFeature}
                      onChange={(e) => setCurrentFeature(e.target.value)}
                      placeholder="User authentication, Real-time chat..."
                      onKeyDown={(e) => handleKeyDown(e, addFeature)}
                    />
                    <Button
                      type="button"
                      onClick={addFeature}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mt-3">
                    {formData.key_features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-muted p-2 rounded"
                      >
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="build_journey">Development Journey</Label>
                  <Textarea
                    id="build_journey"
                    value={formData.build_journey || ""}
                    onChange={(e) =>
                      handleInputChange("build_journey", e.target.value)
                    }
                    placeholder="Describe the development process, challenges you faced, and how you solved them..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="results">Results & Impact</Label>
                  <Textarea
                    id="results"
                    value={formData.results || ""}
                    onChange={(e) =>
                      handleInputChange("results", e.target.value)
                    }
                    placeholder="What did you achieve? User metrics, personal learnings, feedback received..."
                    rows={3}
                  />
                </div>
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
      </div>
    </div>
  );
}
