/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // blue-600
        secondary: '#1E40AF', // blue-800
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
