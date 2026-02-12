import { Modal, Form, Input, Select, Radio } from "antd";
import { useEffect } from "react";
import type {
  AdminUserCreate,
  AdminUserUpdate,
  UserResponse,
} from "../types/admin.types";

interface UserFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: AdminUserCreate | AdminUserUpdate) => void;
  loading: boolean;
  editingUser: UserResponse | null;
}

export const UserFormModal = ({
  visible,
  onCancel,
  onSubmit,
  loading,
  editingUser,
}: UserFormModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (editingUser) {
        form.setFieldsValue({
          fullName: editingUser.fullName,
          phone: editingUser.phone,
          email: editingUser.email,
          role: editingUser.role,
        });
      } else {
        form.resetFields();
        form.setFieldValue("role", "STUDENT");
      }
    }
  }, [visible, editingUser, form]);

  return (
    <Modal
      title={
        editingUser ? "Cập nhật thông tin người dùng" : "Thêm người dùng mới"
      }
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={editingUser ? "Lưu thay đổi" : "Tạo mới"}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="user@example.com" disabled={!!editingUser} />
        </Form.Item>

        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ pattern: /^0\d{9}$/, message: "SĐT không hợp lệ" }]}
        >
          <Input placeholder="09xxxxxxxx" />
        </Form.Item>

        <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="STUDENT">Học viên</Radio.Button>
            <Radio.Button value="INSTRUCTOR">Giảng viên</Radio.Button>
            <Radio.Button value="ADMIN" disabled>
              Admin
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

interface LockUserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (reason: string) => void;
  loading: boolean;
}

export const LockUserModal = ({
  visible,
  onCancel,
  onSubmit,
  loading,
}: LockUserModalProps) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Khóa tài khoản người dùng"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="Khóa ngay"
      okButtonProps={{ danger: true }}
      cancelText="Hủy"
    >
      <p className="text-gray-500 mb-4">
        Hành động này sẽ ngăn người dùng đăng nhập vào hệ thống. Vui lòng nhập
        lý do khóa tài khoản.
      </p>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onSubmit(values.reason)}
      >
        <Form.Item
          name="reason"
          label="Lý do khóa"
          rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Ví dụ: Vi phạm chính sách cộng đồng..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
