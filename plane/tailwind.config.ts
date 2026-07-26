/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        plane: {
          bg: "#0b0e14",
          surface: "#121721",
          panel: "#1a212d",
          border: "rgba(56, 189, 248, 0.12)",
          accent: "#0ea5e9",
          "accent-light": "#38bdf8",
          text: "#f8fafc",
          muted: "#64748b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
