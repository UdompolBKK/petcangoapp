/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        // ============================================
        // CI Colors - PetCanGo Brand
        // แก้ไขสีหลักที่นี่เพื่ออัพเดททั้งเว็บไซต์
        // ============================================
        brand: {
          // Primary: Pink (#EC4798)
          primary: '#EC4798',
          'primary-light': '#F472B6',
          'primary-dark': '#DB2777',
          // Secondary: Orange (#FF9502)
          secondary: '#FF9502',
          'secondary-light': '#FBBF24',
          'secondary-dark': '#F59E0B',
          // Gradient colors
          'gradient-from': '#EC4798',
          'gradient-to': '#FF9502',
        },
        // Primary palette (Pink-based)
        primary: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4798', // Main CI color
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
        },
        // Secondary palette (Orange-based)
        secondary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#FF9502', // Main CI color
          600: '#F59E0B',
          700: '#D97706',
          800: '#B45309',
          900: '#92400E',
        },
        // เพิ่มสีที่ใช้ใน Dashboard
        success: {
          500: '#10B981',
          600: '#059669'
        },
        warning: {
          500: '#F59E0B',
          600: '#D97706'
        },
        danger: {
          500: '#EF4444',
          600: '#DC2626'
        },
        info: {
          500: '#3B82F6',
          600: '#2563EB'
        }
      },
      fontFamily: {
        sans: ['Prompt', 'ui-sans-serif', 'system-ui'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      backgroundColor: {
        'card': '#FFFFFF',
        'body': '#F9FAFB',
      },
      borderColor: {
        'default': '#E5E7EB',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
