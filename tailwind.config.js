/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d8ecff',
          500: '#246bfe',
          600: '#1f55d8',
          700: '#173fa7',
          800: '#132f7d',
          900: '#0d1f55',
        },
        youth: {
          50: '#e9fbf7',
          100: '#c9f5eb',
          500: '#12b89a',
          600: '#0e927c',
          700: '#0f6f61',
        },
        coral: {
          500: '#f9735b',
          600: '#e0523d',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
