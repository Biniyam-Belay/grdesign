export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Blog validation
export function validateBlog(data: {
  title: string;
  slug: string;
  excerpt: string;
  cover: string;
  content: string;
  date: string;
  tags: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  // Title validation
  if (!data.title.trim()) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (data.title.length < 3) {
    errors.push({ field: "title", message: "Title must be at least 3 characters long" });
  } else if (data.title.length > 200) {
    errors.push({ field: "title", message: "Title must be less than 200 characters" });
  }

  // Slug validation
  if (!data.slug.trim()) {
    errors.push({ field: "slug", message: "Slug is required" });
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    errors.push({
      field: "slug",
      message: "Slug must be lowercase with hyphens only (e.g., my-blog-post)",
    });
  }

  // Excerpt validation
  if (!data.excerpt.trim()) {
    errors.push({ field: "excerpt", message: "Excerpt is required" });
  } else if (data.excerpt.length < 10) {
    errors.push({ field: "excerpt", message: "Excerpt must be at least 10 characters long" });
  } else if (data.excerpt.length > 500) {
    errors.push({ field: "excerpt", message: "Excerpt must be less than 500 characters" });
  }

  // Cover image validation
  if (!data.cover.trim()) {
    errors.push({ field: "cover", message: "Cover image is required" });
  } else {
    const cover = data.cover.trim();
    const isRootRelative = cover.startsWith("/");
    const isDataUrl = cover.startsWith("data:image/");
    let isAbsoluteUrl = false;
    try {
      // new URL throws on relative paths; treat absolute URLs as valid
      // e.g., https://xyz.supabase.co/storage/v1/object/public/bucket/key
      new URL(cover);
      isAbsoluteUrl = true;
    } catch {
      isAbsoluteUrl = false;
    }
    if (!isAbsoluteUrl && !isRootRelative && !isDataUrl) {
      errors.push({ field: "cover", message: "Cover image must be a valid URL or /path" });
    }
  }

  // Content validation
  if (!data.content.trim()) {
    errors.push({ field: "content", message: "Content is required" });
  } else if (data.content.length < 50) {
    errors.push({ field: "content", message: "Content must be at least 50 characters long" });
  }

  // Date validation
  if (!data.date) {
    errors.push({ field: "date", message: "Publication date is required" });
  } else {
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
      errors.push({ field: "date", message: "Invalid date format" });
    }
  }

  // Tags validation (optional but if provided, should be valid)
  if (data.tags.trim()) {
    const tags = data.tags.split(",").map((tag) => tag.trim());
    if (tags.length > 10) {
      errors.push({ field: "tags", message: "Maximum 10 tags allowed" });
    }
    if (tags.some((tag) => tag.length > 30)) {
      errors.push({ field: "tags", message: "Each tag must be less than 30 characters" });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Project validation
export function validateProject(data: {
  title: string;
  slug: string;
  excerpt: string;
  thumb: string;
  type: string;
  roles: string;
  tools: string;
  highlights: string;
  deliverables: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  // Title validation
  if (!data.title.trim()) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (data.title.length < 3) {
    errors.push({ field: "title", message: "Title must be at least 3 characters long" });
  } else if (data.title.length > 200) {
    errors.push({ field: "title", message: "Title must be less than 200 characters" });
  }

  // Slug validation
  if (!data.slug.trim()) {
    errors.push({ field: "slug", message: "Slug is required" });
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    errors.push({
      field: "slug",
      message: "Slug must be lowercase with hyphens only (e.g., my-project)",
    });
  }

  // Excerpt validation
  if (!data.excerpt.trim()) {
    errors.push({ field: "excerpt", message: "Excerpt is required" });
  } else if (data.excerpt.length < 10) {
    errors.push({ field: "excerpt", message: "Excerpt must be at least 10 characters long" });
  } else if (data.excerpt.length > 500) {
    errors.push({ field: "excerpt", message: "Excerpt must be less than 500 characters" });
  }

  // Thumbnail validation
  if (!data.thumb.trim()) {
    errors.push({ field: "thumb", message: "Thumbnail image is required" });
  } else {
    const thumb = data.thumb.trim();
    const isRootRelative = thumb.startsWith("/");
    const isDataUrl = thumb.startsWith("data:image/");
    let isAbsoluteUrl = false;
    try {
      new URL(thumb);
      isAbsoluteUrl = true;
    } catch {
      isAbsoluteUrl = false;
    }
    if (!isAbsoluteUrl && !isRootRelative && !isDataUrl) {
      errors.push({ field: "thumb", message: "Thumbnail must be a valid URL or /path" });
    }
  }

  // Type validation
  const validTypes = ["branding", "social", "ui-ux", "web-dev", "print"];
  if (!validTypes.includes(data.type)) {
    errors.push({ field: "type", message: "Please select a valid project type" });
  }

  // Roles validation
  if (!data.roles.trim()) {
    errors.push({ field: "roles", message: "At least one role is required" });
  } else {
    const roles = data.roles
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);
    if (roles.length === 0) {
      errors.push({ field: "roles", message: "At least one role is required" });
    }
  }

  // Tools validation
  if (!data.tools.trim()) {
    errors.push({ field: "tools", message: "At least one tool is required" });
  } else {
    const tools = data.tools
      .split(",")
      .map((tool) => tool.trim())
      .filter(Boolean);
    if (tools.length === 0) {
      errors.push({ field: "tools", message: "At least one tool is required" });
    }
  }

  // Highlights validation
  if (!data.highlights.trim()) {
    errors.push({ field: "highlights", message: "At least one highlight is required" });
  } else {
    const highlights = data.highlights
      .split("\n")
      .map((h) => h.trim())
      .filter(Boolean);
    if (highlights.length === 0) {
      errors.push({ field: "highlights", message: "At least one highlight is required" });
    }
  }

  // Deliverables validation
  if (!data.deliverables.trim()) {
    errors.push({ field: "deliverables", message: "At least one deliverable is required" });
  } else {
    const deliverables = data.deliverables
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);
    if (deliverables.length === 0) {
      errors.push({ field: "deliverables", message: "At least one deliverable is required" });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Get error for specific field
export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find((error) => error.field === field)?.message;
}
