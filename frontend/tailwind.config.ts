import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  container: {
    center: true,
    padding: '2rem',
    screens: {
      'sm': '100%',
      '2xl': '1400px',
    },
  },
  plugins: [],
} satisfies Config;
