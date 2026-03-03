/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0056D2",
          hover: "#00419e",
          light: "#E6F0FF",
        },
        secondary: "#6c757d",
        success: "#198754",
        danger: "#dc3545",
        warning: "#ffc107",
        info: "#0dcaf0",
        dark: "#1e293b",
        light: "#f8f9fa",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Montserrat", "sans-serif"],
      },
      lineHeight: {
        relaxed: "1.75",
      },
      aspectRatio: {
        video: "16 / 9",
        course: "4 / 3",
      },
    },
  },
  plugins: [
    // Chúng ta sẽ cài thêm plugin ở Bước 4
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
