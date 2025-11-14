"use client";

import { useState, useCallback, useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import Image from "next/image";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

interface ImageUploadProps {
  bucket: "project-images" | "blog-images" | "works";
  onUpload?: (url: string) => void;
  onChange?: (url: string) => void;
  value?: string;
  currentImage?: string;
  className?: string;
  label?: string;
}

export default function ImageUpload({
  bucket,
  onUpload,
  onChange,
  value,
  currentImage,
  className = "",
  label = "Upload Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(value || currentImage || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createSupabaseClient();

  useEffect(() => {
    setPreview(value || currentImage || null);
  }, [value, currentImage]);

  const uploadImage = useCallback(
    async (file: File) => {
      let progressInterval: NodeJS.Timeout | null = null;
      try {
        setUploading(true);
        setProgress(0);
        setPreview(URL.createObjectURL(file)); // Show instant preview

        progressInterval = setInterval(() => {
          setProgress((prev) => (prev >= 95 ? 95 : prev + 5));
        }, 200);

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

        if (uploadError) throw uploadError;

        if (progressInterval) clearInterval(progressInterval);
        setProgress(100);

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        const publicUrl = data.publicUrl;

        setPreview(publicUrl);
        if (onUpload) onUpload(publicUrl);
        if (onChange) onChange(publicUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert((error as Error).message || "Error uploading image.");
        setProgress(0);
      } finally {
        if (progressInterval) clearInterval(progressInterval);
        setUploading(false);
      }
    },
    [bucket, onUpload, onChange, supabase.storage],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }
    uploadImage(file);
  };

  const removeImage = () => {
    setPreview(null);
    setProgress(0);
    if (onUpload) onUpload("");
    if (onChange) onChange("");
  };

  const handleSelectFromLibrary = (url: string) => {
    setPreview(url);
    if (onChange) onChange(url);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        <label className="block text-sm font-medium text-neutral-700">{label}</label>

        {preview ? (
          <div className="relative">
            <div className="relative w-full h-48 bg-neutral-100 rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                sizes="160px"
                className="object-cover"
                unoptimized
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="w-full max-w-xs px-4 text-center">
                    <div className="w-full bg-neutral-200/50 rounded-full h-1.5">
                      <div
                        className="bg-white h-1.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {!uploading && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <div className="w-full h-48 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center bg-neutral-50 text-center">
            <div>
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
              <p className="mt-2 text-sm text-neutral-600">No image selected</p>
              <p className="text-xs text-neutral-500">Upload or select from library</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <label
            htmlFor="file-upload"
            className="flex-1 cursor-pointer text-center px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
          >
            Upload New Image
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex-1 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 border border-transparent rounded-lg hover:bg-purple-200"
          >
            Browse Library
          </button>
        </div>
      </div>
      <MediaLibraryModal
        bucket={bucket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectFromLibrary}
      />
    </>
  );
}
