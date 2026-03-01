import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Spin,
  Tag,
  Divider,
  Modal,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  CreditCardOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { formatCurrency } from "../../utils/format.utils";
import { notify } from "../../utils/notification.utils";
import { studentService } from "../../services/student.service";
import type { OrderDetailsResponse } from "../../@types/student.types";

const { Title, Text } = Typography;

const OrderDetailsPage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // State đếm ngược thời gian
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // State cho Modal Thanh toán
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [payingLoading, setPayingLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"MOMO" | "VNPAY" | null>(
    null,
  );

  useEffect(() => {
    if (code) fetchOrderDetails(code);
  }, [code]);

  const fetchOrderDetails = async (orderCode: string) => {
    try {
      setLoading(true);
      const res = await studentService.getOrderDetails(orderCode);
      if (res.data) setOrder(res.data);
    } catch (error) {
      notify.error("Lỗi", "Không thể tải chi tiết đơn hàng");
      navigate("/student/orders");
    } finally {
      setLoading(false);
    }
  };

  // Logic đếm ngược (Countdown)
  useEffect(() => {
    if (order?.status === "PENDING" && order?.expiresAt) {
      const calculateTimeLeft = () => {
        const expiresTime = new Date(order.expiresAt).getTime();
        const currentTime = new Date().getTime();
        return Math.max(0, Math.floor((expiresTime - currentTime) / 1000));
      };

      setTimeLeft(calculateTimeLeft());

      const timer = setInterval(() => {
        const remaining = calculateTimeLeft();
        setTimeLeft(remaining);

        // Nếu hết thời gian, tự động dừng đếm
        if (remaining <= 0) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [order]);

  const handlePayment = async () => {
    if (!selectedMethod || !code) return;
    try {
      setPayingLoading(true);
      const res = await studentService.createPayment({
        code,
        method: selectedMethod,
      });
      window.location.href = res.data;
    } catch (error) {
      notify.error("Lỗi", "Tạo link thanh toán thất bại!");
    } finally {
      setPayingLoading(false);
    }
  };

  // Hàm format số giây thành HH:MM:SS
  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return { h, m, s };
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  if (!order) return null;

  const isPending = order.status === "PENDING";
  const { h, m, s } = formatCountdown(timeLeft);
  const isExpired = isPending && timeLeft <= 0; // Đơn đang chờ nhưng hết hạn

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mb-4 text-gray-500 hover:text-primary"
        >
          Quay lại lịch sử
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CỘT TRÁI: CHI TIẾT SẢN PHẨM */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <Card className="rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <Title level={4} className="!mb-0">
                  Mã đơn: #{order.code}
                </Title>
                {order.status === "COMPLETED" && (
                  <Tag color="success">Đã thanh toán</Tag>
                )}
                {order.status === "CANCELLED" && (
                  <Tag color="error">Đã hủy</Tag>
                )}
                {isPending && !isExpired && (
                  <Tag color="warning">Chờ thanh toán</Tag>
                )}
                {isExpired && <Tag color="default">Đã quá hạn</Tag>}
              </div>

              <div className="flex flex-col gap-4">
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-gray-50 rounded-xl"
                  >
                    <img
                      src={
                        item.thumbnail || "https://placehold.co/150?text=Course"
                      }
                      alt={item.title}
                      className="w-24 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800 text-base line-clamp-1">
                          {item.title}
                        </h4>
                        <Text className="text-gray-500 text-xs line-clamp-1">
                          {item.descriptionShort}
                        </Text>
                      </div>
                      <span className="font-bold text-gray-900 ml-4">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* CỘT PHẢI: THÔNG TIN TỔNG QUAN & THANH TOÁN */}
          <div className="md:col-span-1">
            <Card className="rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <Title level={5} className="!mb-4">
                Thông tin thanh toán
              </Title>

              {/* --- ĐỒNG HỒ ĐẾM NGƯỢC --- */}
              {isPending && (
                <div
                  className={`mb-6 p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${isExpired ? "bg-gray-50 border-gray-200" : "bg-red-50 border-red-200 shadow-inner"}`}
                >
                  <span
                    className={`font-semibold flex items-center gap-2 ${isExpired ? "text-gray-500" : "text-red-500"}`}
                  >
                    <ClockCircleOutlined
                      className={!isExpired ? "animate-pulse" : ""}
                    />
                    {isExpired
                      ? "Đơn hàng đã hết hạn"
                      : "Vui lòng thanh toán trong"}
                  </span>

                  {!isExpired && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="bg-red-500 text-white font-mono font-bold text-xl px-2.5 py-1.5 rounded-lg shadow-sm w-11 text-center">
                        {h}
                      </div>
                      <span className="text-red-500 font-bold text-lg">:</span>
                      <div className="bg-red-500 text-white font-mono font-bold text-xl px-2.5 py-1.5 rounded-lg shadow-sm w-11 text-center">
                        {m}
                      </div>
                      <span className="text-red-500 font-bold text-lg">:</span>
                      <div className="bg-red-500 text-white font-mono font-bold text-xl px-2.5 py-1.5 rounded-lg shadow-sm w-11 text-center">
                        {s}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Space direction="vertical" className="w-full mb-6" size="small">
                <div className="flex justify-between text-gray-600">
                  <span>Ngày tạo:</span>
                  <span className="font-medium">
                    {new Date(order.orderDate).toLocaleString("vi-VN")}
                  </span>
                </div>
                {order.status === "COMPLETED" && order.completedAt && (
                  <div className="flex justify-between text-green-600">
                    <span>Thanh toán lúc:</span>
                    <span className="font-medium">
                      {new Date(order.completedAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                )}
              </Space>

              <Divider className="my-4" />

              <div className="flex justify-between items-end mb-6">
                <Text className="text-gray-600">Tổng cộng:</Text>
                <div className="text-2xl font-extrabold text-primary">
                  {formatCurrency(Number(order.totalAmount))}
                </div>
              </div>

              {/* CHỈ HIỆN NÚT THANH TOÁN KHI CÒN THỜI GIAN */}
              {isPending && !isExpired && (
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<CreditCardOutlined />}
                  className="h-12 text-lg font-bold rounded-xl shadow-md shadow-blue-500/30"
                  onClick={() => setIsModalVisible(true)}
                >
                  Thanh toán ngay
                </Button>
              )}

              {/* NẾU HẾT HẠN HIỆN NÚT KHÁC HOẶC VÔ HIỆU HÓA */}
              {isExpired && (
                <Button
                  size="large"
                  block
                  disabled
                  className="h-12 text-lg font-bold rounded-xl"
                >
                  Đã hết hạn thanh toán
                </Button>
              )}

              <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-green-50/50 p-3 rounded-lg border border-green-100">
                <SafetyCertificateOutlined className="text-lg text-green-600" />
                <span>Giao dịch của bạn được mã hóa an toàn tuyệt đối.</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal Thanh toán giữ nguyên ... */}
      <Modal
        title={
          <div className="text-xl font-bold text-center">
            Chọn phương thức thanh toán
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        width={400}
      >
        <div className="flex flex-col gap-4 mt-6">
          <div
            onClick={() => setSelectedMethod("VNPAY")}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between
              ${selectedMethod === "VNPAY" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}
            `}
          >
            <div className="flex items-center gap-4">
              <img src="/VNPAY.png" alt="VNPay" className="h-8" />
              <span className="font-bold text-gray-800">Thanh toán VNPay</span>
            </div>
            {selectedMethod === "VNPAY" && (
              <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-200" />
            )}
          </div>

          <div
            onClick={() => setSelectedMethod("MOMO")}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between
              ${selectedMethod === "MOMO" ? "border-pink-500 bg-pink-50" : "border-gray-200 hover:border-pink-300"}
            `}
          >
            <div className="flex items-center gap-4">
              <img
                src="/MOMO.webp"
                alt="MoMo"
                className="h-8 w-8 object-contain"
              />
              <span className="font-bold text-gray-800">Ví điện tử MoMo</span>
            </div>
            {selectedMethod === "MOMO" && (
              <div className="w-4 h-4 rounded-full bg-pink-500 ring-4 ring-pink-200" />
            )}
          </div>

          <Button
            type="primary"
            size="large"
            block
            loading={payingLoading}
            disabled={!selectedMethod}
            onClick={handlePayment}
            className="h-12 mt-4 font-bold text-base rounded-xl"
            style={{
              backgroundColor:
                selectedMethod === "MOMO"
                  ? "#A50064"
                  : selectedMethod === "VNPAY"
                    ? "#005BAA"
                    : undefined,
              borderColor: "transparent",
            }}
          >
            Tiếp tục thanh toán
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetailsPage;
