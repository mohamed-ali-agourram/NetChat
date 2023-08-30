/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xl': { 'max': '1279px' },
      // => @media (max-width: 1279px) { ... }

      'lg': { 'max': '1023px' },
      // => @media (max-width: 1023px) { ... }

      'md': { 'max': '925px' },
      // => @media (max-width: 767px) { ... }

      'sm': { 'max': '639px' },
      // => @media (max-width: 639px) { ... }

      'xsm': { 'max': '320px' },
      // => @media (max-width: 320px) { ... }
    },
    extend: {
      padding: {
        "2px": "2px"
      },
      colors: {
        "main-bg": "#18171d",
        "second-bg": "#1c1c24",
        "loading": "#444040b0"
      }
    },
  },
  plugins: [

  ],
}
