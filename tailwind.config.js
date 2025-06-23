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
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 10s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'shine': 'shine 1s ease-in-out',
        'bg-pos': 'bg-position 8s infinite linear',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 0.3 },
        },
        'float': {
          '0%, 100%': { transform: 'translate(10%, 10%)' },
          '50%': { transform: 'translate(13%, 13%)' },
        },
        'blink': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        'shine': {
          '0%': { width: '0%', left: '-10%' },
          '100%': { width: '40%', left: '100%' },
        },
        'bg-position': {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backgroundSize: {
        '200': '200% auto',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [
    // line-clamp is now included by default in Tailwind CSS v3.3+
  ],
}
