import { useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import {
  LockOutlined,
  SaveOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { notify } from "../../utils/notification.utils";
import type { AuthChangePasswordRequest } from "../../types/auth.types";
import { authService } from "../../services/auth.service";

const { Title, Text } = Typography;

const ChangePasswordPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload: AuthChangePasswordRequest = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };

      await authService.changePassword(payload);

      notify.success("Thành công", "Đổi mật khẩu thành công!");

      form.resetFields();
    } catch (error) {
      console.error("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-6">
        <Title level={2}>Bảo mật & Đăng nhập</Title>
        <Text type="secondary">
          Thay đổi mật khẩu định kỳ để bảo vệ tài khoản của bạn.
        </Text>
      </div>

      <Card bordered={false} className="shadow-sm rounded-xl">
        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
          <SafetyCertificateOutlined className="text-2xl" />
          <div className="text-sm">
            <strong>Mẹo bảo mật:</strong> Sử dụng mật khẩu mạnh bao gồm chữ hoa,
            chữ thường, số và ký tự đặc biệt.
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="oldPassword"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu cũ"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
              {
                pattern:
                  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/,
                message:
                  "Mật khẩu cần có chữ hoa, thường, số và ký tự đặc biệt",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu nhập lại không khớp!"),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập lại mật khẩu mới"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              block
              className="bg-primary hover:bg-blue-600 h-11 font-semibold text-base shadow-md"
            >
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;
