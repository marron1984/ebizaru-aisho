import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif JP"', '"Hiragino Mincho ProN"', '"YuMincho"', 'serif'],
        sans: ['"Inter"', '"Noto Sans JP"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SFMono-Regular"', 'monospace'],
      },
      colors: {
        ink: "#1a1a1a",
        paper: "#fafaf7",
        sage: {
          50: "#f3f5ee",
          100: "#e3e8d6",
          200: "#c9d1b1",
          300: "#a9b687",
          400: "#8a9966",
          500: "#6e7d4f",
          600: "#54623c",
          700: "#414c2f",
          800: "#333b26",
          900: "#272d1d",
        },
        sand: {
          50: "#f8f4ec",
          100: "#ece2cc",
          200: "#dac7a3",
          300: "#c7ab7b",
          400: "#b59059",
          500: "#9a7843",
        },
        rust: "#b56b4b",
        midnight: "#0e0e0c",
      },
      letterSpacing: {
        editorial: "0.18em",
      },
    },
  },
  plugins: [],
};

export default config;
