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
          navy: {
            DEFAULT: '#002B5C',
            dark: '#001D3D',
            light: '#003B71',
            50: '#F0F6FC',
            100: '#E1EDF8',
            200: '#B8D6F2',
          },
          green: {
            DEFAULT: '#70B32D',
            forest: '#528521',
            light: '#86D636',
            50: '#F0FDF4',
            100: '#DCFCE7',
          },
          blue: {
            DEFAULT: '#005696',
            dark: '#003B71',
            light: '#007AA8',
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
