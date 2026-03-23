import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Card,
  Typography,
  message,
  Modal,
  Tooltip,
  Form,
  Input,
  Space,
  Tag,
} from "antd";
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { categoryService } from "../services/category.service";
import type { AdminCategoryResponse } from "../@types/category.type";

const { Title } = Typography;

const generateSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "")
    .replace(/(\s+)/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<AdminCategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách danh mục!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleModalSubmit = async (values: any) => {
    setSubmitLoading(true);
    try {
      await categoryService.createCategory(values);
      message.success("Tạo danh mục thành công!");
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      message.error("Lỗi tạo danh mục, danh mục có thể đã tồn tại!");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = (category: AdminCategoryResponse) => {
    if (category.totalCourses > 0) {
      message.warning(
        `Không thể xóa danh mục đang chứa ${category.totalCourses} khóa học!`,
      );
      return;
    }

    Modal.confirm({
      title: "Xác nhận xóa danh mục",
      content: `Bạn có chắc chắn muốn xóa danh mục "${category.name}" không?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await categoryService.deleteCategory(category.id);
          message.success("Đã xóa danh mục thành công!");
          fetchCategories();
        } catch (error: any) {
          message.error("Lỗi khi xóa danh mục!");
        }
      },
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameValue = e.target.value;
    const autoSlug = generateSlug(nameValue);
    form.setFieldsValue({ slug: autoSlug });
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-bold text-gray-800">{text}</span>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (slug: string) => (
        <code className="bg-gray-100 px-2 py-0.5 rounded text-xs text-blue-600 font-mono">
          {slug}
        </code>
      ),
    },
    {
      title: "Số khóa học",
      dataIndex: "totalCourses",
      key: "totalCourses",
      align: "center" as const,
      render: (count: number) => (
        <Tag
          color={count > 0 ? "blue" : "default"}
          className="rounded-full px-3"
        >
          {count} khóa học
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (dateStr: string) => (
        <Space size={4} className="text-gray-500 text-sm">
          <CalendarOutlined className="text-xs" />
          {dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "-"}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right" as const,
      render: (_: any, record: AdminCategoryResponse) => (
        <Space size="middle">
          <Tooltip title={record.totalCourses > 0 ? "Đang có khóa học" : "Xóa"}>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              disabled={record.totalCourses > 0}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={3} className="!mb-0 text-gray-800">
          Quản lý danh mục
        </Title>
        <Button
          type="primary"
          icon={<AppstoreAddOutlined />}
          size="large"
          className="shadow-md bg-primary"
          onClick={() => {
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Thêm danh mục
        </Button>
      </div>

      <Card className="shadow-sm border-0 rounded-xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} danh mục`,
          }}
        />
      </Card>

      <Modal
        title="Thêm Danh Mục Mới"
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
            name="name"
            label="Tên danh mục"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục!" },
              { min: 3, message: "Tên danh mục ít nhất 3 ký tự!" },
            ]}
          >
            <Input
              placeholder="Ví dụ: Lập trình Web"
              onChange={handleNameChange}
            />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Đường dẫn (Slug)"
            rules={[{ required: true, message: "Vui lòng nhập slug!" }]}
          >
            <Input placeholder="Ví dụ: lap-trinh-web" />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Tạo danh mục
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
