import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', '"Anton"', '"Noto Sans JP"', "Impact", "sans-serif"],
        sans: ['"Noto Sans JP"', '"Inter"', "system-ui", "sans-serif"],
        kanji: ['"Noto Sans JP"', '"Hiragino Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', '"SFMono-Regular"', "monospace"],
        serif: ['"Noto Serif JP"', "serif"],
      },
      colors: {
        ebi: {
          50:  "#fff1ee",
          100: "#ffdfd6",
          200: "#ffb7a3",
          300: "#ff8a6c",
          400: "#ff5c3a",
          500: "#e63232", // 海老の赤
          600: "#c41f1f",
          700: "#9a1414",
          800: "#6e0e0e",
          900: "#430909",
        },
        cream: {
          50:  "#fffaee",
          100: "#fff3d5",
          200: "#ffe8a8",
          DEFAULT: "#fff8e8",
        },
        sun: {
          DEFAULT: "#ffd23f",
          dark: "#f6b800",
        },
        pop: {
          pink: "#ff5b8d",
          cyan: "#3ec1d3",
          violet: "#7a5cff",
          lime:  "#b8e22f",
        },
        ink: "#0a0a0a",
        navy: "#0a1846",
        paper: "#fff8e8",
      },
      boxShadow: {
        patch: "3px 3px 0 0 #0a0a0a",
        patchLg: "5px 5px 0 0 #0a0a0a",
        patchRed: "3px 3px 0 0 #c41f1f",
      },
      letterSpacing: {
        editorial: "0.18em",
      },
    },
  },
  plugins: [],
};

export default config;
