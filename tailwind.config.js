/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  corePlugins: {
    preflight: false,
  },
  content: [
    "./src/**/*.{html,ts,scss}", 
    "./src/app/**/*.{html,ts,scss}",
    "./src/theme/**/*.scss"
  ],
  theme: {
    extend: {
      colors: {
        pokemon: {
          normal: '#A8A878',
          fire: '#F08030',
          water: '#6890F0',
          electric: '#F8D030',
          grass: '#78C850',
          poison: '#A040A0',
          psychic: '#F85888'
        }
      }  
    },
  },
  plugins: [],
}

