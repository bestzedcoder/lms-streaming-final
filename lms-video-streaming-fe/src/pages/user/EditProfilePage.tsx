import { Form, Input, Button, Typography, Alert } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  SaveOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore.store";
import { profileService } from "../../services/profile.service";
import { notify } from "../../utils/notification.utils";

const { Title, Paragraph } = Typography;

const EditProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await profileService.getMe();
        if (res.data) {
          form.setFieldsValue({
            fullName: res.data.fullName,
            phone: res.data.phone,
            email: res.data.email,
          });
        }
      } catch (e) {}
    };
    loadData();
  }, [form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await profileService.updateProfile({
        fullName: values.fullName,
        phone: values.phone,
      });

      notify.success("Thành công", "Hồ sơ của bạn đã được cập nhật.");

      updateUser({ fullName: values.fullName, updateProfile: true });
    } catch (e) {
      console.error("error: ", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 border-b border-gray-100 pb-4">
        <Title level={3}>Chỉnh sửa hồ sơ</Title>
        <Paragraph type="secondary">
          Quản lý thông tin định danh của bạn trên hệ thống.
        </Paragraph>
      </div>

      {!user?.updateProfile && (
        <div className="mb-8 animate-fade-in-down">
          <Alert
            message="Yêu cầu cập nhật thông tin"
            description="Vui lòng cập nhật đầy đủ Họ tên và Số điện thoại để hoàn tất quá trình thiết lập tài khoản và bảo vệ quyền lợi học tập của bạn."
            type="warning"
            showIcon
            icon={<InfoCircleOutlined className="text-xl" />}
            className="border-orange-200 bg-orange-50 text-orange-800 rounded-lg shadow-sm"
          />
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        size="large"
        className="max-w-lg"
        requiredMark={false}
      >
        <Form.Item
          label={
            <span className="font-semibold text-gray-700">Email đăng nhập</span>
          }
          name="email"
          tooltip="Email này dùng để đăng nhập và khôi phục tài khoản, không thể thay đổi."
        >
          <Input
            disabled
            className="bg-gray-100 text-gray-500 font-medium cursor-not-allowed border-gray-200"
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold text-gray-700">Họ và tên</span>}
          name="fullName"
          rules={[
            { required: true, message: "Vui lòng nhập họ tên đầy đủ" },
            { min: 4, message: "Tên quá ngắn (tối thiểu 4 ký tự)" },
          ]}
          tooltip="Tên này sẽ hiển thị trên chứng chỉ hoàn thành khóa học của bạn."
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Ví dụ: Nguyễn Văn A"
            className={
              !user?.updateProfile
                ? "border-orange-300 focus:border-orange-500 focus:shadow-orange-100"
                : ""
            }
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-semibold text-gray-700">Số điện thoại</span>
          }
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            {
              pattern: /^0\d{9}$/,
              message: "SĐT không hợp lệ (phải bắt đầu bằng 0 và có 10 số)",
            },
          ]}
        >
          <Input
            prefix={<PhoneOutlined className="text-gray-400" />}
            placeholder="Ví dụ: 0912345678"
            className={
              !user?.updateProfile
                ? "border-orange-300 focus:border-orange-500 focus:shadow-orange-100"
                : ""
            }
          />
        </Form.Item>

        <Form.Item className="mt-8 pt-4 border-t border-gray-100">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            className="px-8 font-bold h-11 bg-black border-black hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all rounded-lg w-full sm:w-auto"
          >
            {user?.updateProfile ? "Lưu thay đổi" : "Hoàn tất hồ sơ"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProfilePage;
