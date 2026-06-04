/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lol: {
          gold: '#C89B3C',
          dark: '#0A1428',
          mid: '#0D2748',
        },
        valorant: {
          red: '#FF4655',
          dark: '#0F0E0E',
          mid: '#200A0F',
        },
        tft: {
          purple: '#9B72CF',
          dark: '#0D0B1A',
          mid: '#1A1535',
        },
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
