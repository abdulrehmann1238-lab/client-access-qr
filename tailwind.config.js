/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F6F3EE',
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#FBF9F5',
        },
        primary: {
          DEFAULT: '#1F4D45',
          hover: '#17403A',
          active: '#123530',
        },
        secondary: '#DCE7E1',
        accent: {
          DEFAULT: '#B5542F',
          soft: '#F4E3DA',
        },
        ink: {
          DEFAULT: '#1B2421',
          2: '#4A5753',
          muted: '#7A8680',
        },
        line: {
          DEFAULT: '#E3DED5',
          strong: '#CFC8BC',
        },
        clinical: {
          success: '#2F7A55',
          warning: '#A8741A',
          error: '#B03A2E',
          info: '#2F5F8A',
          focus: '#2B6CB0',
        },
        shell: {
          bg: '#ECE7DF',
          ink: '#1B2421',
          panel: '#F7F4EF',
        }
      },
      fontFamily: {
        heading: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'phone': '44px',
      },
      boxShadow: {
        'sh-1': '0 1px 0 rgba(27,36,33,.04), 0 1px 2px rgba(27,36,33,.05)',
        'sh-2': '0 6px 20px rgba(27,36,33,.08)',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'row-insert': {
          '0%': { transform: 'translateY(-8px)', backgroundColor: '#E8F1EC' },
          '100%': { transform: 'translateY(0)', backgroundColor: 'transparent' },
        }
      },
      animation: {
        shake: 'shake 320ms cubic-bezier(.36,.07,.19,.97) both',
        'fade-in': 'fade-in 200ms ease-out forwards',
        'slide-up': 'slide-up 240ms ease-out forwards',
        'row-insert': 'row-insert 1.6s ease-out forwards',
      }
    },
  },
  plugins: [],
}
