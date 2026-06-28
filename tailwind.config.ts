import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#090b0f",
          900: "#0f1319",
          850: "#141922",
          800: "#1b2029"
        },
        gold: {
          300: "#f8d984",
          400: "#e8bd4f",
          500: "#c9962e"
        },
        emerald: {
          350: "#48e0a4"
        },
        rose: {
          400: "#f87171"
        },
        cyan: {
          300: "#67e8f9"
        }
      },
      boxShadow: {
        panel: "0 16px 48px rgba(0, 0, 0, 0.32)",
        card: "0 4px 16px rgba(0, 0, 0, 0.24)",
        glow: "0 0 24px rgba(72, 224, 164, 0.18)"
      },
      animation: {
        "fade-slide-up": "fadeSlideUp 0.35s ease-out both",
        "price-tick": "priceTick 0.4s ease-out",
        shimmer: "shimmer 1.4s ease-in-out infinite",
        "glow-emerald": "glowEmerald 3s ease-in-out infinite",
        "glow-gold": "glowGold 3.5s ease-in-out infinite",
        "dot-blink": "dotBlink 1.8s ease-in-out infinite"
      },
      keyframes: {
        fadeSlideUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        priceTick: {
          "0%": { opacity: "1" },
          "30%": { opacity: "0.6" },
          "100%": { opacity: "1" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        glowEmerald: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(72, 224, 164, 0)" },
          "50%": { boxShadow: "0 0 16px 2px rgba(72, 224, 164, 0.15)" }
        },
        glowGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(232, 189, 79, 0)" },
          "50%": { boxShadow: "0 0 12px 2px rgba(232, 189, 79, 0.12)" }
        },
        dotBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" }
        }
      },
      backdropBlur: {
        xs: "2px"
      }
    }
  },
  plugins: []
};

export default config;
