import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Card,
  Typography,
  Tooltip,
  Popconfirm,
  Tag,
  Avatar,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { adminService } from "../../services/admin.service";
import type {
  AdminCategoryResponse,
  AdminCategoryCreatingRequest,
  AdminCategoryUpdatingRequest,
} from "../../types/admin.types";

const { Title, Text } = Typography;

const CategoryManagerPage = () => {
  const [categories, setCategories] = useState<AdminCategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<AdminCategoryResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();

  // --- 1. FETCH DATA ---
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCategories();
      if (res.data) {
        // Sắp xếp theo ngày tạo mới nhất
        const sorted = res.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setCategories(sorted);
      }
    } catch (error) {
      message.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- 2. HANDLERS ---

  // Mở modal tạo mới
  const handleOpenCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const handleOpenEdit = (record: AdminCategoryResponse) => {
    setEditingCategory(record);
    form.setFieldsValue({
      name: record.name,
      slug: record.slug,
      icon: record.icon,
    });
    setIsModalOpen(true);
  };

  // Xử lý Submit (Create & Update)
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      if (editingCategory) {
        // Update
        const payload: AdminCategoryUpdatingRequest = {
          name: values.name,
          slug: values.slug,
          icon: values.icon,
        };
        await adminService.updateCategory(editingCategory.id, payload);
        message.success("Cập nhật danh mục thành công");
      } else {
        // Create
        const payload: AdminCategoryCreatingRequest = {
          name: values.name,
          slug: values.slug,
          icon: values.icon,
        };
        await adminService.createCategory(payload);
        message.success("Tạo danh mục mới thành công");
      }
      setIsModalOpen(false);
      fetchCategories(); // Reload lại bảng
    } catch (error) {
      message.error("Đã có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý Xóa
  const handleDelete = async (id: string) => {
    try {
      await adminService.deleteCategory(id);
      message.success("Đã xóa danh mục");
      fetchCategories();
    } catch (error) {
      message.error("Không thể xóa danh mục này");
    }
  };

  // Helper tạo slug tự động
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Chỉ auto-slug khi đang tạo mới
    if (!editingCategory) {
      const title = e.target.value;
      const slug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/([^0-9a-z-\s])/g, "")
        .replace(/(\s+)/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      form.setFieldsValue({ slug });
    }
  };

  // --- 3. TABLE CONFIG ---
  const filteredData = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchText.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns = [
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      width: 80,
      align: "center" as const,
      render: (icon: string) => (
        <Avatar
          shape="square"
          size="large"
          src={icon}
          icon={<AppstoreOutlined />}
          className="bg-indigo-50 text-indigo-500 border border-indigo-100"
        />
      ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-semibold text-gray-700">{text}</span>
      ),
    },
    {
      title: "Slug (Đường dẫn)",
      dataIndex: "slug",
      key: "slug",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 150,
      render: (date: string) => (
        <span className="text-gray-500 text-sm">
          {new Date(date).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      align: "right" as const,
      render: (_: any, record: AdminCategoryResponse) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa danh mục?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button danger size="small" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Title level={3} className="!mb-0">
            Quản lý Danh mục
          </Title>
          <Text type="secondary">Phân loại các khóa học trong hệ thống</Text>
        </div>
        <div className="flex gap-2">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Tìm danh mục..."
            className="w-64"
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Button icon={<ReloadOutlined />} onClick={fetchCategories}>
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
            className="bg-indigo-600"
          >
            Thêm mới
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <Card
        bordered={false}
        className="shadow-sm rounded-xl"
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* MODAL CREATE / EDIT */}
      <Modal
        title={editingCategory ? "Cập nhật danh mục" : "Tạo danh mục mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={form.submit}
        confirmLoading={submitting}
        okText={editingCategory ? "Lưu thay đổi" : "Tạo mới"}
        cancelText="Hủy bỏ"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="pt-4"
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input
              placeholder="Ví dụ: Công nghệ thông tin"
              onChange={handleNameChange}
            />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug (Đường dẫn)"
            rules={[{ required: true, message: "Vui lòng nhập slug" }]}
            tooltip="Đường dẫn URL thân thiện cho SEO"
          >
            <Input placeholder="cong-nghe-thong-tin" />
          </Form.Item>

          <Form.Item
            name="icon"
            label="Icon (URL Ảnh)"
            tooltip="Nhập đường dẫn ảnh icon hoặc logo"
          >
            <Input
              placeholder="https://example.com/icon.png"
              prefix={<AppstoreOutlined className="text-gray-400" />}
            />
          </Form.Item>

          {/* Preview Icon nếu có link */}
          <Form.Item shouldUpdate={(prev, curr) => prev.icon !== curr.icon}>
            {({ getFieldValue }) => {
              const iconUrl = getFieldValue("icon");
              return iconUrl ? (
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded border border-gray-100">
                  <Avatar
                    shape="square"
                    src={iconUrl}
                    icon={<AppstoreOutlined />}
                  />
                  <span className="text-xs text-gray-500">Xem trước icon</span>
                </div>
              ) : null;
            }}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagerPage;
