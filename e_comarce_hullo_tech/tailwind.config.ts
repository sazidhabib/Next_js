import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "star-blue": "#1e88e5",
        "star-dark-blue": "#1565c0",
        "star-light-gray": "#f5f5f5",
        "star-gray": "#e0e0e0",
        "star-text": "#333333",
        "star-red": "#e53935",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
