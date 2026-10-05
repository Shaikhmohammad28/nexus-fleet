/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          tint: '#EEF2FF',
          dark: '#312E81',
        },
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#111827',
          cardLight: '#FFFFFF',
          cardDark: '#1E293B',
        },
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
        success: '#10B981',
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
        input: '10px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(79, 70, 229, 0.35)',
        'glow-teal': '0 0 25px -5px rgba(20, 184, 166, 0.35)',
      },
    },
  },
  plugins: [],
}
