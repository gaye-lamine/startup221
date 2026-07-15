import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#E6F4EA",     // Super light green
          100: "#CEEAD6",    // Light green
          200: "#81C995",
          300: "#58A55C",
          400: "#34A853",
          500: "#0C8A4D",    // Vivid Green ("SN")
          600: "#0A7541",
          700: "#086136",
          800: "#064D2B",
          950: "#0E3A2C",    // Forest Ink
          active: "#0C8A4D", // Vivid Green ("SN")
          dark: "#0E3A2C",   // Forest Ink
          gold: "#F2B705",   // Gold Accent
          paper: "#F7F3E8",  // Light Paper background
          light: "#EAF6EF",  // Soft light green button / background
        },
        accent: {
          fintech: {
            bg: "#E8F9EE",
            text: "#17A34A",
          },
          healthtech: {
            bg: "#EEF9FF",
            text: "#0284C7",
          },
          agritech: {
            bg: "#F3EFFF",
            text: "#6366F1",
          },
          edtech: {
            bg: "#FFF8EC",
            text: "#D97706",
          },
          logistique: {
            bg: "#EBF3FF",
            text: "#3B82F6",
          },
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
