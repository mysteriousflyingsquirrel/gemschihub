/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chnebel-red': '#ED1B24',
        'chnebel-black': '#000000',
        'chnebel-white': '#FFFFFF',
        'chnebel-gray': '#F5F5F5',
      },
    },
  },
  plugins: [],
}

