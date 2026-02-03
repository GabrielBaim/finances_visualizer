/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          dark: '#8b5cf6',
        },
        income: '#10b981',
        expense: '#f43f5e',
        background: '#0f172a',
      },
    },
  },
  plugins: [],
}
