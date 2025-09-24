"use client";

import { useState } from "react";

type Props = {
  url: string;
  title: string;
};

export default function ShareActions({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : url;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const tw = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="flex items-center gap-2">
      <a
        href={tw}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50"
      >
        Share on X
      </a>
      <a
        href={li}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50"
      >
        Share on LinkedIn
      </a>
      <button
        onClick={copy}
        className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50"
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
