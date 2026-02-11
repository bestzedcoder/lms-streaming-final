/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 1. Cấu hình màu sắc theo ngữ nghĩa (Semantic Colors)
      colors: {
        primary: {
          DEFAULT: "#0056D2", // Xanh đậm kiểu Coursera/Udemy
          hover: "#00419e", // Màu khi hover
          light: "#E6F0FF", // Màu nền nhạt (dùng cho tag, background)
        },
        secondary: "#6c757d", // Màu phụ (text xám)
        success: "#198754", // Màu thành công (khi thanh toán xong)
        danger: "#dc3545", // Màu lỗi/xóa
        warning: "#ffc107", // Màu cảnh báo (đánh giá sao)
        info: "#0dcaf0",
        dark: "#1e293b", // Màu text chính
        light: "#f8f9fa", // Màu nền web
      },
      // 2. Cấu hình Font chữ (Nên dùng Inter hoặc Roboto)
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Montserrat", "sans-serif"], // Font cho tiêu đề h1, h2
      },
      // 3. Cấu hình độ cao dòng (Line height) cho dễ đọc
      lineHeight: {
        relaxed: "1.75",
      },
      // 4. Cấu hình tỉ lệ khung hình (Video player rất cần cái này)
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
