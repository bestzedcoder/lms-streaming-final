import { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { notify } from "../../utils/notification.utils";
import AuthLayout from "../../components/layout/AuthLayout";

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      notify.error(
        "Lỗi",
        "Không tìm thấy thông tin email. Vui lòng thực hiện lại.",
      );
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await authService.resetPassword({
        email: email,
        code: values.code,
      });

      notify.success(
        "Thành công",
        "Mật khẩu mới đã được gửi vào email của bạn. Vui lòng kiểm tra và đăng nhập lại.",
      );

      navigate("/login");
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Xác nhận mã OTP"
      subtitle={`Nhập mã OTP 8 số đã gửi tới ${email}.`}
    >
      <Form
        name="reset_password"
        onFinish={onFinish}
        layout="vertical"
        size="large"
        className="mt-4"
      >
        <Form.Item
          name="code"
          rules={[
            { required: true, message: "Vui lòng nhập mã OTP!" },
            { len: 8, message: "Mã OTP phải có đúng 8 ký tự!" },
            { pattern: /^[0-9]+$/, message: "Mã OTP chỉ chứa số!" },
          ]}
          className="flex justify-center"
        >
          <Input.OTP length={8} size="large" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full bg-primary h-12 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-md"
          >
            Lấy mật khẩu mới
          </Button>
        </Form.Item>

        <div className="flex flex-col items-center gap-2 mt-6">
          <div className="text-secondary">
            Chưa nhận được mã?{" "}
            <Link
              to="/forgot-password"
              className="text-primary font-bold hover:underline"
            >
              Gửi lại
            </Link>
          </div>

          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-dark mt-2"
          >
            ← Quay lại đăng nhập
          </Link>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
