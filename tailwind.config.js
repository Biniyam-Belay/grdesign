/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "Outfit", "sans-serif"],
        // Explicitly set all font categories to use Outfit
        serif: ["var(--font-outfit)", "Outfit", "serif"],
        mono: ["var(--font-outfit)", "Outfit", "monospace"],
        display: ["var(--font-outfit)", "Outfit", "sans-serif"],
        body: ["var(--font-outfit)", "Outfit", "sans-serif"],
      },
      colors: {
        brand: {
          yellow: "#EDFF00",
          orange: "#FC703C",
        },
      },
    },
  },
  // Tailwind v4: plugins are registered via `@plugin` in CSS (see app/globals.css)
};
