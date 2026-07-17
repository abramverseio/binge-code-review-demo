/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        buttercup: {
          50: '#fefce8',
          100: '#fff9c4',
          400: '#fbe14d',
          500: '#f5d020',
          600: '#d6ab0f',
          700: '#a6820c',
        },
      },
    },
  },
  plugins: [],
};
