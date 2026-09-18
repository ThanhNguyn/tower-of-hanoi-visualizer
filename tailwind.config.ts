import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#090d13",
          900: "#0d131c",
          850: "#111924",
          800: "#16202d",
          700: "#203044"
        },
        copper: {
          300: "#f2ca9a",
          400: "#e7ad72",
          500: "#cf844c"
        },
        signal: {
          blue: "#86b7ff",
          green: "#77d8ad",
          red: "#f28e9c"
        }
      },
      fontFamily: {
        sans: ["Archivo", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        panel: "0 18px 42px -28px rgba(0, 0, 0, 0.92)",
        float: "0 24px 50px -32px rgba(0, 0, 0, 0.98)"
      },
      keyframes: {
        "trace-pulse": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" }
        },
        "success-stamp": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        }
      },
      animation: {
        "trace-pulse": "trace-pulse 1.8s ease-in-out infinite",
        "success-stamp": "success-stamp 300ms cubic-bezier(0.16, 1, 0.3, 1) both"
      }
    }
  },
  plugins: []
} satisfies Config;
