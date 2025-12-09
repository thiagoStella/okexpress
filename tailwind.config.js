/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#1b1f24',
        'brand-secondary': '#22282f',
        'brand-red': '#ed1e22',
        'text-primary': '#ffffff',
        'text-secondary': '#c3cad5',
      },
    },
  },
  plugins: [],
}
