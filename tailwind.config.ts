import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // core palette — lifted verbatim from the mockup CSS variables
        ink: {
          1: "#050B14", // deepest black
          2: "#0A1628", // midnight navy — dominant bg
          3: "#0F1E36", // raised surface
          4: "#16294A", // card surface
        },
        line: "#1F3461", // hairline divider
        gold: {
          1: "#F4D58F", // gold highlight
          2: "#D4A74A", // gold mid (primary accent)
          3: "#9C7325", // gold shadow
          4: "#5C4416", // gold dark — borders on cards
        },
        cream: {
          DEFAULT: "#F5EDD8", // warm off-white text
          2: "#E4D9BB", // muted cream
        },
        mute: {
          DEFAULT: "#8A93A6", // muted ui text
          2: "#4A5470", // deep muted
        },
        ok: "#4ADE80",
        warn: "#F59E0B",
        err: "#EF4444",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "22px",
      },
      boxShadow: {
        card: "0 30px 60px -20px rgba(0,0,0,.6), 0 0 0 1px rgba(244,213,143,.08) inset",
        gold: "0 10px 40px -10px rgba(212,167,74,.45)",
        "gold-hover": "0 20px 50px -10px rgba(212,167,74,.55)",
      },
      backgroundImage: {
        "gold-grad":
          "linear-gradient(135deg, #F4D58F 0%, #D4A74A 35%, #9C7325 70%, #D4A74A 100%)",
        "gold-grad-soft":
          "linear-gradient(135deg, rgba(244,213,143,.18) 0%, rgba(212,167,74,.08) 100%)",
      },
      letterSpacing: {
        wider2: ".12em",
        widest2: ".22em",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        livePulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".4" },
        },
        pendingPulse: {
          "0%": { transform: "scale(1)", opacity: ".8" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        livePulse: "livePulse 1.6s ease-in-out infinite",
        pendingPulse: "pendingPulse 2.6s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
