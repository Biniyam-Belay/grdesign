"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import type { FileObject } from "@supabase/storage-js";
import Image from "next/image";

interface MediaLibraryModalProps {
  bucket: "project-images" | "blog-images" | "works" | "testimonials";
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string | string[]) => void;
  multiple?: boolean;
}

const BUCKET_URL_PREFIX = process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/";

export default function MediaLibraryModal({
  bucket,
  isOpen,
  onClose,
  onSelect,
  multiple = false,
}: MediaLibraryModalProps) {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [selectedFileUrls, setSelectedFileUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseClient();

  const fetchFiles = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list("", { limit: 100, offset: 0, sortBy: { column: "created_at", order: "desc" } });
      if (error) throw error;
      setFiles(data || []);
    } catch (err) {
      setError((err as Error).message || "Failed to fetch files.");
    } finally {
      setLoading(false);
    }
  }, [bucket, isOpen, supabase.storage]);

  useEffect(() => {
    fetchFiles();
    setSelectedFileUrls([]); // Reset selection when modal opens/bucket changes
  }, [fetchFiles]);

  const handleDelete = async (filePath: string) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this image? This action cannot be undone.",
      )
    )
      return;
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) throw error;
      fetchFiles();
    } catch (err) {
      alert("Failed to delete file: " + (err as Error).message);
    }
  };

  const handleSingleSelect = (file: FileObject) => {
    const publicUrl = BUCKET_URL_PREFIX + bucket + "/" + file.name;
    onSelect(publicUrl);
    onClose();
  };

  const toggleMultiSelect = (file: FileObject) => {
    const publicUrl = BUCKET_URL_PREFIX + bucket + "/" + file.name;
    setSelectedFileUrls((prev) =>
      prev.includes(publicUrl) ? prev.filter((url) => url !== publicUrl) : [...prev, publicUrl],
    );
  };

  const handleMultiSelectConfirm = () => {
    onSelect(selectedFileUrls);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-6 border-b border-neutral-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-neutral-900">
            Media Library:{" "}
            <span className="capitalize font-mono bg-neutral-100 px-2 py-1 rounded-md">
              {bucket}
            </span>
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100">
            <svg
              className="w-6 h-6 text-neutral-600"
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
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {loading && <div className="text-center">Loading media...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}
          {!loading && !error && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {files.map((file) => {
                const publicUrl = BUCKET_URL_PREFIX + bucket + "/" + file.name;
                const isSelected = selectedFileUrls.includes(publicUrl);
                return (
                  <div
                    key={file.id}
                    className="relative group aspect-square bg-neutral-100 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={publicUrl}
                      alt={file.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {multiple ? (
                      <div
                        onClick={() => toggleMultiSelect(file)}
                        className={`absolute inset-0 cursor-pointer ${isSelected ? "border-4 border-purple-600" : ""}`}
                      >
                        <div
                          className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 ${isSelected ? "bg-purple-600 border-purple-600" : "bg-white/50 border-neutral-400"}`}
                        >
                          {isSelected && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        <button
                          onClick={() => handleSingleSelect(file)}
                          className="w-full text-sm bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => handleDelete(file.name)}
                          className="w-full text-sm bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {!loading && files.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-lg font-semibold text-neutral-700">No images found</h3>
              <p className="text-neutral-500">
                This bucket is empty. Upload some images to see them here.
              </p>
            </div>
          )}
        </main>

        {multiple && (
          <footer className="flex-shrink-0 p-6 border-t border-neutral-200 bg-neutral-50 flex justify-end">
            <button
              onClick={handleMultiSelectConfirm}
              disabled={selectedFileUrls.length === 0}
              className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg disabled:bg-neutral-400"
            >
              {`Select ${selectedFileUrls.length} Image(s)`}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
