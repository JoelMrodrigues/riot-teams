/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#7C3AED',
          light:   '#A78BFA',
          dark:    '#5B21B6',
        },
        lol: {
          gold: '#C89B3C',
          dark: '#0A1428',
        },
        valorant: {
          red:  '#FF4655',
          dark: '#0F0E0E',
        },
        tft: {
          purple: '#9B72CF',
          dark:   '#0D0B1A',
        },
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
