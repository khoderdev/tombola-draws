/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [],
  theme: {
    extend: {
      gridTemplateColumns: {
        15: "repeat(15, minmax(0, 1fr))",
      },
      gridTemplateRows: {
        7: "repeat(7, minmax(0, 1fr))",
      },
    },
  },
}