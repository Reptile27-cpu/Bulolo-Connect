import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bulolo: {
          forest: '#1b4332',
          emerald: '#2d6a4f',
          green: '#40916c',
          lightgreen: '#d8f3dc',
          gold: '#d4af37',
          darkgold: '#b8860b',
          lightgold: '#fef3c7',
          charcoal: '#1a1f1d',
          slate: '#2e3834',
          muted: '#52605b',
          surface: '#f8faf9',
          border: '#e1e8e4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
};

export default config;
