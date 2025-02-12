/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#1D9BF0",
          dark: "#1A8CD8",
          light: "#A7D8FC",
        },
        secondary: {
          DEFAULT: "#536471",
          dark: "#38444D",
          light: "#E7E9EA",
        },
        background: {
          light: "#F7F9F9",
          dark: "#15202B",
        },
        text: {
          light: "#0F1419",
          dark: "#E7E9EA",
          muted: "#71767B",
        },
        border: {
          light: "#EFF3F4",
          dark: "#2F3336",
        },
        error: {
          DEFAULT: "#F4212E",
        },
        success: {
          DEFAULT: "#00BA7C",
        },
        warning: {
          DEFAULT: "#FFAD1F",
        },
      },
    },
  },
  plugins: [],
};

export default config;
