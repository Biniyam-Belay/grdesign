"use client";

import { useState, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import Image from "next/image";

interface ImageUploadProps {
  bucket: "project-images" | "blog-images";
  onUpload: (url: string) => void;
  currentImage?: string;
  className?: string;
  label?: string;
}

export default function ImageUpload({
  bucket,
  onUpload,
  currentImage,
  className = "",
  label = "Upload Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const supabase = createSupabaseClient();

  const uploadImage = useCallback(
    async (file: File) => {
      try {
        setUploading(true);

        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

        const publicUrl = data.publicUrl;

        // Set preview and notify parent
        setPreview(publicUrl);
        onUpload(publicUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [bucket, onUpload, supabase.storage],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    uploadImage(file);
  };

  const removeImage = () => {
    setPreview(null);
    onUpload("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-neutral-700">{label}</label>

      {preview ? (
        <div className="relative">
          <div className="relative w-full h-48 bg-neutral-100 rounded-lg overflow-hidden">
            <Image src={preview} alt="Preview" fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
          >
            ×
          </button>
        </div>
      ) : (
        <div className="w-full h-48 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-neutral-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-neutral-600">
              {uploading ? "Uploading..." : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-neutral-500">PNG, JPG, WEBP up to 10MB</p>
          </div>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 file:cursor-pointer cursor-pointer"
      />
    </div>
  );
}
