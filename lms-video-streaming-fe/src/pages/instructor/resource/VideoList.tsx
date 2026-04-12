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
  Upload,
  Spin,
} from "antd";
import {
  PlayCircleOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import type { InstructorVideoResponse } from "../../../@types/instructor.types";
import { instructorService } from "../../../services/instructor.service";

const { Option } = Select;

const VideoList: React.FC = () => {
  const [videos, setVideos] = useState<InstructorVideoResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // --- States cho Modal Cập nhật ---
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingVideo, setEditingVideo] =
    useState<InstructorVideoResponse | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // --- States cho Modal Preview ---
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await instructorService.getVideos();
      setVideos(res.data || []);
    } catch (error) {
      message.error("Lỗi tải danh sách video");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((v) => {
    const matchName = v.title.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus ? v.status === filterStatus : true;
    return matchName && matchStatus;
  });

  const handleDelete = async (id: string) => {
    try {
      // await instructorService.deleteVideo(id);
      message.success(`Đã xóa video!`);
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      message.error("Lỗi khi xóa video");
    }
  };

  // --- Logic Xử lý Preview ---
  const handlePreview = async (video: InstructorVideoResponse) => {
    setIsPreviewModalOpen(true);
    setPreviewLoading(true);
    setPreviewData(null);
    try {
      const res = await instructorService.generateVideoPreview(video.id);
      setPreviewData(res.data);
    } catch (error) {
      message.error("Không thể khởi tạo luồng xem trước video!");
      setIsPreviewModalOpen(false);
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewData(null);
  };

  const openEditModal = (video: InstructorVideoResponse) => {
    setEditingVideo(video);
    setEditTitle(video.title);
    setEditImageFile(null);
    setFileList([]);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingVideo(null);
  };

  const handleUpdateSubmit = async () => {
    if (!editingVideo) return;
    if (!editTitle.trim())
      return message.warning("Tên video không được để trống!");

    try {
      const payload = { videoId: editingVideo.id, title: editTitle };
      await instructorService.updateVideo(payload, editImageFile);
      message.success("Cập nhật thông tin video thành công!");
      fetchVideos();
      closeEditModal();
    } catch (error) {
      message.error("Cập nhật thất bại!");
    }
  };

  const columns = [
    {
      title: "Tên Video",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: InstructorVideoResponse) => (
        <div className="flex items-center space-x-3">
          <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center overflow-hidden border">
            {record.thumbnail ? (
              <img
                src={record.thumbnail}
                alt="thumb"
                className="object-cover w-full h-full"
              />
            ) : (
              <PlayCircleOutlined className="text-gray-400 text-lg" />
            )}
          </div>
          <span className="font-semibold text-gray-800">{text}</span>
        </div>
      ),
    },
    {
      title: "Dung lượng",
      dataIndex: "size",
      key: "size",
      width: 120,
      render: (size: number) => (
        <span className="text-gray-500 font-medium">
          {(size / (1024 * 1024)).toFixed(2)} MB
        </span>
      ),
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
      width: 120,
      render: (sec: number) => (
        <span className="text-gray-500 font-medium">
          {Math.floor(sec / 60)}p {sec % 60}s
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          READY: { color: "success", text: "Đã duyệt" },
          PENDING_REVIEW: { color: "processing", text: "Chờ kiểm duyệt" },
          PENDING: { color: "warning", text: "Đang xử lý/Nháp" },
          FAILURE: { color: "error", text: "Lỗi xử lý" },
          DELETED: { color: "default", text: "Đã xóa" },
        };
        const s = statusMap[status] || { color: "default", text: status };
        return (
          <Tag color={s.color} className="font-medium px-2 py-1">
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
      render: (_: any, record: InstructorVideoResponse) => (
        <Space size="small">
          <Button
            type="default"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
            className="text-gray-600 hover:text-blue-600"
          >
            Preview
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
            title="Xóa video này?"
            description="Video sẽ bị xóa vĩnh viễn khỏi hệ thống."
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
              placeholder="Tìm kiếm video..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className="w-full md:w-72"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
            <Select
              placeholder="Lọc trạng thái"
              className="w-40"
              allowClear
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
            >
              <Option value="READY">Đã duyệt</Option>
              <Option value="PENDING_REVIEW">Chờ kiểm duyệt</Option>
              <Option value="PENDING">Đang xử lý</Option>
              <Option value="FAILURE">Lỗi xử lý</Option>
              <Option value="DELETED">Đã xóa</Option>
            </Select>
          </div>
          <div className="text-gray-500 font-medium bg-gray-100 px-4 py-2 rounded-lg">
            Tổng:{" "}
            <span className="text-blue-600 font-bold">
              {filteredVideos.length}
            </span>{" "}
            video
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredVideos}
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

      {/* --- Modal Xem trước Video (Preview) --- */}
      <Modal
        title={
          <span className="text-lg font-bold">
            Tiêu đề Video: {previewData?.title}
          </span>
        }
        open={isPreviewModalOpen}
        onCancel={closePreviewModal}
        footer={[
          <Button key="close" onClick={closePreviewModal}>
            Đóng
          </Button>,
        ]}
        width={900}
        centered
        destroyOnClose
      >
        <div className="bg-black rounded-lg overflow-hidden flex items-center justify-center min-h-[450px]">
          {previewLoading ? (
            <div className="text-center">
              <Spin
                size="large"
                tip="Đang tải luồng video..."
                className="text-white"
              />
            </div>
          ) : (
            previewData?.url && (
              <video
                controls
                autoPlay
                className="w-full max-h-[600px]"
                controlsList="nodownload"
              >
                <source src={previewData.url} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ thẻ video.
              </video>
            )
          )}
        </div>
      </Modal>

      {/* --- Modal Cập nhật Thông tin --- */}
      <Modal
        title={<span className="text-lg font-bold">Cập nhật Video</span>}
        open={isEditModalOpen}
        onOk={handleUpdateSubmit}
        onCancel={closeEditModal}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        centered
        destroyOnClose
      >
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tên Video <span className="text-red-500">*</span>
            </label>
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Nhập tên video mới..."
              size="large"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Cập nhật Thumbnail (Tùy chọn)
            </label>
            <Upload
              beforeUpload={(file) => {
                setEditImageFile(file);
                setFileList([file]);
                return false;
              }}
              onRemove={() => {
                setEditImageFile(null);
                setFileList([]);
              }}
              fileList={fileList}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
            </Upload>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VideoList;
