import React from "react";
import { Table, Tag, Space, Progress, Typography, Card } from "antd";
import { UserOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const mockStudentProgress = [
  {
    id: "SV01",
    name: "Nguyễn Văn A",
    progress: 85,
    watchTime: "12 giờ 30 phút",
    lastActive: "2026-05-16 10:20",
  },
  {
    id: "SV02",
    name: "Trần Thị B",
    progress: 40,
    watchTime: "5 giờ 15 phút",
    lastActive: "2026-05-15 16:45",
  },
  {
    id: "SV03",
    name: "Lê Hoàng C",
    progress: 100,
    watchTime: "18 giờ 00 phút",
    lastActive: "2026-05-16 11:05",
  },
  {
    id: "SV04",
    name: "Phạm Minh D",
    progress: 15,
    watchTime: "1 giờ 45 phút",
    lastActive: "2026-05-10 09:12",
  },
];

const StudentEngagementTab: React.FC = () => {
  const studentColumns = [
    {
      title: "Mã SV",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id: string) => <Tag className="m-0 font-mono">{id}</Tag>,
    },
    {
      title: "Họ và tên học viên",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <Space>
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
            <UserOutlined />
          </div>
          <Text strong className="text-gray-700">
            {text}
          </Text>
        </Space>
      ),
    },
    {
      title: "Tiến độ khóa học",
      dataIndex: "progress",
      key: "progress",
      width: 250,
      render: (progress: number) => (
        <Progress
          percent={progress}
          size="small"
          status={progress === 100 ? "success" : "active"}
          strokeColor={progress === 100 ? "#52c41a" : "#1677ff"}
        />
      ),
    },
    {
      title: "Thời lượng xem Video",
      dataIndex: "watchTime",
      key: "watchTime",
      width: 180,
      render: (time: string) => (
        <span className="text-gray-600 font-medium">
          <ClockCircleOutlined className="mr-1 text-gray-400" /> {time}
        </span>
      ),
    },
    {
      title: "Hoạt động gần nhất",
      dataIndex: "lastActive",
      key: "lastActive",
      align: "right" as const,
      width: 180,
      render: (date: string) => (
        <Text type="secondary" className="text-xs">
          {date}
        </Text>
      ),
    },
  ];

  return (
    <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden animate-fade-in">
      <Table
        dataSource={mockStudentProgress}
        columns={studentColumns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default StudentEngagementTab;
