import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Input,
  Select,
  Card,
  Modal,
  Spin,
  Empty,
} from "antd";
import {
  FileTextOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  DownloadOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import type { InstructorLectureResponse } from "../../../@types/instructor.types";
import { instructorService } from "../../../services/instructor.service";

const { Option } = Select;

const LectureList: React.FC = () => {
  // --- STATES DỮ LIỆU ---
  const [lectures, setLectures] = useState<InstructorLectureResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // --- STATES BỘ LỌC ---
  const [searchText, setSearchText] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // --- STATES MODAL CẬP NHẬT ---
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingLecture, setEditingLecture] =
    useState<InstructorLectureResponse | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");

  // --- STATES MODAL PREVIEW ---
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);

  const fetchLectures = async () => {
    setLoading(true);
    try {
      const res = await instructorService.getLectures();
      setLectures(res.data || []);
    } catch (error) {
      message.error("Lỗi tải danh sách tài liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  const filteredLectures = lectures.filter((l) => {
    const matchName = l.title.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus ? l.status === filterStatus : true;
    return matchName && matchStatus;
  });

  const handleDelete = async (id: string) => {
    try {
      // await instructorService.deleteLecture(id);
      message.success(`Đã xóa tài liệu!`);
      setLectures((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      message.error("Lỗi khi xóa tài liệu!");
    }
  };

  const handlePreview = async (lecture: InstructorLectureResponse) => {
    setIsPreviewModalOpen(true);
    setPreviewLoading(true);
    setPreviewData(null);
    try {
      const res = await instructorService.generateLecturePreview(lecture.id);
      setPreviewData(res.data);
    } catch (error) {
      message.error("Không thể khởi tạo luồng xem trước tài liệu!");
      setIsPreviewModalOpen(false);
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewData(null);
  };

  const openEditModal = (lecture: InstructorLectureResponse) => {
    setEditingLecture(lecture);
    setEditTitle(lecture.title);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingLecture(null);
  };

  const handleUpdateSubmit = async () => {
    if (!editingLecture) return;
    if (!editTitle.trim())
      return message.warning("Tên tài liệu không được để trống!");

    try {
      const payload = { resourceId: editingLecture.id, title: editTitle };
      await instructorService.updateLecture(payload);

      message.success("Cập nhật tên tài liệu thành công!");

      setLectures((prev) =>
        prev.map((l) =>
          l.id === editingLecture.id ? { ...l, title: editTitle } : l,
        ),
      );
      closeEditModal();
    } catch (error) {
      message.error("Cập nhật tài liệu thất bại!");
    }
  };

  const columns = [
    {
      title: "Tên Tài Liệu",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded flex items-center justify-center border border-blue-100">
            <FileTextOutlined className="text-xl" />
          </div>
          <span className="font-semibold text-gray-800">{text}</span>
        </div>
      ),
    },
    {
      title: "Dung lượng",
      dataIndex: "size",
      key: "size",
      width: 150,
      render: (size: number) => (
        <span className="text-gray-500 font-medium">
          {(size / (1024 * 1024)).toFixed(2)} MB
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 180,
      render: (status: string) => {
        const statusMap: Record<
          string,
          { color: string; text: string; icon?: React.ReactNode }
        > = {
          APPROVED: { color: "success", text: "Đã duyệt" },
          PENDING_REVIEW: { color: "processing", text: "Chờ kiểm duyệt" },
          VALIDATING: {
            color: "cyan",
            text: "Đang kiểm tra",
            icon: <SyncOutlined spin />,
          },
          DELETED: { color: "default", text: "Đã xóa" },
        };
        const s = statusMap[status] || { color: "default", text: status };
        return (
          <Tag
            icon={s.icon}
            color={s.color}
            className="font-medium px-3 py-1 text-sm"
          >
            {s.text}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right" as const,
      width: 250,
      render: (_: any, record: InstructorLectureResponse) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Xem
          </Button>
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa tài liệu này?"
            description="Bạn có chắc chắn muốn xóa tài liệu này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade-in p-6 bg-gray-50 min-h-screen">
      <Card className="shadow-sm rounded-xl border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex w-full md:w-auto space-x-3">
            <Input
              placeholder="Tìm kiếm tài liệu..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className="w-full md:w-72"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />

            <Select
              placeholder="Lọc trạng thái"
              className="w-48"
              allowClear
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
            >
              <Option value="APPROVED">Đã duyệt</Option>
              <Option value="PENDING_REVIEW">Chờ kiểm duyệt</Option>
              <Option value="VALIDATING">Đang kiểm tra</Option>
              <Option value="DELETED">Đã xóa</Option>
            </Select>
          </div>

          <div className="text-gray-500 font-medium bg-gray-100 px-4 py-2 rounded-lg">
            Tổng:{" "}
            <span className="text-blue-600 font-bold">
              {filteredLectures.length}
            </span>{" "}
            tài liệu
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredLectures}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            position: ["bottomCenter"],
          }}
          bordered={false}
          className="border-t"
        />
      </Card>

      <Modal
        title={
          <div className="flex justify-between items-center pr-10">
            <span className="text-lg font-bold truncate max-w-[500px]">
              Xem trước: {previewData?.title}
            </span>
            {previewData?.url && (
              <Button
                type="primary"
                size="small"
                icon={<DownloadOutlined />}
                href={previewData.url}
                target="_blank"
                download
              >
                Tải về máy
              </Button>
            )}
          </div>
        }
        open={isPreviewModalOpen}
        onCancel={closePreviewModal}
        footer={[
          <Button key="close" onClick={closePreviewModal}>
            Đóng
          </Button>,
        ]}
        width="90%"
        style={{ top: 20 }}
        centered
        destroyOnClose
      >
        <div
          className="bg-gray-100 rounded-lg flex items-center justify-center"
          style={{ height: "80vh" }}
        >
          {previewLoading ? (
            <Spin size="large" tip="Đang tải luồng tài liệu bảo mật..." />
          ) : previewData?.url ? (
            <iframe
              src={`${previewData.url}#toolbar=1`}
              width="100%"
              height="100%"
              className="rounded-lg border-none"
              title={previewData.title}
            />
          ) : (
            <Empty description="Không tìm thấy nội dung tài liệu hoặc định dạng không hỗ trợ xem trực tiếp." />
          )}
        </div>
      </Modal>

      <Modal
        title={<span className="text-lg font-bold">Cập nhật Tài liệu</span>}
        open={isEditModalOpen}
        onOk={handleUpdateSubmit}
        onCancel={closeEditModal}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        centered
        destroyOnClose
      >
        <div className="pt-4 pb-2">
          <div className="mb-2 font-medium text-gray-700">
            Tên tài liệu <span className="text-red-500">*</span>
          </div>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Nhập tên tài liệu mới (VD: slide_bai_1.pdf)..."
            size="large"
            className="rounded-lg"
            onPressEnter={handleUpdateSubmit}
          />
        </div>
      </Modal>
    </div>
  );
};

export default LectureList;
