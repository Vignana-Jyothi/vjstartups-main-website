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
        admin: {
          bg: "#050508",
          surface: "#0c0c14",
          panel: "#111120",
          border: "rgba(139, 92, 246, 0.12)",
          accent: "#7c3aed",
          "accent-light": "#8b5cf6",
          "accent-dim": "rgba(139, 92, 246, 0.15)",
          text: "#f1f5f9",
          muted: "#64748b",
          "muted-light": "#94a3b8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "admin-gradient": "linear-gradient(135deg, #0c0c14 0%, #0f0a1a 100%)",
        "violet-glow": "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
      },
      boxShadow: {
        "admin-card": "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.08)",
        "admin-hover": "0 4px 16px 0 rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.2)",
        "admin-glow": "0 0 20px rgba(139, 92, 246, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideIn: { from: { opacity: "0", transform: "translateX(-12px)" }, to: { opacity: "1", transform: "translateX(0)" } },
      },
    },
  },
  plugins: [],
};
