import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Input,
  Modal,
  Card,
  Spin,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { AdminVideoPreview } from "../@types/resource.type";
import { resourceService } from "../services/resource.service";

const VideoPreviewPage: React.FC = () => {
  const [data, setData] = useState<AdminVideoPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Preview States
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await resourceService.getVideoPreviews();
      setData(res.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách video kiểm duyệt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await resourceService.approveVideo(id);
      message.success("Đã phê duyệt video");
      fetchData();
    } catch (error) {
      message.error("Phê duyệt thất bại");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await resourceService.rejectVideo(id);
      message.error("Đã từ chối video");
      fetchData();
    } catch (error) {
      message.error("Từ chối thất bại");
    }
  };

  const handlePreview = async (id: string) => {
    setIsPreviewOpen(true);
    setPreviewLoading(true);
    try {
      const res = await resourceService.getVideoPresignedUrl(id);
      setPreviewUrl(res.data);
    } catch (error) {
      message.error("Lỗi lấy link video");
      setIsPreviewOpen(false);
    } finally {
      setPreviewLoading(false);
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.owner.toLowerCase().includes(searchText.toLowerCase()) ||
      item.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (t: string) => <b>{t}</b>,
    },
    {
      title: "Người đăng (Email)",
      dataIndex: "owner",
      key: "owner",
      render: (e: string) => <Tag icon={<UserOutlined />}>{e}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s: string) => {
        const colors = {
          PENDING_REVIEW: "processing",
          READY: "success",
          FAILURE: "error",
          PENDING: "warning",
          DELETED: "default",
        };
        return <Tag color={(colors as any)[s]}>{s}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right" as const,
      render: (_: any, record: AdminVideoPreview) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record.videoId)}
          >
            Preview
          </Button>
          <Popconfirm
            title="Phê duyệt video này?"
            onConfirm={() => handleApprove(record.videoId)}
            okText="Duyệt"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              className="bg-green-600"
            >
              Duyệt
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Từ chối video này?"
            onConfirm={() => handleReject(record.videoId)}
            okText="Từ chối"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<CloseCircleOutlined />}>
              Reject
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Phê duyệt Video bài giảng">
      <Input
        placeholder="Lọc theo email chủ sở hữu hoặc tiêu đề..."
        prefix={<SearchOutlined />}
        className="mb-4 max-w-md"
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="videoId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Xem trước Video bài giảng (Gốc)"
        open={isPreviewOpen}
        onCancel={() => {
          setIsPreviewOpen(false);
          setPreviewUrl("");
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <div className="bg-black rounded overflow-hidden min-h-[400px] flex items-center justify-center">
          {previewLoading ? (
            <Spin tip="Đang lấy luồng video..." />
          ) : (
            <video controls autoPlay className="w-full">
              <source src={previewUrl} type="video/mp4" />
            </video>
          )}
        </div>
      </Modal>
    </Card>
  );
};

export default VideoPreviewPage;
