"use client";

import { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { createSupabaseClient } from "@/lib/supabase/client";
import Image from "next/image";

interface Upload {
  url: string;
  name: string;
}

interface BatchImageUploadProps {
  bucket: "project-images" | "blog-images" | "works";
  onChange: (uploads: Upload[]) => void;
  className?: string;
}

interface FilePreview {
  file: File;
  preview: string;
  progress: number;
  error?: string;
}

export default function BatchImageUpload({
  bucket,
  onChange,
  className = "",
}: BatchImageUploadProps) {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createSupabaseClient();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxSize: 10 * 1024 * 1024, // 10MB
    noClick: true,
  });

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setIsUploading(true);
    const intervalIds: NodeJS.Timeout[] = [];

    const uploadPromises = files.map((filePreview, index) => {
      return new Promise<Upload | null>((resolve) => {
        const progressInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f, i) => {
              if (i === index && f.progress < 95) {
                return { ...f, progress: f.progress + 5 };
              }
              return f;
            }),
          );
        }, 200);
        intervalIds.push(progressInterval);

        const file = filePreview.file;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          })
          .then(({ error: uploadError }: { error: Error | null }) => {
            clearInterval(progressInterval);
            if (uploadError) {
              setFiles((prev) =>
                prev.map((f, i) =>
                  i === index ? { ...f, error: uploadError.message, progress: 0 } : f,
                ),
              );
              resolve(null);
            } else {
              const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
              const publicUrl = data.publicUrl;
              setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, progress: 100 } : f)));
              resolve({ url: publicUrl, name: file.name.replace(/\.[^/.]+$/, "") });
            }
          });
      });
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((r): r is Upload => r !== null);

    setIsUploading(false);
    if (successfulUploads.length > 0) {
      onChange(successfulUploads);
    }
    // Clear any remaining intervals just in case
    intervalIds.forEach(clearInterval);
  };

  const dropzoneClasses = useMemo(
    () =>
      `w-full p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors
      ${isDragActive ? "border-purple-500 bg-purple-50" : "border-neutral-300 bg-neutral-50 hover:bg-neutral-100"}`,
    [isDragActive],
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div {...getRootProps()} className={dropzoneClasses} onClick={open}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
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
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop images here, or click to select"}
          </p>
          <p className="text-xs text-neutral-500">PNG, JPG, WEBP up to 10MB each</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((filePreview, index) => (
              <div
                key={index}
                className="relative group bg-neutral-100 rounded-lg overflow-hidden shadow-sm"
              >
                <Image
                  src={filePreview.preview}
                  alt={filePreview.file.name}
                  width={150}
                  height={150}
                  className="object-cover w-full h-full"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-white bg-red-500 rounded-full p-1"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-full max-w-xs px-4 text-center">
                      <div className="w-full bg-neutral-200/50 rounded-full h-1.5">
                        <div
                          className="bg-white h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${filePreview.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                {filePreview.error && (
                  <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs text-center p-1">
                    {filePreview.error}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className="w-full bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-neutral-400 disabled:cursor-not-allowed"
          >
            {isUploading
              ? `Uploading ${files.length} images...`
              : `Upload ${files.length} image(s)`}
          </button>
        </div>
      )}
    </div>
  );
}
