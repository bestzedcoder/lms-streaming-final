/**
 * Format số thành tiền tệ Việt Nam (VND)
 * Ví dụ: 100000 -> 100.000 ₫
 * @param value - Số tiền cần format (number hoặc string)
 * @returns Chuỗi đã format kèm đơn vị
 */
export const formatCurrency = (
  value: number | string | undefined | null,
): string => {
  if (!value) return "0 ₫";

  const amount = Number(value);

  // Kiểm tra nếu không phải là số hợp lệ
  if (isNaN(amount)) return "0 ₫";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0, // VND không dùng số thập phân
  }).format(amount);
};

/**
 * Format số thành tiền tệ nhưng KHÔNG có ký hiệu ₫ (để custom giao diện)
 * Ví dụ: 100000 -> 100.000
 */
export const formatNumber = (
  value: number | string | undefined | null,
): string => {
  if (!value) return "0";

  const amount = Number(value);
  if (isNaN(amount)) return "0";

  return new Intl.NumberFormat("vi-VN").format(amount);
};
