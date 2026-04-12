import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Typography,
  Card,
  Input,
  Button,
  Tag,
  Space,
  Avatar,
  message,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  CheckOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { requestService } from "../services/request.service";
import { useNotification } from "../context/NotificationContext";
import type { InstructorRequestResponse } from "../@types/request.type";

const { Title, Text } = Typography;

const InstructorRequestPage: React.FC = () => {
  const [requests, setRequests] = useState<InstructorRequestResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { decreaseInstructorCount } = useNotification();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await requestService.getInstructorRequests();
      setRequests(res.data);
    } catch (error: any) {
      console.error("Lỗi khi tải danh sách yêu cầu:", error);
      message.error("Không thể tải danh sách yêu cầu giảng viên.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    if (!searchText) return requests;
    return requests.filter((req) =>
      req.user.email.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [requests, searchText]);

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id);
      await requestService.handleInstructorRequest(id);
      message.success("Đã cấp quyền giảng viên thành công!");

      setRequests((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: true } : item)),
      );

      decreaseInstructorCount(1);
    } catch (error: any) {
      console.error("Lỗi duyệt yêu cầu:", error);
      message.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi phê duyệt.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    {
      title: "Thông tin người dùng",
      key: "user",
      render: (_: any, record: InstructorRequestResponse) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.user.avatarUrl} icon={<UserOutlined />} />
          <div>
            <div className="font-bold text-gray-800">
              {record.user.fullName}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <MailOutlined /> {record.user.email}
            </div>
            {record.user.phone && (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <PhoneOutlined /> {record.user.phone}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Lời nhắn (Mô tả)",
      dataIndex: "description",
      key: "description",
      width: "35%",
      render: (text: string) => (
        <Text
          ellipsis={{ tooltip: text }}
          className="text-gray-600 italic"
          style={{ maxWidth: 300 }}
        >
          {text || "Không có lời nhắn"}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: boolean) => (
        <Tag color={status ? "green" : "orange"} className="font-medium">
          {status ? "Đã duyệt" : "Chờ phê duyệt"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      render: (_: any, record: InstructorRequestResponse) => {
        if (record.status) {
          return (
            <Text type="secondary" className="text-sm">
              Đã hoàn thành
            </Text>
          );
        }

        return (
          <Popconfirm
            title="Cấp quyền giảng viên"
            description={`Bạn có chắc chắn muốn cấp quyền giảng viên cho ${record.user.fullName}?`}
            onConfirm={() => handleApprove(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
            placement="left"
          >
            <Button
              type="primary"
              icon={<CheckOutlined />}
              loading={actionLoading === record.id}
              className="bg-green-500 hover:bg-green-600 border-none"
            >
              Phê duyệt
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Title level={3} className="m-0 text-gray-800">
          Phê duyệt Giảng viên
        </Title>
        <Text type="secondary">
          Quản lý và xét duyệt các yêu cầu trở thành giảng viên từ học viên.
        </Text>
      </div>

      <Card className="shadow-sm border-gray-200 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <Input
            placeholder="Tìm kiếm theo email người dùng..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="max-w-md rounded-lg"
            size="large"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Space>
            <Text type="secondary">
              Tổng số: <strong>{filteredRequests.length}</strong> yêu cầu
            </Text>
            <Button onClick={fetchRequests} loading={loading}>
              Làm mới
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredRequests}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} mục`,
          }}
          className="border border-gray-100 rounded-lg overflow-hidden"
        />
      </Card>
    </div>
  );
};

export default InstructorRequestPage;
