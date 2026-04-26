import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        brand: ['Anton', 'sans-serif'],
        mono: ['Oswald', 'sans-serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        accent: '#ff6a00',
        surface: '#111111',
        border: 'rgba(255,255,255,0.12)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [typography],
}
