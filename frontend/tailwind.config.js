/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // Prefijo para convivir con Bootstrap
  prefix: 'tw-',
  // Deshabilitar preflight para no romper Bootstrap
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}

