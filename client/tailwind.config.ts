// import type { Config } from "tailwindcss";

// import plugin from "tailwindcss/plugin";

// const config: Config = {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       backgroundImage: {
//         darkSlash: "url('../../public/images/general/dark_slash.png')",
//         lightSlash: "url('../../public/images/general/light_slash.png')",
//       },
//       content: {
//         darkSlash: "url('../../public/images/general/dark_slash.png')",
//         lightSlash: "url('../../public/images/general/light_slash.png')",
//       },

//       keyframes: {
//         smooth: {
//           "0%": { opacity: "0" },
//           "100%": { opacity: "1" },
//         },
//         carousel: {
//           // to: { transform: 'translate(calc(-50% - 23vw))' },
//           "0%": { transform: "translateX(0%)" },
//           "100%": { transform: "translateX(-100%)" },
//         },
//         carouselSlow: {
//           // to: { transform: 'translate(calc(-50% - 23vw))' },
//           "0%": { transform: "translateX(0%)" },
//           "100%": { transform: "translateX(-50%)" },
//         },
//       },
//       animation: {
//         "spin-slow": "spin 8s linear infinite",
//         "appear": "smooth 0.6s cubic-bezier(0.83, 0, 0.17, 1)",
//         "carousel": "carousel 7s linear infinite backwards",
//         "carousel-slow": "carousel 20s linear infinite backwards",
//         "carousel-slower": "carouselSlow 220s linear infinite backwards",
//       },
//     },
//   },
//   plugins: [
//     plugin(({ addBase, theme }: { addBase: any; theme: any }) => {
//       addBase({
//         ".scrollbar::-webkit-scrollbar": {
//           width: "3px",
//         },
//         ".scrollbar::-webkit-scrollbar-track": {
//           backgroundColor: "transparent",
//         },
//         ".scrollbar.scrollLight::-webkit-scrollbar-thumb": {
//           backgroundColor: "rgba(172, 72, 0, 0.8)",
//         },
//         ".scrollbar.scrollDark::-webkit-scrollbar-thumb": {
//           backgroundColor: "rgba(245, 231, 211, 0.8)",
//         },
//       });
//     }),
//   ],
//   darkMode: "selector",
// };

// export default config;


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
      // colors: {
      //   white: {
      //     DEFAULT: '#fff',
      //     100: '#fce8ec', // Lighter variant
      //     200: '#f9d1d9', // Slightly lighter
      //     300: '#f6bac6', // Mid-light
      //     400: '#f3a3b3', // Mid-dark
      //     500: '#e55e72', // DEFAULT
      //     600: '#d84c61', // Slightly darker
      //     700: '#cb3a50', // Darker
      //     800: '#be283f', // Very dark
      //     900: '#b1162e', // Darkest
      //   },
      //   black: '#0e100f',
      //   dark: '#212121',
      //   grayish: '#333336',

      // },
    },
  },
}