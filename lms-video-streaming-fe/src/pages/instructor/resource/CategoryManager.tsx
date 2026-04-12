import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Space,
  Tag,
  Popconfirm,
  message,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { QuestionCategoryResponse } from "../../../@types/instructor.types";
import { instructorService } from "../../../services/instructor.service";

const CategoryManager: React.FC = () => {
  // --- STATES ---
  const [categories, setCategories] = useState<QuestionCategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] =
    useState<QuestionCategoryResponse | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");

  // --- LẤY DỮ LIỆU ---
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await instructorService.getQuestionCategories();
      setCategories(response.data || []);
    } catch (error) {
      message.error("Lỗi khi tải danh sách danh mục!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- QUẢN LÝ MODAL ---
  const handleOpenModal = (category?: QuestionCategoryResponse) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
    } else {
      setEditingCategory(null);
      setCategoryName("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setCategoryName("");
  };

  // --- SUBMIT ---
  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      return message.warning("Vui lòng nhập tên danh mục!");
    }

    try {
      if (editingCategory) {
        await instructorService.updateQuestionCategory({
          categoryId: editingCategory.id,
          name: categoryName,
        });
        message.success("Cập nhật danh mục thành công!");
      } else {
        await instructorService.createQuestionCategory({
          name: categoryName,
        });
        message.success("Tạo danh mục thành công!");
      }
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu dữ liệu!");
    }
  };

  // --- XÓA DANH MỤC ---
  const handleDelete = async (
    categoryId: string,
    name: string,
    totalQuestions: number,
  ) => {
    if (totalQuestions > 0) {
      message.warning(
        `Không thể xóa! Danh mục "${name}" đang chứa ${totalQuestions} câu hỏi.`,
      );
      return;
    }

    try {
      await instructorService.deleteQuestionCategory(categoryId);
      message.success("Đã xóa danh mục thành công!");
      fetchCategories();
    } catch (error) {
      message.error("Lỗi khi xóa danh mục!");
    }
  };

  // --- CẤU HÌNH CỘT CHO BẢNG ANTD ---
  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-semibold text-gray-800">{text}</span>
      ),
    },
    {
      title: "Số câu hỏi",
      dataIndex: "totalQuestions",
      key: "totalQuestions",
      width: 150,
      render: (total: number) => (
        <Tag
          color="blue"
          className="px-3 py-1 rounded-full font-medium text-sm"
        >
          {total} câu
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right" as const,
      width: 200,
      render: (_: any, record: QuestionCategoryResponse) => (
        <Space size="middle">
          <Button
            type="text"
            className="text-blue-600 hover:text-blue-800 font-medium"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa danh mục"
            description={`Bạn có chắc chắn muốn xóa "${record.name}" không?`}
            onConfirm={() =>
              handleDelete(record.id, record.name, record.totalQuestions)
            }
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className="font-medium"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Danh sách danh mục</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 font-medium h-10 px-4"
        >
          Thêm danh mục
        </Button>
      </div>

      {/* TABLE */}
      <Table
        dataSource={categories}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        className="border border-gray-100 rounded-lg shadow-sm"
      />

      {/* MODAL THÊM / SỬA */}
      <Modal
        title={
          <span className="text-lg font-bold">
            {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </span>
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCloseModal}
        okText={editingCategory ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        destroyOnClose // Đảm bảo clear dữ liệu rác khi đóng Modal
        centered
      >
        <div className="pt-4 pb-2">
          <div className="mb-2 font-medium text-gray-700">
            Tên danh mục <span className="text-red-500">*</span>
          </div>
          <Input
            placeholder="Nhập tên danh mục..."
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            onPressEnter={handleSubmit} // Nhấn phím Enter để Lưu luôn không cần dùng chuột
            size="large"
            className="rounded-lg"
          />
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManager;
