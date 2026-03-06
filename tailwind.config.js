/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.njk',
    './js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a1628',
          800: '#0f1f3d',
          700: '#152a4a',
          600: '#1a3558',
        },
        brand: {
          blue: '#046bd2',
          'blue-dark': '#045cb4',
          light: '#f4f6f8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
