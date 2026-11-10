/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        uniqtek: {
          red: '#E21B23',
          redDark: '#C11219',
          navy: '#1E3A8A',
          blue: '#2563EB',
          blueSea: '#006994',
        }
      }
    },
  },
  plugins: [],
}
