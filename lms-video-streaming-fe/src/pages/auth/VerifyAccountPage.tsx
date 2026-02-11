import { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { notify } from "../../utils/notification.utils";
import AuthLayout from "../../components/layout/AuthLayout";

const VerifyAccountPage = () => {
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
        "Không tìm thấy thông tin email. Vui lòng đăng ký lại.",
      );
      navigate("/register");
    }
  }, [location, navigate]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await authService.verifyAccount({
        email: email,
        code: values.code,
      });

      notify.success(
        "Xác thực thành công",
        "Tài khoản đã được kích hoạt. Vui lòng đăng nhập.",
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
      title="Xác thực tài khoản"
      subtitle={`Nhập mã OTP 6 chữ số đã được gửi tới ${email}`}
    >
      <Form name="verify" onFinish={onFinish} layout="vertical" size="large">
        <Form.Item
          name="code"
          className="flex justify-center mb-10"
          rules={[
            { required: true, message: "Vui lòng nhập mã OTP!" },
            { len: 6, message: "Mã OTP phải có đúng 6 ký tự!" },
            { pattern: /^[0-9]+$/, message: "Mã OTP chỉ chứa số!" },
          ]}
        >
          <Input.OTP length={6} size="large" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full bg-primary h-12 rounded-lg font-bold"
          >
            Xác thực
          </Button>
        </Form.Item>

        <div className="text-center">
          <Button type="link" onClick={() => navigate("/login")}>
            Quay lại đăng nhập
          </Button>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default VerifyAccountPage;
