import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Card,
  Typography,
  Space,
  Modal,
  message,
  Tooltip,
  Badge,
} from "antd";
import {
  CheckCircleOutlined,
  EyeOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import type { CourseRequestResponse } from "../@types/request.type";
import { requestService } from "../services/request.service";
import { useNotification } from "../context/NotificationContext";

const { Title, Text } = Typography;

const CourseRequestManager: React.FC = () => {
  const [requests, setRequests] = useState<CourseRequestResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { fetchPendingCourseRequestCount } = useNotification();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await requestService.getCourseRequests();
      setRequests(res.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 2. Xử lý yêu cầu (Phê duyệt/Đã xem)
  const handleResolve = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xử lý",
      content: "Bạn đánh dấu yêu cầu này đã được giải quyết?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await requestService.handleCourseRequest(id);
          message.success("Đã xử lý yêu cầu thành công");
          // Refresh dữ liệu và cập nhật số lượng thông báo ở Header
          fetchRequests();
          fetchPendingCourseRequestCount();
        } catch (error) {
          message.error("Lỗi khi xử lý yêu cầu");
        }
      },
    });
  };

  const columns = [
    {
      title: "Loại yêu cầu",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag
          color={type === "COURSE_REPORT" ? "error" : "processing"}
          className="rounded-md font-medium px-3 py-0.5"
        >
          {type === "COURSE_REPORT" ? "BÁO CÁO VI PHẠM" : "YÊU CẦU GIÁO VIÊN"}
        </Tag>
      ),
    },
    {
      title: "Đối tượng (Khóa học/GV)",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <Text strong className="text-blue-700">
          {text}
        </Text>
      ),
    },
    {
      title: "Nội dung phản hồi",
      dataIndex: "report",
      key: "report",
      width: "35%",
      render: (report: string) => (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 italic text-gray-600 text-sm">
          {report || "Không có mô tả chi tiết"}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) =>
        status ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã xử lý
          </Tag>
        ) : (
          <Badge status="processing" text="Đang chờ" />
        ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      render: (_: any, record: CourseRequestResponse) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết khóa học/giảng viên">
            <Button
              icon={<EyeOutlined />}
              onClick={() =>
                message.info("Chức năng Modal chi tiết sẽ cập nhật sau")
              }
            />
          </Tooltip>

          {!record.status && (
            <Button
              type="primary"
              className="bg-green-600 hover:bg-green-700 border-none rounded-lg"
              icon={<CheckCircleOutlined />}
              onClick={() => handleResolve(record.id)}
            >
              Giải quyết
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Title level={3} className="!mb-1">
            Quản lý Yêu cầu & Báo cáo
          </Title>
          <Text type="secondary">
            Xử lý các khiếu nại từ học viên và yêu cầu đặc biệt từ giảng viên.
          </Text>
        </div>
        <Button
          icon={<HistoryOutlined />}
          onClick={fetchRequests}
          loading={loading}
          className="rounded-lg"
        >
          Làm mới
        </Button>
      </div>

      <Card className="shadow-sm rounded-2xl border-gray-100 overflow-hidden">
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "Hiện tại không có yêu cầu nào cần xử lý" }}
        />
      </Card>
    </div>
  );
};

export default CourseRequestManager;
