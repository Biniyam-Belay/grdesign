export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  {
    href: "#",
    label: "Services",
    submenu: [
      {
        href: "/services/graphic-design",
        label: "Graphic Design",
        description: "Visual storytelling that captivates",
      },
      {
        href: "/services/branding",
        label: "Branding",
        description: "Identity systems that resonate",
        badge: "Trending",
      },
      {
        href: "/services/social-media",
        label: "Social Media Design",
        description: "Content that drives engagement",
        badge: "Popular",
      },
      {
        href: "/services/web-development",
        label: "Web Development",
        description: "Digital experiences that convert",
      },
    ],
  },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export const SERVICES = [
  {
    slug: "graphic-design",
    title: "Graphic Design",
    description: "Visual storytelling that captivates.",
    delivery: {
      min: 3,
      max: 7,
      unit: "days",
    },
    scope: "Includes logo design, social media graphics, and other visual assets.",
    features: ["Logo & Mark Design", "Brand Guidelines", "Color Palette", "Typography System"],
    badge: "",
    popular: false,
  },
  {
    slug: "branding",
    title: "Branding",
    description: "Identity systems that resonate.",
    delivery: {
      min: 1,
      max: 2,
      unit: "weeks",
    },
    scope: "Includes logo, style guide, and brand strategy.",
    features: ["User Research", "Wireframing", "UI Design", "Prototyping"],
    badge: "Trending",
    popular: false,
  },
  {
    slug: "social-media",
    title: "Social Media Design",
    description: "Content that drives engagement.",
    delivery: {
      min: 5,
      max: 10,
      unit: "days",
    },
    scope: "Includes a set of social media templates and content creation for one platform.",
    features: ["Social Templates", "Campaign Design", "Content Strategy", "Brand Consistency"],
    badge: "Popular",
    popular: true,
  },
  {
    slug: "web-development",
    title: "Web Development",
    description: "Digital experiences that convert.",
    delivery: {
      min: 2,
      max: 4,
      unit: "weeks",
    },
    scope: "Includes a fully responsive website with up to 5 pages.",
    features: ["Responsive Design", "SEO Optimized", "Fast Loading", "CMS Integration"],
    badge: "",
    popular: false,
  },
];
