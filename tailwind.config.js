/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          primary: "#002D62", // Bleu foncé Emerite
          secondary: "#FDB813", // Jaune Emerite
          accent: "#F4F4F4", // Gris clair pour le fond
        },
      },
    },
    plugins: [],
  };
  