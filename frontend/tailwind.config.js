/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{'shopper':"url('/fundo.webp')"},
      boxShadow:{'shopper-card':"3px 3px 8px 0px #000"}
    },
  },
  plugins: [],
}