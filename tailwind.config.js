export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        }
      },
      animation: {
        'bounce-slow': 'bounce 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'sway': 'sway 8s ease-in-out infinite',
        'slide-right': 'slideRight 20s linear infinite',
        'slide-left': 'slideLeft 25s linear infinite',
        'rotate-slow': 'rotateSlow 30s linear infinite',
        'fade-in-out': 'fadeInOut 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(2deg)' },
          '75%': { transform: 'rotate(-2deg)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(calc(100vw + 100%))' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(calc(100vw + 100%))' },
          '100%': { transform: 'translateX(-100%)' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fadeInOut: {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 0.8 },
        },
      }
    },
  },
  plugins: [],
}