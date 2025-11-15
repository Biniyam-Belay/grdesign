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
