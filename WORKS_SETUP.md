# Works System Setup Guide

## Overview

The Featured Works system has been updated to use direct database queries instead of Edge Functions, and the form has been simplified to only include the essential fields.

## Changes Made

### 1. Simplified Form Fields

The work form now only includes:

- **Title** (required) - Auto-generates slug
- **Description** (required) - Brief description of the work
- **Image** (required) - Featured image upload
- **Aspect Ratio** (required) - Square, Portrait (4:5), or Tall Portrait (9:16)
- **Display Order** (required) - Numeric order for sorting

### 2. Removed Fields

- **Slug** - Now auto-generated from title
- **Link** - Removed as not needed

### 3. Direct Database Access

Instead of using Edge Functions (which require deployment), the system now uses direct Supabase database queries:

- `WorkForm.tsx` - Uses `supabase.from("works").insert()` and `.update()`
- `WorkManagement.tsx` - Uses `supabase.from("works").select()` and `.delete()`

### 4. ImageUpload Component

Updated to support the "works" bucket with both `onChange` and `onUpload` callbacks.

## Setup Requirements

### 1. Database Migration

Run the migration to create the works table:

```bash
cd /workspaces/grdesign
supabase db push
```

Or manually run this SQL in your Supabase dashboard:

```sql
-- Create works table
CREATE TABLE IF NOT EXISTS works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  aspect_ratio TEXT DEFAULT 'square',
  link TEXT,
  featured_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access" ON works
  FOR SELECT USING (true);

-- Authenticated users can insert
CREATE POLICY "Allow authenticated insert" ON works
  FOR INSERT TO authenticated WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Allow authenticated update" ON works
  FOR UPDATE TO authenticated USING (true);

-- Authenticated users can delete
CREATE POLICY "Allow authenticated delete" ON works
  FOR DELETE TO authenticated USING (true);
```

### 2. Storage Bucket Setup

Create the "works" storage bucket in Supabase:

**Option A: Via Supabase Dashboard**

1. Go to Storage in your Supabase dashboard
2. Click "Create new bucket"
3. Name it "works"
4. Make it public
5. Set up policies for authenticated uploads

**Option B: Via SQL**

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('works', 'works', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
  USING (bucket_id = 'works');

-- Authenticated upload
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'works');

-- Authenticated update
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'works');

-- Authenticated delete
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'works');
```

## Testing

1. **Login to Admin**: Navigate to `/admin/login` and sign in
2. **Access Works**: Go to `/admin/works`
3. **Add a Work**: Click "Add Work" button
4. **Fill Form**:
   - Enter title (slug auto-generates)
   - Add description
   - Upload image
   - Select aspect ratio
   - Set display order
5. **Save**: Click "Create Work"
6. **Verify**: Check that work appears in the list
7. **Edit/Delete**: Test edit and delete functionality
8. **View Frontend**: Check `/` homepage to see Featured Works section

## Troubleshooting

### "Failed to send a request to the Edge Function"

This error is now resolved - we're using direct database queries instead of Edge Functions.

### Image Upload Fails

- Ensure the "works" bucket exists in Supabase Storage
- Check that RLS policies allow authenticated uploads
- Verify you're logged in as an authenticated user

### Cannot See Works

- Check that the works table exists
- Verify RLS policies allow public read access
- Check browser console for errors

### Database Errors

- Ensure migration has been run
- Check that all RLS policies are created
- Verify your Supabase environment variables are set correctly

## Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Next Steps

1. Run the database migration
2. Create the storage bucket
3. Test adding a work
4. Verify it displays on the homepage
5. Test editing and deleting works
