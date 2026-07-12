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
          50: "#eff2fe",
          100: "#e0e6fc",
          200: "#c7d2fa",
          300: "#a5b4f7",
          400: "#8193f3",
          500: "#5a6eef",
          600: "#3d4de5",
          700: "#313ccf",
          800: "#2b33a8",
          900: "#272e86",
          active: "#3545E6", // Exact blue color from mockup button
          light: "#E1E6FF",  // Background for "Voir le profil"
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
