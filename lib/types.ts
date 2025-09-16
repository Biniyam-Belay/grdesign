export type Project = {
  slug: string;
  title: string;
  excerpt: string;
  /**
   * Image thumbnail shown in grids/cards. Should always be an image format (jpg/png/webp/svg).
   * Even if a video is provided, this still renders as the preview in listings.
   */
  thumb: string;
  /** Optional video source that can be used on detail pages (not auto-played in cards) */
  video?: string;
  roles: string[];
  tools?: string[];
  alt?: string;
  credits?: string;
  gallery?: Array<{ src: string; alt: string }>;
  // Optional rich content fields for the case study page
  problem?: string;
  solution?: string;
  highlights?: string[];
  approach?: string;
  process?: Array<{ title: string; body: string }>;
  outcome?: string;
  deliverables?: string[];
  // Optional meta for sidebar
  year?: number | string;
  client?: string;
};
