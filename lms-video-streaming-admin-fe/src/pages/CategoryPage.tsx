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
  Avatar,
} from "antd";
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  PictureOutlined,
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
    if (category.countCourses > 0) {
      message.warning(
        `Không thể xóa danh mục đang chứa ${category.countCourses} khóa học!`,
      );
      return;
    }

    Modal.confirm({
      title: "Xác nhận xóa danh mục",
      content: `Bạn có chắc chắn muốn xóa danh mục "${category.name}" không? Hành động này không thể hoàn tác.`,
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
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      width: 80,
      align: "center" as const,
      render: (iconUrl: string) => (
        <Avatar
          shape="square"
          src={iconUrl}
          icon={<PictureOutlined />}
          className="bg-blue-50 border border-blue-100 text-blue-400"
        />
      ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-semibold text-gray-800">{text}</span>
      ),
    },
    {
      title: "Đường dẫn (Slug)",
      dataIndex: "slug",
      key: "slug",
      render: (slug: string) => (
        <Tag color="default" className="font-mono text-xs">
          {slug}
        </Tag>
      ),
    },
    {
      title: "Số khóa học",
      dataIndex: "countCourses",
      key: "countCourses",
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
      render: (dateStr: string) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return (
          <span className="text-gray-500 text-sm">
            {date.toLocaleDateString("vi-VN")}
          </span>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right" as const,
      render: (_: any, record: AdminCategoryResponse) => (
        <Space size="middle">
          <Tooltip
            title={
              record.countCourses > 0
                ? "Danh mục đang có khóa học"
                : "Xóa danh mục"
            }
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              disabled={record.countCourses > 0}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Title level={3} className="!mb-0 text-gray-800">
          Quản lý danh mục
        </Title>
        <Button
          type="primary"
          icon={<AppstoreAddOutlined />}
          size="large"
          className="shadow-md"
          onClick={() => {
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Thêm danh mục
        </Button>
      </div>

      <Card className="shadow-sm border-0 rounded-xl">
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
          className="overflow-x-auto"
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
              { min: 3, message: "Tên danh mục phải có ít nhất 3 ký tự!" },
            ]}
          >
            <Input
              placeholder="Ví dụ: Lập trình Web"
              onChange={handleNameChange}
            />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Đường dẫn"
            rules={[
              { required: true, message: "Vui lòng nhập slug!" },
              {
                pattern: /^[a-z0-9-]+$/,
                message: "Slug chỉ chứa chữ thường, số và dấu gạch ngang!",
              },
            ]}
          >
            <Input placeholder="Ví dụ: lap-trinh-web" />
          </Form.Item>

          <Form.Item
            name="icon"
            label="Đường dẫn Icon (URL)"
            rules={[{ type: "url", message: "Đường dẫn không hợp lệ!" }]}
          >
            <Input placeholder="https://example.com/icon.png" />
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
