import { Metadata } from "next";

type MetaProps = {
  title?: string;
  description?: string;
  image?: string;
};

export function generateMeta({
  title = "Bini.B",
  description = "A modern graphic design portfolio showcasing brand identity, editorial, and packaging design.",
  image = "/og-image.jpg", // Default OG image
}: MetaProps = {}): Metadata {
  const siteName = "Bini.B";
  const formattedTitle = title === "Bini.B" ? title : `${title} | ${siteName}`;

  return {
    title: formattedTitle,
    description,
    openGraph: {
      title: formattedTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description,
      images: [image],
    },
  };
}
