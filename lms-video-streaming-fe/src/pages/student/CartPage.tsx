import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Typography,
  Empty,
  Skeleton,
  Popconfirm,
  Divider,
} from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useCartStore } from "../../store/useCartStore.store";
import { notify } from "../../utils/notification.utils";
import { formatCurrency } from "../../utils/format.utils";
import { studentService } from "../../services/student.service";
import type {
  CartResponse,
  CartItemResponse,
} from "../../@types/student.types";

const { Title, Text } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const { removeItem, clearCart } = useCartStore();

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    fetchMyCart();
  }, []);

  const fetchMyCart = async () => {
    try {
      setLoading(true);
      const res = await studentService.getCart();
      if (res.data) {
        setCart(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      setRemovingId(cartItemId);
      await studentService.removeCartItem({ cartItemId });

      if (cart) {
        setCart({
          ...cart,
          items: cart.items.filter((item) => item.id !== cartItemId),
        });
      }
      removeItem();
      notify.success("Thành công", "Đã xóa khóa học khỏi giỏ");
    } catch (error) {
      console.error(error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleClearCart = async () => {
    try {
      await studentService.clearCart();
      setCart({ id: cart?.id || "", items: [] });
      clearCart();
      notify.success("Thành công", "Đã làm sạch giỏ hàng");
    } catch (error) {
      console.error(error);
    }
  };

  const getFinalPrice = (item: CartItemResponse) => {
    if (!item.salePrice || item.salePrice === 0) return item.price;
    return item.salePrice < item.price ? item.price - item.salePrice : 0;
  };

  const handleCreateOrder = async () => {
    try {
      setCreatingOrder(true);
      const res = await studentService.createOrder();
      const orderCode: string = res.data;

      notify.success("Thành công", "Đã tạo đơn hàng!");

      navigate(`/student/orders/details/${orderCode}`, { replace: true });
    } catch (error) {
      console.error(error);
    } finally {
      setCreatingOrder(false);
    }
  };

  const originalTotalPrice =
    cart?.items.reduce((sum, item) => sum + item.price, 0) || 0;
  const finalTotalPrice =
    cart?.items.reduce((sum, item) => sum + getFinalPrice(item), 0) || 0;
  const totalDiscount = originalTotalPrice - finalTotalPrice;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton active paragraph={{ rows: 4 }} className="mb-8" />
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <Empty
          image={<ShoppingCartOutlined className="text-8xl text-gray-200" />}
          description={
            <div className="mt-4">
              <Title level={3} className="!text-gray-700 !mb-2">
                Giỏ hàng của bạn đang trống
              </Title>
              <Text className="text-gray-500 text-base">
                Có vẻ như bạn chưa thêm khóa học nào vào giỏ.
              </Text>
            </div>
          }
        >
          <Button
            type="primary"
            size="large"
            className="mt-4 bg-primary px-8 rounded-full h-12 font-semibold shadow-lg shadow-blue-500/30"
            onClick={() => navigate("/student/courses/search")}
          >
            Khám phá khóa học ngay
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-6">
          <Title level={2} className="!mb-0 !text-3xl font-bold text-gray-800">
            Giỏ hàng ({cart.items.length} khóa học)
          </Title>
          <Popconfirm
            title="Xóa tất cả khóa học?"
            description="Bạn có chắc chắn muốn làm sạch giỏ hàng không?"
            onConfirm={handleClearCart}
            okText="Xóa hết"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              className="font-medium flex items-center gap-1 shadow-sm rounded-lg hover:bg-red-50"
            >
              Làm sạch giỏ hàng
            </Button>
          </Popconfirm>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-4">
            {cart.items.map((item) => {
              const finalPrice = getFinalPrice(item);
              const isFree = finalPrice === 0;
              const hasDiscount = item.salePrice && item.salePrice < item.price;

              return (
                <Card
                  key={item.id}
                  bordered={false}
                  className="shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden"
                  bodyStyle={{ padding: "16px" }}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-40 shrink-0">
                      <img
                        src={
                          item.thumbnail ||
                          "https://placehold.co/300x200?text=No+Image"
                        }
                        alt={item.title}
                        className="w-full h-24 object-cover rounded-lg border border-gray-100"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link
                          to={`/course/${item.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-1">
                            {item.title}
                          </h3>
                        </Link>
                        <Text className="text-gray-500 text-sm">
                          Giảng viên:{" "}
                          <span className="font-medium text-gray-700">
                            {item.instructorName}
                          </span>
                        </Text>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col justify-between items-end sm:items-end min-w-[120px]">
                      <div className="text-right">
                        {isFree ? (
                          <div className="text-xl font-bold text-green-600">
                            Miễn phí
                          </div>
                        ) : (
                          <>
                            <div className="text-xl font-bold text-gray-900">
                              {formatCurrency(finalPrice)}
                            </div>
                            {hasDiscount ? (
                              <div className="text-sm text-gray-400 line-through">
                                {formatCurrency(item.price)}
                              </div>
                            ) : null}
                          </>
                        )}
                      </div>

                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        loading={removingId === item.id}
                        onClick={() => handleRemoveItem(item.id)}
                        className="mt-0 sm:mt-4 shadow-sm flex items-center justify-center rounded-lg hover:bg-red-50"
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-[100px]">
              <Card bordered={false} className="shadow-sm rounded-xl">
                <Title level={4} className="!mb-6 !font-bold text-gray-800">
                  Tóm tắt đơn hàng
                </Title>

                <div className="flex justify-between items-center mb-4">
                  <Text className="text-gray-600">Giá gốc:</Text>
                  <Text className="font-medium text-gray-800">
                    {formatCurrency(originalTotalPrice)}
                  </Text>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between items-center mb-4">
                    <Text className="text-gray-600">Được giảm giá:</Text>
                    <Text className="font-medium text-red-500">
                      -{formatCurrency(totalDiscount)}
                    </Text>
                  </div>
                )}

                <Divider className="my-4" />

                <div className="flex justify-between items-end mb-6">
                  <Text className="text-gray-800 font-semibold text-lg">
                    Tổng cộng:
                  </Text>
                  <div className="text-3xl font-extrabold text-primary">
                    {finalTotalPrice === 0
                      ? "Miễn phí"
                      : formatCurrency(finalTotalPrice)}
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  loading={creatingOrder}
                  className="h-14 text-lg font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                  onClick={handleCreateOrder}
                >
                  Tạo đơn hàng ngay <ArrowRightOutlined />
                </Button>

                <div className="mt-6 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <SafetyCertificateOutlined className="text-lg text-green-600 shrink-0" />
                  <span>
                    Chúng tôi áp dụng các chuẩn bảo mật cao nhất (SSL, mã hóa dữ
                    liệu) để bảo vệ thông tin thanh toán của bạn.
                  </span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
