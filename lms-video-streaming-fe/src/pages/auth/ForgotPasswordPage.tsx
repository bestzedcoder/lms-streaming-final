import { useState } from "react";
import { Form, Input, Button } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { notify } from "../../utils/notification.utils";
import AuthLayout from "../../components/layout/AuthLayout";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await authService.forgotPassword({ email: values.email });
      notify.success(
        "Đã gửi mã",
        "Vui lòng kiểm tra email để lấy mã khôi phục mật khẩu.",
      );

      navigate("/reset-password", { state: { email: values.email } });
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Quên mật khẩu?"
      subtitle="Nhập email của bạn để nhận mã đặt lại mật khẩu."
      image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1470"
    >
      <Form
        name="forgot_password"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập Email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="Email đăng ký"
            className="rounded-lg py-2"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full bg-primary h-12 rounded-lg font-bold"
          >
            Gửi mã xác nhận
          </Button>
        </Form.Item>

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-secondary hover:text-primary font-medium"
          >
            ← Quay lại đăng nhập
          </Link>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
