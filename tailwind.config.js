/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sesi: {
          blue: {
            DEFAULT: '#003B71',
            dark: '#002548',
            light: '#005696',
            50: '#F0F6FC',
            100: '#E1EDF8',
            200: '#B8D6F2',
            600: '#005696',
            700: '#003B71',
            800: '#00284D',
            900: '#001A33',
          },
          red: {
            DEFAULT: '#E30613',
            dark: '#B0040E',
            light: '#FF3340',
            50: '#FEF2F2',
            100: '#FEE2E2',
            500: '#E30613',
            600: '#C70510',
          },
          cyan: {
            DEFAULT: '#00A3E0',
            light: '#40BFEF',
            dark: '#007AA8',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 59, 113, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 30px -4px rgba(0, 59, 113, 0.15), 0 4px 10px -2px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 25px rgba(0, 91, 163, 0.25)',
      }
    },
  },
  plugins: [],
}
