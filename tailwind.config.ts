import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'rca-green': {
          DEFAULT: '#228B22', // Forest Green
          dark: '#1a6b1a',
          light: '#2ea02e',
        },
        'rca-black': {
          DEFAULT: '#1a1a1a',
          light: '#2d2d2d',
        },
      },
    },
  },
  plugins: [],
};

export default config;
