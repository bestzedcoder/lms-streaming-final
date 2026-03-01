import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Tag,
  Typography,
  Button,
  Spin,
  Empty,
  Radio,
  Space,
  Modal,
  Divider,
} from "antd";
import {
  FileTextOutlined,
  EyeOutlined,
  ContainerOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { formatCurrency } from "../../utils/format.utils";
import { studentService } from "../../services/student.service";
import type {
  OrderResponse,
  InvoiceResponse,
} from "../../@types/student.types";

const { Title, Text } = Typography;

const OrderListPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "ALL" | "PENDING" | "COMPLETED" | "CANCELLED"
  >("ALL");

  const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceResponse | null>(
    null,
  );
  const [currentOrderCode, setCurrentOrderCode] = useState<string>("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await studentService.getOrders();
      if (res.data) setOrders(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = async (orderCode: string) => {
    try {
      setCurrentOrderCode(orderCode);
      setIsInvoiceVisible(true);
      setInvoiceLoading(true);

      const res = await studentService.getInvoice(orderCode);
      if (res.data) setCurrentInvoice(res.data);
    } catch (error) {
      setIsInvoiceVisible(false);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) => filter === "ALL" || order.status === filter,
  );

  const getStatusTag = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Tag color="success" className="px-3 py-1 text-sm rounded-full">
            Đã thanh toán
          </Tag>
        );
      case "PENDING":
        return (
          <Tag color="warning" className="px-3 py-1 text-sm rounded-full">
            Chờ thanh toán
          </Tag>
        );
      case "CANCELLED":
        return (
          <Tag color="error" className="px-3 py-1 text-sm rounded-full">
            Đã hủy
          </Tag>
        );
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const renderPaymentMethod = (method?: "MOMO" | "VNPAY") => {
    if (method === "MOMO") {
      return (
        <div className="flex items-center justify-end gap-2 text-[#A50064] font-bold">
          <img src="/MOMO.webp" alt="MoMo" className="h-6 w-6 object-contain" />
          Ví MoMo
        </div>
      );
    }
    if (method === "VNPAY") {
      return (
        <div className="flex items-center justify-end gap-2 text-[#005BAA] font-bold">
          <img src="/VNPAY.png" alt="VNPay" className="h-5" />
          VNPay
        </div>
      );
    }
    return <Text>Chưa rõ</Text>;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <Title
            level={2}
            className="!mb-0 !text-3xl font-bold text-gray-800 flex items-center gap-3"
          >
            <FileTextOutlined className="text-primary" /> Lịch sử đơn hàng
          </Title>

          <Radio.Group
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            buttonStyle="solid"
            size="large"
            className="shadow-sm rounded-lg"
          >
            <Radio.Button value="ALL">Tất cả</Radio.Button>
            <Radio.Button value="PENDING">Chờ thanh toán</Radio.Button>
            <Radio.Button value="COMPLETED">Thành công</Radio.Button>
            <Radio.Button value="CANCELLED">Đã hủy</Radio.Button>
          </Radio.Group>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="rounded-2xl shadow-sm py-12 text-center">
            <Empty
              description={
                <span className="text-gray-500">
                  Không tìm thấy đơn hàng nào!
                </span>
              }
            />
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredOrders.map((order) => {
              const canViewInvoice =
                order.status === "COMPLETED" && Number(order.totalAmount) > 0;

              return (
                <Card
                  key={order.code}
                  className="rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  bodyStyle={{ padding: "20px" }}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <Space direction="vertical" size="small">
                      <div className="flex items-center gap-3">
                        <Text className="font-bold text-lg text-gray-800">
                          Mã đơn: #{order.code}
                        </Text>
                        {getStatusTag(order.status)}
                      </div>
                      <Text className="text-gray-500">
                        Ngày tạo:{" "}
                        <span className="text-gray-700 font-medium">
                          {new Date(order.orderDate).toLocaleString("vi-VN")}
                        </span>
                      </Text>
                      {order.status === "COMPLETED" && order.completedAt && (
                        <Text className="text-gray-500">
                          Thanh toán:{" "}
                          <span className="text-green-600 font-medium">
                            {new Date(order.completedAt).toLocaleString(
                              "vi-VN",
                            )}
                          </span>
                        </Text>
                      )}
                      <Text className="text-gray-500">
                        Số lượng:{" "}
                        <span className="text-gray-700 font-medium">
                          {order.quantity} khóa học
                        </span>
                      </Text>
                    </Space>

                    <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto gap-4">
                      <div className="text-right">
                        <Text className="text-gray-500 text-sm block">
                          Tổng tiền
                        </Text>
                        <Text className="text-2xl font-bold text-primary">
                          {Number(order.totalAmount) === 0
                            ? "Miễn phí"
                            : formatCurrency(Number(order.totalAmount))}
                        </Text>
                      </div>

                      <div className="flex gap-2">
                        {canViewInvoice && (
                          <Button
                            icon={<ContainerOutlined />}
                            className="rounded-lg border-gray-300 text-gray-600 hover:text-primary hover:border-primary"
                            onClick={() => handleViewInvoice(order.code)}
                          >
                            Hóa đơn
                          </Button>
                        )}
                        <Button
                          type="primary"
                          ghost
                          icon={<EyeOutlined />}
                          className="rounded-lg font-medium"
                          onClick={() =>
                            navigate(`/student/orders/details/${order.code}`)
                          }
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={isInvoiceVisible}
        onCancel={() => setIsInvoiceVisible(false)}
        footer={null}
        centered
        width={400}
        closeIcon={null}
        className="invoice-modal"
      >
        {invoiceLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <Spin size="large" />
            <Text className="text-gray-500">Đang truy xuất biên lai...</Text>
          </div>
        ) : currentInvoice ? (
          <div className="p-2">
            <div className="text-center mb-6">
              <CheckCircleFilled className="text-5xl text-green-500 mb-2" />
              <Title level={4} className="!mb-0 !text-gray-800">
                Giao dịch thành công
              </Title>
              <Text className="text-gray-500">Cảm ơn bạn đã mua khóa học!</Text>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <Text className="text-gray-500">Mã đơn hàng</Text>
                <Text className="font-semibold">#{currentOrderCode}</Text>
              </div>
              {(() => {
                const selectedOrder = orders.find(
                  (o) => o.code === currentOrderCode,
                );
                return selectedOrder?.completedAt ? (
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-500">Thời gian giao dịch</Text>
                    <Text className="font-medium text-sm">
                      {new Date(selectedOrder.completedAt).toLocaleString(
                        "vi-VN",
                      )}
                    </Text>
                  </div>
                ) : null;
              })()}
              <div className="flex justify-between items-center">
                <Text className="text-gray-500">Mã giao dịch</Text>
                <Text className="font-mono bg-white px-2 py-0.5 border rounded text-xs">
                  {currentInvoice.transactionNo}
                </Text>
              </div>
              <Divider className="my-2 border-dashed" />
              <div className="flex justify-between items-center">
                <Text className="text-gray-500">Kênh thanh toán</Text>
                {renderPaymentMethod(currentInvoice.method)}
              </div>
            </div>

            <Button
              type="primary"
              block
              size="large"
              className="mt-6 rounded-xl font-semibold"
              onClick={() => setIsInvoiceVisible(false)}
            >
              Đóng biên lai
            </Button>
          </div>
        ) : (
          <Empty
            description="Không tìm thấy dữ liệu hóa đơn"
            className="py-8"
          />
        )}
      </Modal>
    </div>
  );
};

export default OrderListPage;
