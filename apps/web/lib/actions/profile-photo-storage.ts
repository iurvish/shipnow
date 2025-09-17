import { createClient } from "@/lib/client";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

/**
 * Convert data URL to File object
 */
function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  if (arr.length < 2) {
    throw new Error('Invalid data URL format');
  }
  
  const mimeMatch = arr[0]?.match(/:(.*?);/);
  const mime = mimeMatch?.[1] || 'image/jpeg';
  const base64Data = arr[1];
  if (!base64Data) {
    throw new Error('Invalid base64 data');
  }
  
  const bstr = atob(base64Data);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

/**
 * Generate unique filename for profile photo with folder structure
 */
function generateProfilePhotoFilename(userId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  // Use folder structure: userId/filename.jpg
  return `${userId}/${timestamp}_${random}.jpg`;
}

/**
 * Extract folder and filename from Supabase Storage URL
 */
function extractFilenameFromUrl(url: string): string | null {
  try {
    // Extract filename from Supabase storage URL
    // Format: https://[project].supabase.co/storage/v1/object/public/profile-photos/userId/filename.jpg
    const urlParts = url.split('/profile-photos/');
    if (urlParts.length > 1 && urlParts[1]) {
      return urlParts[1]; // This includes the userId/filename.jpg part
    }
    return null;
  } catch (error) {
    console.error('Error extracting filename from URL:', error);
    return null;
  }
}

/**
 * Upload profile photo to Supabase Storage
 */
export async function uploadProfilePhoto(
  dataUrl: string, 
  userId: string, 
  existingUrl?: string
): Promise<UploadResult> {
  try {
    const supabase = createClient();
    
    // Generate filename
    const filename = generateProfilePhotoFilename(userId);
    
    // Convert data URL to file
    const file = dataURLtoFile(dataUrl, filename);
    
    // Delete existing file if it exists
    if (existingUrl) {
      const existingFilename = extractFilenameFromUrl(existingUrl);
      if (existingFilename) {
        console.log('Deleting existing profile photo:', existingFilename);
        await supabase.storage
          .from('profile-photos')
          .remove([existingFilename]);
      }
    }
    
    // console.log('Uploading new profile photo:', filename);
    // console.log('User ID:', userId);
    // console.log('File size:', file.size, 'bytes');
    // console.log('File type:', file.type);
    
    // Upload new file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false // Don't upsert, always create new file
      });

    if (uploadError) {
      console.error('Upload error details:', {
        message: uploadError.message,
        error: uploadError,
        filename,
        userId,
        fileSize: file.size,
        fileType: file.type
      });
      return {
        success: false,
        error: `Failed to upload image: ${uploadError.message}`
      };
    }

    console.log('Upload successful:', uploadData);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(filename);

    if (!urlData?.publicUrl) {
      return {
        success: false,
        error: 'Failed to get public URL for uploaded image'
      };
    }

    console.log('Generated public URL:', urlData.publicUrl);

    return {
      success: true,
      url: urlData.publicUrl
    };

  } catch (error) {
    console.error('Profile photo upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error'
    };
  }
}

/**
 * Delete profile photo from Supabase Storage
 */
export async function deleteProfilePhoto(imageUrl: string): Promise<DeleteResult> {
  try {
    const supabase = createClient();
    
    // Extract filename from URL
    const filename = extractFilenameFromUrl(imageUrl);
    
    if (!filename) {
      return {
        success: false,
        error: 'Invalid image URL format'
      };
    }

    console.log('Deleting profile photo:', filename);
    
    // Delete file from storage
    const { error: deleteError } = await supabase.storage
      .from('profile-photos')
      .remove([filename]);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return {
        success: false,
        error: `Failed to delete image: ${deleteError.message}`
      };
    }

    console.log('Profile photo deleted successfully');
    
    return {
      success: true
    };

  } catch (error) {
    console.error('Profile photo delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown delete error'
    };
  }
}

/**
 * Update profile photo (upload new and delete old)
 */
export async function updateProfilePhoto(
  newDataUrl: string,
  userId: string,
  currentUrl: string
): Promise<UploadResult> {
  console.log('Updating profile photo - Current URL:', currentUrl);
  
  // Upload new photo (this will automatically delete the old one)
  return uploadProfilePhoto(newDataUrl, userId, currentUrl);
}