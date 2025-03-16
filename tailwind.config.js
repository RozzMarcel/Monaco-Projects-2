/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'monaco-bronze': '#996D45',
        'monaco-bronze-light': '#B08E6E',
      },
    },
  },
  plugins: [],
}