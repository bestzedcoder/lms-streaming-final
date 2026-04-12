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
  Empty,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import type { AdminLecturePreview } from "../@types/resource.type";
import { resourceService } from "../services/resource.service";

const LecturePreviewPage: React.FC = () => {
  const [data, setData] = useState<AdminLecturePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await resourceService.getLecturePreviews();
      setData(res.data || []);
    } catch (error) {
      message.error("Lỗi tải danh sách tài liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await resourceService.approveLecture(id);
      message.success("Đã phê duyệt tài liệu");
      fetchData();
    } catch (error) {
      message.error("Thao tác thất bại");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await resourceService.rejectLecture(id);
      message.warning("Đã từ chối tài liệu");
      fetchData();
    } catch (error) {
      message.error("Thao tác thất bại");
    }
  };

  const handlePreview = async (id: string) => {
    setIsPreviewOpen(true);
    setPreviewLoading(true);
    try {
      const res = await resourceService.getLecturePresignedUrl(id);
      setPreviewUrl(res.data);
    } catch (error) {
      message.error("Lỗi lấy link tài liệu");
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
    { title: "Tài liệu", dataIndex: "title", key: "title" },
    {
      title: "Giảng viên",
      dataIndex: "owner",
      key: "owner",
      render: (e: string) => <Tag color="blue">{e}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s: string) => (
        <Tag color={s === "APPROVED" ? "green" : "orange"}>{s}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "right" as const,
      render: (_: any, record: AdminLecturePreview) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record.lectureId)}
          >
            Xem
          </Button>
          <Popconfirm
            title="Duyệt tài liệu này?"
            onConfirm={() => handleApprove(record.lectureId)}
          >
            <Button type="primary" icon={<CheckCircleOutlined />}>
              Duyệt
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Từ chối tài liệu?"
            onConfirm={() => handleReject(record.lectureId)}
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
    <Card title="Kiểm duyệt Tài liệu PDF/Slide">
      <Input
        placeholder="Tìm theo email hoặc tiêu đề tài liệu..."
        prefix={<SearchOutlined />}
        className="mb-4 max-w-md"
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="lectureId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={
          <div className="flex justify-between items-center pr-8">
            <span>Xem trước tài liệu</span>
            {previewUrl && (
              <Button
                size="small"
                icon={<DownloadOutlined />}
                href={previewUrl}
                target="_blank"
              >
                Tải về
              </Button>
            )}
          </div>
        }
        open={isPreviewOpen}
        onCancel={() => setIsPreviewOpen(false)}
        footer={null}
        width="80%"
        style={{ top: 20 }}
        destroyOnClose
      >
        <div className="h-[75vh] bg-gray-100 rounded flex items-center justify-center">
          {previewLoading ? (
            <Spin size="large" />
          ) : previewUrl ? (
            <iframe
              src={`${previewUrl}#toolbar=0`}
              width="100%"
              height="100%"
              className="border-none"
            />
          ) : (
            <Empty />
          )}
        </div>
      </Modal>
    </Card>
  );
};

export default LecturePreviewPage;
