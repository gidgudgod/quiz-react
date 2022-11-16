/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        blueNavy: '#293264',
        purpleNavy: '#4D5B9E',
        purpleLight: '#D6DBF5',
        redLight: '#F8BCBC',
        greenLight: '#94D7A2',
      },

      boxShadow: {
        insetShadow: 'inset 5px 5px 10px -3px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
};
