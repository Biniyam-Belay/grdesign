export type Project = {
  slug: string;
  title: string;
  excerpt: string;
  thumb: string;
  video?: string;
  roles: string[];
  tools?: string[];
  alt?: string;
  credits?: string;
  gallery?: Array<{ src: string; alt: string }>;
};
