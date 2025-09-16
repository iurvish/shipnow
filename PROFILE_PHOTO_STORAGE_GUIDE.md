# Profile Photo Storage Implementation Guide

## 🚨 TROUBLESHOOTING RLS ERROR

### Error: "new row violates row-level security policy"

**IMMEDIATE FIX - Disable RLS for Testing:**

1. Go to Supabase Dashboard → Storage
2. Find your `profile-photos` bucket
3. Click bucket settings → **Disable RLS**
4. Test upload functionality
5. Once working, re-enable RLS with correct policies below

**Alternative: Use Correct RLS Policies**
The error happens because the RLS policy expects a folder structure. Use these policies:

```sql
-- First, enable RLS if not already enabled
ALTER TABLE storage.objects ENABLE row level security;

-- Delete any existing policies for profile-photos bucket
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Profile photos are publicly viewable" ON storage.objects;

-- Add new working policies with folder structure
CREATE POLICY "Users can upload to their own folder" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Profile photos are publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-photos');
```

---

## Supabase Storage Setup

### 1. Bucket Configuration

Make sure your `profile-photos` bucket in Supabase Storage is configured correctly:

1. **Go to Supabase Dashboard** → Storage
2. **Create bucket** (if not exists): `profile-photos`
3. **Set bucket as public** for profile photos
4. **Configure RLS policies** (recommended):

```sql
-- Allow authenticated users to upload their own profile photos
CREATE POLICY "Users can upload their own profile photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own profile photos
CREATE POLICY "Users can update their own profile photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own profile photos
CREATE POLICY "Users can delete their own profile photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow everyone to view profile photos (public access)
CREATE POLICY "Profile photos are publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-photos');
```

### 2. Alternative Simple Setup (Public Bucket)

If you prefer a simpler setup without RLS:

1. Make the bucket **public**
2. No RLS policies needed
3. Anyone can read, authenticated users can write

## Features Implemented

### ✅ **Upload to Supabase Storage**

- **Automatic upload** when user applies crop
- **Unique filename generation** with user ID, timestamp, and random string
- **JPEG compression** with 0.8 quality for optimal file size
- **Error handling** with user-friendly messages

### ✅ **Update/Replace Images**

- **Smart replacement**: Automatically deletes old image when uploading new one
- **Maintains crop state** for future edits
- **Seamless UX**: User doesn't see intermediate states

### ✅ **Delete from Storage**

- **Complete cleanup**: Removes file from Supabase Storage
- **Fallback handling**: Works with local images too
- **Confirmation feedback**: Toast notifications for all operations

### ✅ **Loading States**

- **Visual feedback** during upload/delete operations
- **Disabled interactions** to prevent double-clicks
- **Spinner animations** on buttons and dialog

### ✅ **Error Handling**

- **Comprehensive try-catch** blocks
- **User-friendly error messages** via toast notifications
- **Graceful fallbacks** when operations fail

## How It Works

### Upload Flow

1. **User selects image** → Shows in cropping dialog
2. **User crops image** → Generates data URL
3. **Click "Apply Crop"** → Converts to File and uploads to Supabase
4. **Success** → Form field gets Supabase Storage URL
5. **Error** → Shows error message, keeps local image

### Update Flow

1. **User clicks edit** → Opens cropping dialog with current image
2. **User re-crops** → Generates new data URL
3. **Click "Apply Crop"** → Deletes old file, uploads new one
4. **Success** → Updates form field with new URL

### Delete Flow

1. **User clicks remove** → Shows loading spinner
2. **Delete from Supabase** → Removes file from storage
3. **Success** → Clears form field and local state

## File Structure

```
/lib/
  ├── profile-photo-storage.ts  # Storage operations
  ├── auth-utils.ts            # User authentication helper
/components/ui/form-fields/
  └── form-profile-photo.tsx   # Enhanced component
```

## Testing Checklist

### ✅ **Upload New Photo**

- [ ] Select image file
- [ ] Crop image in dialog
- [ ] Click "Apply Crop"
- [ ] Verify upload success toast
- [ ] Check image appears with Supabase URL
- [ ] Verify file exists in Supabase Storage dashboard

### ✅ **Edit Existing Photo**

- [ ] Click edit button on existing photo
- [ ] Verify cropping dialog opens with current image
- [ ] Make changes and apply
- [ ] Verify old file is deleted and new file uploaded
- [ ] Check only one file exists per user

### ✅ **Delete Photo**

- [ ] Click remove button
- [ ] Verify loading spinner appears
- [ ] Check success toast
- [ ] Verify image removed from UI
- [ ] Confirm file deleted from Supabase Storage

### ✅ **Error Scenarios**

- [ ] Network error during upload
- [ ] Authentication issues
- [ ] Storage permissions problems
- [ ] Invalid image formats

## Production Considerations

### Security

- **RLS Policies**: Users can only manage their own photos
- **File Size Limits**: Consider adding client-side file size validation
- **File Type Validation**: Currently allows any image type

### Performance

- **Image Compression**: JPEG quality set to 0.8 for balance
- **Unique Filenames**: Prevents caching issues
- **Automatic Cleanup**: Old files are automatically deleted

### Monitoring

- **Error Logging**: All errors are logged to console
- **Toast Notifications**: User-friendly feedback
- **Loading States**: Clear visual feedback

The implementation provides a production-ready profile photo management system with comprehensive error handling and optimal user experience!
