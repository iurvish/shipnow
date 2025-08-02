"use client";

import React, { useState, useRef } from "react";
import { AutoFormFieldProps } from "@autoform/react";
import { User, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/client";

const ProfilePhotoField: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
  field,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const { onChange, key, name, value, ...restProps } = inputProps;

  const uploadToSupabase = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("Please sign in to upload photos");
        return null;
      }

      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from("profile-photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file: " + error.message);
        return null;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-photos").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error in uploadToSupabase:", error);
      alert("Error uploading file");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (15MB max)
      if (file.size > 15 * 1024 * 1024) {
        alert("File size should be less than 15MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase and get URL
      const photoUrl = await uploadToSupabase(file);

      if (photoUrl) {
        // Update form field with the URL instead of file
        const syntheticEvent = {
          target: {
            value: photoUrl,
            name: field.key,
          },
        };
        onChange(syntheticEvent as any);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removePhoto = () => {
    setPreview(null);
    const syntheticEvent = {
      target: {
        value: null,
        name: field.key,
      },
    };
    onChange(syntheticEvent as any);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    console.log("openFileDialog called");
    console.log("fileInputRef.current:", fileInputRef.current);

    if (fileInputRef.current) {
      console.log("Calling click on file input");
      try {
        fileInputRef.current.click();
        console.log("Click called successfully");
      } catch (error) {
        console.error("Error clicking file input:", error);
      }
    } else {
      console.error("fileInputRef.current is null");
    }
  };

  return (
    <div className="profile-photo-container">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2 gap-4 md:gap-0">
        {/* Left side - Photo and Info */}
        <div className="flex items-center gap-4">
          {/* Photo Preview Circle with Drag & Drop */}
          <div
            className="relative flex-shrink-0"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 overflow-hidden bg-background flex items-center justify-center cursor-pointer transition-all duration-200 ${
                dragActive
                  ? "border-primary shadow-lg scale-105 bg-primary/10"
                  : preview
                    ? "border-border hover:border-primary/50"
                    : "border-dashed border-muted-foreground hover:border-primary"
              }`}
              onClick={openFileDialog}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
              )}

              {/* Drag overlay */}
              {dragActive && (
                <div className="absolute inset-0 bg-primary/20 rounded-full flex items-center justify-center">
                  <Upload className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
              )}
            </div>

            {preview && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full p-0 md:hidden"
                onClick={removePhoto}
              >
                <X className="w-2.5 h-2.5 md:w-3 md:h-3" />
              </Button>
            )}
          </div>

          {/* Upload Info */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-foreground mb-1">
              Profile Photo
            </label>
            <p className="text-xs text-muted-foreground">
              PNG, JPEG under 15MB
            </p>
          </div>
        </div>

        {/* Right side - Action Buttons */}
        <div className="flex gap-2 justify-end md:justify-start">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Upload button clicked");
              openFileDialog();
            }}
            className="text-xs flex-1 md:flex-none"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload new picture"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removePhoto}
            className="text-xs text-muted-foreground hidden md:flex"
            disabled={!preview}
          >
            Delete
          </Button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(e.target.files)}
          id={`file-input-${field.key}`}
        />
      </div>
    </div>
  );
};

export default ProfilePhotoField;
