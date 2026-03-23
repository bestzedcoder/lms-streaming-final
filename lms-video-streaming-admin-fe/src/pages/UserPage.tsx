import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Input,
  Tag,
  Space,
  Button,
  Card,
  Typography,
  message,
  Modal,
  Tooltip,
  Form,
  Select,
} from "antd";
import {
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
  EditOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { UserService } from "../services/user.service";
import { useDebounce } from "../hooks/useDebounce";
import type { AdminSearchUser, UserResponse } from "../@types/user.type";

const { Title } = Typography;

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const [queryParams, setQueryParams] = useState<AdminSearchUser>({
    page: 0,
    limit: 10,
    email: "",
  });

  const fetchUsers = useCallback(async (params: AdminSearchUser) => {
    setLoading(true);
    try {
      const response = await UserService.getUserList(params);
      const { result, totalElements } = response.data;
      setUsers(result);
      setTotalElements(totalElements);
    } catch (error) {
      message.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      email: debouncedSearchText,
      page: 0,
    }));
  }, [debouncedSearchText]);

  useEffect(() => {
    fetchUsers(queryParams);
  }, [queryParams, fetchUsers]);

  const handleTableChange = (pagination: any) => {
    setQueryParams((prev) => ({
      ...prev,
      page: pagination.current - 1,
      limit: pagination.pageSize,
    }));
  };

  const handleLockUser = (user: UserResponse) => {
    Modal.confirm({
      title: `Khóa người dùng: ${user.lastName} ${user.firstName}`,
      content: (
        <Input.TextArea
          placeholder="Nhập lý do khóa..."
          id="lock-reason"
          rows={3}
          className="mt-2"
        />
      ),
      onOk: async () => {
        const reason = (
          document.getElementById("lock-reason") as HTMLTextAreaElement
        ).value;
        if (!reason.trim()) {
          message.warning("Vui lòng nhập lý do");
          return Promise.reject();
        }
        try {
          await UserService.lockUser({ id: user.id, reason });
          message.success("Đã khóa người dùng");
          fetchUsers(queryParams);
        } catch (error: any) {
          message.error(error.message);
        }
      },
    });
  };

  const handleUnlockUser = async (id: string) => {
    try {
      await UserService.unlockUser({ id });
      message.success("Đã mở khóa tài khoản");
      fetchUsers(queryParams);
    } catch (error) {
      message.error("Lỗi khi mở khóa");
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setEditingUserId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openUpdateModal = (user: UserResponse) => {
    setModalMode("update");
    setEditingUserId(user.id);
    form.setFieldsValue({
      email: user.email,
      firstName: user.firstName, // Cập nhật field mới
      lastName: user.lastName, // Cập nhật field mới
      phone: user.phone,
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (values: any) => {
    setSubmitLoading(true);
    try {
      if (modalMode === "create") {
        await UserService.createUser(values);
        message.success("Tạo người dùng thành công!");
      } else {
        const { email, ...updateData } = values;
        await UserService.updateUser(editingUserId as string, updateData);
        message.success("Cập nhật thông tin thành công!");
      }
      setIsModalOpen(false);
      fetchUsers(queryParams);
    } catch (error: any) {
      message.error(
        "Có lỗi xảy ra, email hoặc số điện thoại có thể bị trùng lặp!",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    {
      title: "Họ và tên",
      key: "fullName",
      fixed: "left" as const,
      render: (_: any, record: UserResponse) => (
        <div className="font-semibold text-gray-800">
          {`${record.lastName} ${record.firstName}`}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const colorMap: Record<string, string> = {
          ADMIN: "volcano",
          INSTRUCTOR: "blue",
          STUDENT: "green",
        };
        return (
          <Tag color={colorMap[role] || "default"} className="font-medium">
            {role}
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "locked",
      key: "locked",
      render: (locked: boolean) => (
        <Tag color={locked ? "error" : "success"} className="font-medium">
          {locked ? "Đã khóa" : "Hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-gray-600">
          {new Date(date).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (createdBy: string) => (
        <Tag
          icon={<SearchOutlined />}
          color="default"
          className="rounded-full px-3"
        >
          {createdBy || "Hệ thống"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right" as const,
      render: (_: any, record: UserResponse) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              className="text-blue-500 hover:text-blue-700"
              icon={<EditOutlined />}
              onClick={() => openUpdateModal(record)}
            />
          </Tooltip>
          {record.locked ? (
            <Tooltip title="Mở khóa">
              <Button
                type="text"
                className="text-emerald-500 hover:text-emerald-700"
                icon={<UnlockOutlined />}
                onClick={() => handleUnlockUser(record.id)}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Khóa tài khoản">
              <Button
                type="text"
                danger
                icon={<LockOutlined />}
                onClick={() => handleLockUser(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Title level={3} className="!mb-0 text-gray-800">
          Quản lý người dùng
        </Title>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          size="large"
          className="shadow-md"
          onClick={openCreateModal}
        >
          Thêm người dùng
        </Button>
      </div>

      <Card className="shadow-sm border-0 rounded-xl">
        <div className="mb-6 w-full md:w-1/3">
          <Input
            placeholder="Tìm kiếm theo email..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
            className="rounded-lg"
          />
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            current: (queryParams.page || 0) + 1,
            pageSize: queryParams.limit || 10,
            total: totalElements,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} người dùng`,
          }}
          onChange={handleTableChange}
          className="overflow-x-auto"
        />
      </Card>

      <Modal
        title={
          modalMode === "create" ? "Thêm Người Dùng Mới" : "Cập Nhật Thông Tin"
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
          className="mt-4"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              placeholder="Ví dụ: admin@hust.edu.vn"
              disabled={modalMode === "update"}
            />
          </Form.Item>

          {/* Grid để chia đôi Họ và Tên */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="lastName"
              label="Họ"
              rules={[{ required: true, message: "Nhập họ!" }]}
            >
              <Input placeholder="Ví dụ: Nguyễn" />
            </Form.Item>

            <Form.Item
              name="firstName"
              label="Tên"
              rules={[{ required: true, message: "Nhập tên!" }]}
            >
              <Input placeholder="Ví dụ: Văn A" />
            </Form.Item>
          </div>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^0\d{9}$/,
                message:
                  "Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng 0)!",
              },
            ]}
          >
            <Input placeholder="Ví dụ: 0987654321" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Select.Option value="STUDENT">Học viên</Select.Option>
              <Select.Option value="INSTRUCTOR">Giảng viên</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              {modalMode === "create" ? "Tạo mới" : "Lưu thay đổi"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPage;
