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
        // Main Color: #FF8E00 (Orange)
        // ============================================
        // Primary palette (Orange-based)
        primary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF8E00', // Main CI color
          600: '#E67E00',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
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
