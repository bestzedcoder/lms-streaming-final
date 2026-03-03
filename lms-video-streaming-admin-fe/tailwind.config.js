/** @type {import('tailwindcss').Config} */
export default {
  // 1. Chỉ cho Tailwind biết cần quét class ở những file nào
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  // 2. TẮT PREFLIGHT (CỰC KỲ QUAN TRỌNG KHI DÙNG VỚI ANT DESIGN)
  // Việc này ngăn Tailwind reset các style mặc định (như background, border) của antd
  corePlugins: {
    preflight: false,
  },

  // 3. (Tùy chọn) Khai báo thêm mã màu hoặc font chữ dùng chung cho hệ thống
  theme: {
    extend: {
      colors: {
        primary: "#1677ff", // Mã màu xanh lam chuẩn của Ant Design v5
        success: "#52c41a",
        warning: "#faad14",
        error: "#ff4d4f",
        adminBg: "#f5f5f5", // Màu nền xám nhạt cho layout admin
      },
    },
  },
  plugins: [],
};
