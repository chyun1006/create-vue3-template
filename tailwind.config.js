/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          50: 'color-mix(in oklch, var(--primary), white 95%)',
          100: 'color-mix(in oklch, var(--primary), white 90%)',
          200: 'color-mix(in oklch, var(--primary), white 80%)',
          300: 'color-mix(in oklch, var(--primary), white 60%)',
          400: 'color-mix(in oklch, var(--primary), white 40%)',
          500: 'var(--primary)',
          600: 'color-mix(in oklch, var(--primary), black 10%)',
          700: 'color-mix(in oklch, var(--primary), black 20%)',
          800: 'color-mix(in oklch, var(--primary), black 40%)',
          900: 'color-mix(in oklch, var(--primary), black 60%)',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
  // 确保 Tailwind 不会与 Element Plus 样式冲突
  corePlugins: {
    preflight: true,
  },
}
