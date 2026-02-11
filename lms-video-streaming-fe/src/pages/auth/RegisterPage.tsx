import { useState } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { notify } from "../../utils/notification.utils";
import AuthLayout from "../../components/layout/AuthLayout";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await authService.register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });

      notify.success(
        "Đăng ký thành công",
        "Vui lòng kiểm tra email để lấy mã xác thực.",
      );

      navigate("/verify-account", { state: { email: values.email } });
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Tạo tài khoản mới"
      subtitle="Bắt đầu hành trình học tập của bạn ngay hôm nay."
      quote='"Giáo dục là vũ khí mạnh nhất để thay đổi thế giới."'
    >
      <Form name="register" onFinish={onFinish} layout="vertical" size="large">
        <Form.Item
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập Họ và tên!" }]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Họ và tên"
            className="rounded-lg py-2"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập Email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="Email"
            className="rounded-lg py-2"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập Mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Mật khẩu"
            className="rounded-lg py-2"
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Xác nhận mật khẩu"
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
            Đăng ký
          </Button>
        </Form.Item>

        <div className="text-center mt-4">
          <span className="text-secondary">Đã có tài khoản? </span>
          <Link to="/login" className="text-primary font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default RegisterPage;
