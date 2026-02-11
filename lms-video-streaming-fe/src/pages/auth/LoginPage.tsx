import { useState } from "react";
import { Form, Input, Button, Checkbox, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.store";
import { authService } from "../../services/auth.service";
import { notify } from "../../utils/notification.utils";
import AuthLayout from "../../components/layout/AuthLayout";

const LoginPage = () => {
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 1. Gọi API
      const response = await authService.login({
        email: values.email,
        password: values.password,
      });

      // 2. Lưu vào Store (Zustand + LocalStorage)
      // response.data chứa { user, accessToken } do axiosClient đã xử lý
      if (response.data) {
        login(response.data.user, response.data.accessToken);

        notify.success("Xác thực thành công", response.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay trở lại hệ thống."
      quote='"Học tập là hạt giống của kiến thức, kiến thức là hạt giống của hạnh phúc."'
    >
      <Form
        name="login_form"
        initialValues={{ remember: true }}
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
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Email của bạn"
            className="rounded-lg py-2"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập Mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Mật khẩu"
            className="rounded-lg py-2"
          />
        </Form.Item>

        <div className="flex justify-between items-center mb-6">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Ghi nhớ tôi</Checkbox>
          </Form.Item>
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline font-medium"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full bg-primary h-12 rounded-lg text-lg font-semibold hover:bg-blue-700 border-none shadow-md transition-all"
          >
            Đăng nhập
          </Button>
        </Form.Item>

        <Divider plain>
          <span className="text-gray-400 text-xs">HOẶC</span>
        </Divider>

        <div className="text-center mt-4">
          <span className="text-secondary">Chưa có tài khoản? </span>
          <Link
            to="/register"
            className="text-primary font-bold hover:underline"
          >
            Đăng ký ngay
          </Link>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default LoginPage;
