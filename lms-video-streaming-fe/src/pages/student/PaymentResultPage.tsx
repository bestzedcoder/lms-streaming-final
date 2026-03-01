import { useParams, useNavigate } from "react-router-dom";
import { Result, Button, Card, Typography } from "antd";

const { Text } = Typography;

const PaymentResultPage = () => {
  const { code, result } = useParams<{
    code: string;
    result: "success" | "failed";
  }>();
  const navigate = useNavigate();

  const isSuccess = result === "success";

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 flex justify-center items-center">
      <Card className="max-w-2xl w-full rounded-3xl shadow-xl border-0 overflow-hidden">
        {isSuccess ? (
          <Result
            status="success"
            title={
              <span className="text-3xl font-extrabold text-gray-800">
                Thanh toán thành công!
              </span>
            }
            subTitle={
              <div className="mt-3 text-base text-gray-500">
                Giao dịch cho đơn hàng{" "}
                <Text className="font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                  #{code}
                </Text>{" "}
                đã hoàn tất.
                <br />
                Cảm ơn bạn đã tin tưởng. Các khóa học đã được thêm vào tài khoản
                của bạn.
              </div>
            }
            extra={[
              <Button
                type="primary"
                key="view-order"
                size="large"
                className="rounded-xl font-bold px-10 h-12 shadow-lg shadow-green-500/30 bg-green-500 hover:bg-green-600 border-none"
                onClick={() => navigate(`/student/orders/details/${code}`)}
              >
                Xem đơn hàng
              </Button>,
            ]}
          />
        ) : (
          <Result
            status="error"
            title={
              <span className="text-3xl font-extrabold text-gray-800">
                Giao dịch thất bại!
              </span>
            }
            subTitle={
              <div className="mt-3 text-base text-gray-500">
                Đã có lỗi xảy ra hoặc bạn đã hủy giao dịch cho đơn hàng{" "}
                <Text className="font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                  #{code}
                </Text>
                .
                <br />
                Vui lòng kiểm tra lại phương thức thanh toán hoặc thử lại sau.
              </div>
            }
            extra={[
              <Button
                type="primary"
                danger
                key="history"
                size="large"
                className="rounded-xl font-bold px-10 h-12 shadow-lg shadow-red-500/30"
                onClick={() => navigate("/student/orders/my-orders")}
              >
                Trở về lịch sử order
              </Button>,
            ]}
          />
        )}
      </Card>
    </div>
  );
};

export default PaymentResultPage;
