/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f06502",
        "primary-alt-1": "#f0863c",
        "primary-alt-2": "#f07016",
        secondary: "#f3f8fa",
      },
    },
  },
  plugins: [],
};
