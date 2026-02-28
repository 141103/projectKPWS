/** @type {import('tailwindcss').Config} */
module.exports = {
  // PENTING: Setel darkMode ke 'class'
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Pastikan ini mencakup semua file komponen Anda
  ],
  theme: {
    extend: {
      // Anda dapat menambahkan custom fonts, colors, dll. di sini
    },
  },
  plugins: [],
}

