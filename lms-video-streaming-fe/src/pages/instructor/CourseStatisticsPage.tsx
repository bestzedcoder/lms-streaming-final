import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, Space, Tabs, Empty } from "antd";
import {
  ArrowLeftOutlined,
  BarChartOutlined,
  FileDoneOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import OverviewTab from "./components/OverviewTab";
import QuizReportsTab from "./components/QuizReportsTab";
import StudentEngagementTab from "./components/StudentEngagementTab";

const { Title, Text } = Typography;

const CourseStatisticsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  if (!courseId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Empty description="Không tìm thấy mã khóa học!" />
      </div>
    );
  }

  const items = [
    {
      key: "overview",
      label: (
        <Space>
          <BarChartOutlined />
          Tổng quan khóa học
        </Space>
      ),
      children: <OverviewTab courseId={courseId} />,
    },
    {
      key: "quizzes",
      label: (
        <Space>
          <FileDoneOutlined />
          Bảng điểm bài tập & Excel
        </Space>
      ),
      children: <QuizReportsTab courseId={courseId} />,
    },
    {
      key: "engagement",
      label: (
        <Space>
          <TeamOutlined />
          Tiến độ học viên
        </Space>
      ),
      children: <StudentEngagementTab />,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen animate-fade-in">
      <div className="mb-6 flex items-center gap-4 border-b border-gray-200 pb-4 bg-white p-4 rounded-2xl shadow-sm">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/instructor/courses")}
          className="bg-gray-100 hover:bg-gray-200 rounded-lg h-9 w-9 flex items-center justify-center"
        />
        <div>
          <Title level={3} className="!m-0 text-gray-800">
            Trung tâm Báo cáo & Thống kê
          </Title>
          <Text type="secondary">
            Mã khóa học hệ thống:{" "}
            <span className="font-bold text-gray-700">{courseId}</span>
          </Text>
        </div>
      </div>

      <Tabs
        defaultActiveKey="overview"
        items={items}
        className="custom-course-tabs bg-white p-4 rounded-2xl shadow-sm"
        size="large"
      />
    </div>
  );
};

export default CourseStatisticsPage;
