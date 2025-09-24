"use client";

import { useState } from "react";
import { Copy, Check, Linkedin, Twitter } from "lucide-react";

type Props = {
  url: string;
  title?: string;
  className?: string;
};

export default function ShareButtons({ url, title = "", className }: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // show feedback for 2 seconds
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const baseBtnStyles =
    "inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-3 h-9 text-xs text-neutral-700 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400";

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={baseBtnStyles}
      >
        <Twitter className="h-4 w-4" />
        <span>X</span>
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={baseBtnStyles}
      >
        <Linkedin className="h-4 w-4" />
        <span>LinkedIn</span>
      </a>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Link copied" : "Copy link"}
        className={`${baseBtnStyles} min-w-[90px] ${copied ? "text-green-600 border-green-200 bg-green-50" : ""}`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
}
