"use client";

import React, { useState, useRef, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Upload, Edit3, X, Check, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Cropper,
  CropperCropArea,
  CropperDescription,
  CropperImage,
} from "@/components/ui/cropper";
import { toast } from "sonner";
import {
  uploadProfilePhoto,
  updateProfilePhoto,
  deleteProfilePhoto,
} from "@/lib/profile-photo-storage";
import { getCurrentUser } from "@/lib/auth-utils";

interface FormProfilePhotoProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  aspectRatio?: number;
  cropShape?: "rect" | "round";
  accept?: string;
  className?: string;
}

const FormProfilePhoto: React.FC<FormProfilePhotoProps> = ({
  name,
  label,
  placeholder = "Upload profile photo",
  required = false,
  aspectRatio = 1,
  cropShape = "round",
  accept = "image/*",
  className = "",
}) => {
  const { control, setValue, watch } = useFormContext();

  // State management
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [cropperState, setCropperState] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [savedCropState, setSavedCropState] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isCropperReady, setIsCropperReady] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentValue = watch(name);
  const cropAreaClassName = cropShape === "round" ? "rounded-full" : "";

  // Update local state when form value changes
  React.useEffect(() => {
    setCroppedImage(currentValue || null);
  }, [currentValue]);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setTempImage(imageUrl);
          setOriginalImage(imageUrl);
          setIsDialogOpen(true);
          setIsCropperReady(false);
          setCropperState(null);
          setSavedCropState(null);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  // Function to create cropped image from canvas
  const createCroppedImage = (
    imageSrc: string,
    crop?: { x: number; y: number; width: number; height: number }
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const image = new Image();

      image.onload = () => {
        if (!crop) {
          // If no crop info, use the entire image with aspect ratio constraints
          const { naturalWidth, naturalHeight } = image;
          const configAspectRatio = aspectRatio;

          let cropWidth, cropHeight, cropX, cropY;

          if (naturalWidth / naturalHeight > configAspectRatio) {
            // Image is wider than aspect ratio
            cropHeight = naturalHeight;
            cropWidth = naturalHeight * configAspectRatio;
            cropX = (naturalWidth - cropWidth) / 2;
            cropY = 0;
          } else {
            // Image is taller than aspect ratio
            cropWidth = naturalWidth;
            cropHeight = naturalWidth / configAspectRatio;
            cropX = 0;
            cropY = (naturalHeight - cropHeight) / 2;
          }

          canvas.width = cropWidth;
          canvas.height = cropHeight;

          if (ctx) {
            ctx.drawImage(
              image,
              cropX,
              cropY,
              cropWidth,
              cropHeight,
              0,
              0,
              cropWidth,
              cropHeight
            );
          }
        } else {
          // Use provided crop coordinates (these are already in original image pixel coordinates)
          canvas.width = crop.width;
          canvas.height = crop.height;

          if (ctx) {
            ctx.drawImage(
              image,
              crop.x,
              crop.y,
              crop.width,
              crop.height,
              0,
              0,
              crop.width,
              crop.height
            );
          }
        }

        // Convert canvas to data URL
        const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve(croppedDataUrl);
      };

      image.src = imageSrc;
    });
  };

  const handleCrop = useCallback(async () => {
    if (tempImage) {
      setIsUploading(true);

      try {
        // Get current user
        const user = await getCurrentUser();
        if (!user) {
          toast.error("Authentication required to upload profile photo");
          return;
        }

        let croppedDataUrl;

        if (cropperState) {
          // Use cropper state if available
          console.log("Saving crop state for future edits:", cropperState);
          croppedDataUrl = await createCroppedImage(tempImage, cropperState);
          // Save the crop state for future edits
          setSavedCropState(cropperState);
        } else {
          // Use default center crop if no cropper state
          console.log("No cropper state, using default center crop");
          croppedDataUrl = await createCroppedImage(tempImage);
        }

        // Upload to Supabase Storage
        console.log("Uploading profile photo to Supabase...");
        const currentImageUrl = currentValue; // This is the current Supabase URL if any

        let uploadResult;
        if (currentImageUrl && currentImageUrl.includes("supabase")) {
          // Update existing photo
          uploadResult = await updateProfilePhoto(
            croppedDataUrl,
            user.id,
            currentImageUrl
          );
        } else {
          // Upload new photo
          uploadResult = await uploadProfilePhoto(croppedDataUrl, user.id);
        }

        if (uploadResult.success && uploadResult.url) {
          console.log("Profile photo uploaded successfully:", uploadResult.url);

          // Update form with Supabase Storage URL
          setCroppedImage(uploadResult.url);
          setValue(name, uploadResult.url);

          toast.success("Profile photo uploaded successfully!");

          setIsDialogOpen(false);
          setTempImage(null);
          setCropperState(null);
          setIsCropperReady(false);
        } else {
          console.error("Upload failed:", uploadResult.error);
          toast.error(uploadResult.error || "Failed to upload profile photo");
        }
      } catch (error) {
        console.error("Error cropping/uploading image:", error);
        toast.error("Error processing profile photo");
      } finally {
        setIsUploading(false);
      }
    }
  }, [
    tempImage,
    cropperState,
    name,
    setValue,
    createCroppedImage,
    currentValue,
  ]);

  const handleEdit = useCallback(() => {
    if (originalImage) {
      console.log("Edit clicked, originalImage:", !!originalImage);
      console.log("Saved crop state:", savedCropState);
      setTempImage(originalImage);
      setIsDialogOpen(true);
      setIsCropperReady(false);
      // Restore the saved crop state if available
      if (savedCropState) {
        console.log("Restoring crop state:", savedCropState);
        setCropperState(savedCropState);
      } else {
        console.log("No saved crop state, using null");
        setCropperState(null);
      }
    } else {
      console.log("No original image available for edit");
    }
  }, [originalImage, savedCropState]);

  const handleCancel = useCallback(() => {
    setIsDialogOpen(false);
    setTempImage(null);
    setCropperState(null);
    setIsCropperReady(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleRemoveImage = useCallback(async () => {
    const currentImageUrl = currentValue;

    // Only delete from storage if it's a Supabase URL
    if (currentImageUrl && currentImageUrl.includes("supabase")) {
      setIsDeleting(true);

      try {
        console.log("Deleting profile photo from Supabase...");
        const deleteResult = await deleteProfilePhoto(currentImageUrl);

        if (deleteResult.success) {
          console.log("Profile photo deleted successfully");
          toast.success("Profile photo removed successfully!");
        } else {
          console.error("Delete failed:", deleteResult.error);
          toast.error(deleteResult.error || "Failed to delete profile photo");
          return; // Don't proceed with UI update if delete failed
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Error removing profile photo");
        return; // Don't proceed with UI update if delete failed
      } finally {
        setIsDeleting(false);
      }
    }

    // Update UI state
    setCroppedImage(null);
    setOriginalImage(null);
    setSavedCropState(null);
    setValue(name, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Show success message for local images too
    if (!currentImageUrl || !currentImageUrl.includes("supabase")) {
      toast.success("Profile photo removed!");
    }
  }, [name, setValue, currentValue]);

  const triggerFileInput = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    fileInputRef.current?.click();
  }, []);

  // Handle cropper state changes - this is called whenever the crop area changes
  const handleCropperChange = useCallback(
    (
      cropData: { x: number; y: number; width: number; height: number } | null
    ) => {
      console.log("Cropper crop data changed:", cropData);
      setCropperState(cropData);
      if (cropData && !isCropperReady) {
        setIsCropperReady(true);
      }
    },
    [isCropperReady]
  );

  // Handle when image loads in cropper
  const handleImageLoad = useCallback(() => {
    console.log("Cropper image loaded");
    setIsCropperReady(true);
  }, []);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label} {required && "*"}
            </FormLabel>
          )}
          <FormControl>
            <div className={cn("space-y-2", className)}>
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
                id={`file-input-${name}`}
                name={name}
                tabIndex={-1}
              />

              {croppedImage ? (
                <TooltipProvider>
                  <div className="relative inline-block">
                    {/* Circular profile image */}
                    <div className="relative group">
                      <div
                        className={cn(
                          "w-32 h-32 overflow-hidden border-4 border-border bg-muted",
                          cropShape === "round" ? "rounded-full" : "rounded-lg"
                        )}
                      >
                        <img
                          src={croppedImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Overlay buttons container */}
                      <div
                        className={cn(
                          "absolute inset-0 bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center",
                          cropShape === "round" ? "rounded-full" : "rounded-lg"
                        )}
                      >
                        <div className="flex gap-3 items-center justify-center">
                          {/* Edit button */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={handleEdit}
                                disabled={isUploading || isDeleting}
                                className="w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 shadow-lg disabled:opacity-50"
                              >
                                {isUploading ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Edit3 className="w-4 h-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {isUploading ? "Uploading..." : "Edit image"}
                              </p>
                            </TooltipContent>
                          </Tooltip>

                          {/* Remove button */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={handleRemoveImage}
                                disabled={isUploading || isDeleting}
                                className="w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 shadow-lg disabled:opacity-50"
                              >
                                {isDeleting ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {isDeleting ? "Removing..." : "Remove image"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </TooltipProvider>
              ) : (
                <div className="flex justify-start">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => triggerFileInput(e)}
                    disabled={isUploading || isDeleting}
                    className={cn(
                      "w-32 h-32 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors p-0 disabled:opacity-50",
                      cropShape === "round" ? "rounded-full" : "rounded-lg"
                    )}
                  >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      {isUploading || isDeleting ? (
                        <>
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <span className="text-xs text-center text-wrap leading-tight px-2">
                            {isUploading ? "Uploading..." : "Processing..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8" />
                          <span className="text-xs text-center text-wrap leading-tight px-2">
                            {placeholder}
                          </span>
                        </>
                      )}
                    </div>
                  </Button>
                </div>
              )}

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crop Image</DialogTitle>
                  </DialogHeader>

                  {tempImage && (
                    <div className="space-y-4">
                      <Cropper
                        className="relative flex h-80 w-full cursor-move touch-none items-center justify-center overflow-hidden rounded-md border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        image={tempImage}
                        aspectRatio={aspectRatio}
                        onCropChange={handleCropperChange}
                      >
                        <CropperDescription className="sr-only">
                          Use your mouse to pan and zoom the image. The crop
                          area shows what will be included.
                        </CropperDescription>
                        <CropperImage
                          className="pointer-events-none h-full w-full select-none object-cover"
                          onLoad={handleImageLoad}
                        />
                        <CropperCropArea
                          className={cn(
                            "pointer-events-none absolute border-2 border-dashed border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]",
                            cropAreaClassName
                          )}
                        />
                      </Cropper>

                      {/* Debug info - uncomment for debugging */}
                      {/* <div className="text-xs text-muted-foreground">
                        Ready: {isCropperReady ? "Yes" : "No"} | Crop Data:{" "}
                        {cropperState
                          ? `${cropperState.width}x${cropperState.height}`
                          : "None"}
                      </div> */}
                    </div>
                  )}

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isUploading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCrop}
                      disabled={!isCropperReady || isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Apply Crop
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormProfilePhoto;
