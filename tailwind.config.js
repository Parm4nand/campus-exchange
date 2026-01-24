/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Blue theme colors
        'primary': '#007AFF',      // Apple Blue
        'primary-dark': '#0056CC',  // Darker blue
        'primary-light': '#5AC8FA', // Lighter blue
        'primary-50': '#E8F3FF',    // Very light blue background
        'primary-100': '#D6E9FF',
        'primary-200': '#B3D4FF',
        'primary-300': '#80BDFF',
        'primary-400': '#4DA6FF',
        'primary-500': '#007AFF',
        'primary-600': '#0056CC',
        'primary-700': '#004099',
        'primary-800': '#002B66',
        'primary-900': '#001533',
        
        // Gray scale for text
        'dark': '#1D1D1F',
        'gray': {
          50: '#F5F5F7',
          100: '#E5E5E7',
          200: '#D1D1D6',
          300: '#C7C7CC',
          400: '#AEAEB2',
          500: '#8E8E93',
          600: '#636366',
          700: '#48484A',
          800: '#3A3A3C',
          900: '#1D1D1F',
        },
        
        // Functional colors (kept minimal)
        'success': '#34C759',
        'warning': '#FF9500',
        'error': '#FF3B30',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 2px 16px rgba(0, 122, 255, 0.08)',
        'card-hover': '0 8px 32px rgba(0, 122, 255, 0.12)',
        'elevated': '0 4px 24px rgba(0, 122, 255, 0.1)',
        'bottom-nav': '0 -2px 20px rgba(0, 122, 255, 0.05)',
        'inner-blue': 'inset 0 2px 4px rgba(0, 122, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
        'gradient-light': 'linear-gradient(135deg, #E8F3FF 0%, #FFFFFF 100%)',
        'gradient-card': 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale': 'scale 0.2s ease-in-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
