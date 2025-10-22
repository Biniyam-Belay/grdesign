import Image, { ImageProps } from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, "quality" | "loading"> {
  priority?: boolean;
  quality?: number;
}

/**
 * Optimized Image component with better defaults for performance
 */
export default function OptimizedImage({
  quality = 85,
  priority = false,
  placeholder = "blur",
  blurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==",
  alt,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      quality={quality}
      loading={priority ? undefined : "lazy"}
      priority={priority}
      placeholder={props.src.toString().startsWith("data:") ? undefined : placeholder}
      blurDataURL={props.src.toString().startsWith("data:") ? undefined : blurDataURL}
    />
  );
}
