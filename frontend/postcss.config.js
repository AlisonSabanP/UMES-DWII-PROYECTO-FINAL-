// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    // autoprefixer ya no es necesario en Tailwind v4 (incluye sus propios prefijos)
  },
}