/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
      colors: {
        sage: {
          50:  '#f4f7f4',
          100: '#e6ede6',
          200: '#cddccd',
          300: '#a8c2a8',
          400: '#7da07d',
          500: '#5a825a',
          600: '#456745',
          700: '#385338',
          800: '#2e432e',
          900: '#263826',
        },
        blush: {
          50:  '#fdf5f3',
          100: '#fce8e3',
          200: '#fad0c7',
          300: '#f5ada0',
          400: '#ed7d6a',
          500: '#e05540',
          600: '#cc3d28',
          700: '#ab311f',
          800: '#8d2b1d',
          900: '#75271c',
        },
        sky: {
          50:  '#f0f7ff',
          100: '#ddeeff',
          200: '#b3daff',
          300: '#80bfff',
          400: '#4d9fe5',
          500: '#2980c9',
          600: '#1d67aa',
          700: '#19528a',
          800: '#184571',
          900: '#193a5e',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
