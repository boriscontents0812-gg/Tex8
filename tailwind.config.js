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
        darkBg: '#0b0f19',
        cardBg: '#131926',
        cardBorder: '#1e293b',
        inputBg: '#090d16',
        accentBlue: '#2563eb',
        accentHover: '#1d4ed8',
        iosBlue: '#007aff',
        iosGray: '#e9e9eb',
        iosDarkGray: '#26252a',
        waGreen: '#005c4b',
        waLightGreen: '#dcf8c6',
        waDarkGreen: '#025144',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
