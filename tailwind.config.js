/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  darkMode: 'class', // Apply dark: styles only when a .dark class exists on an ancestor element
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        // primary: '#e7b008',
        primary: '#ff0000',

        /** from stitch(alex) */
        'background-light': '#f8f8f5',
        'background-dark': '#121212',

        /** semantic aliases */
        surface: {
          DEFAULT: '#f8f8f5', // - *-background-light + *-surface
          dark: '#121212', // - *-background-dark + *-surface-dark
        },

        card: {
          DEFAULT: '#ffffff',
          dark: '#1E1E1E',
        },

        border: {
          DEFAULT: '#e5e7eb',
          dark: '#2A2A2A',
        },

        system: {
          'success': '#16a34a',
          'warn': '#eab308',
          'error': '#ef4444',
        },
      },

      textColor: {
        primary: '#0f172a',
        secondary: '#64748b',
        inverted: '#ffffff',
      },

      fontFamily: {
        /* instead that -> 'robotomono-normal': ['RobotoMono-Regular', 'monospace'],
        this -> - robotomono-normal + font-base font-normal */
        base: ['Roboto Mono', 'monospace'],
        heading: ['Roboto Mono', 'monospace'],
        code: ['Roboto Mono', 'monospace'],
      },

      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },

      keyframes: {
        'menu-open-1': {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
        'menu-close-1': {
          '0%': { transform: 'scaleY(1)' },
          '100%': {
            transform: 'scaleY(0)',
            display: 'none',
          },
        },
        'menu-open-2': {
          '0%': { transform: 'scaleY(0)' },
          '70%': { transform: 'scaleY(1.3)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },

      animation: {
        'dropdown-menu-open':
          'menu-open-1 0.5s ease-in-out forwards',
        'dropdown-menu-close':
          'menu-close-1 0.5s ease-in-out forwards',
        'aside-menu-open':
          'menu-open-2 0.5s ease-in-out forwards',
      },

      strokeWidth: {
        '1': '1',
        '2': '2',
        '4': '4',
        '8': '8',
      },
    },
  },
  plugins: [],
}
