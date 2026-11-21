import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#115DFB',
        'primary-dark': '#0B3589',
        'primary-light': '#83ACFF',
        'primary-soft': '#EAF0FF',
        pink: '#FF60C3',
        'pink-dark': '#D94BA5',
        'pink-soft': '#FFF0F8',
        mint: '#00E297',
        yellow: '#FFEB40',
        surface: '#F2F5F9',
        surfaceAlt: '#EBEFF2',
        line: '#E4E6EB',
        ink: '#111827',
        muted: '#6B7280',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['Rubik', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 12px 30px rgba(17, 93, 251, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
