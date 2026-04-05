/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          light: "#818CF8",
        },
        secondary: {
          DEFAULT: "#7C3AED",
          light: "#A78BFA",
        },
        accent: {
          DEFAULT: "#10B981",
          light: "#34D399",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#1E293B",
        },
        background: {
          light: "#FAFAFA",
          dark: "#0F172A",
        },
        border: {
          light: "#E5E7EB",
          dark: "#334155",
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans SC", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      borderRadius: {
        card: "12px",
        button: "8px",
        input: "4px",
      },
      animation: {
        "fade-in": "fadeIn 300ms ease-out",
        "slide-in": "slideIn 200ms ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
