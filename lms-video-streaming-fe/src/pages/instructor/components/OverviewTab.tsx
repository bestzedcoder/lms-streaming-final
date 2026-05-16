import React, { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Spin, message } from "antd";
import {
  TeamOutlined,
  PlaySquareOutlined,
  FileDoneOutlined,
  StarOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

// Import Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { instructorService } from "../../../services/instructor.service";
import type { InstructorCourseStatisticsOverviewResponse } from "../../../@types/instructor.types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
);

const { Title, Text } = Typography;

interface OverviewTabProps {
  courseId: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ courseId }) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] =
    useState<InstructorCourseStatisticsOverviewResponse | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      try {
        const res = await instructorService.overviewCourse(courseId);
        setStats(res.data);
      } catch (error) {
        message.error("Lỗi khi tải dữ liệu thống kê tổng quan");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchOverview();
  }, [courseId]);

  const processScoreDistribution = (distribution?: Record<number, number>) => {
    const bins = {
      "< 5 (Trượt)": 0,
      "5 - 6.5 (TB)": 0,
      "6.5 - 8 (Khá)": 0,
      "8 - 9 (Giỏi)": 0,
      "9 - 10 (Xuất sắc)": 0,
    };

    if (!distribution) return Object.values(bins);

    Object.entries(distribution).forEach(([scoreStr, count]) => {
      const score = parseFloat(scoreStr);
      if (score < 5) bins["< 5 (Trượt)"] += count;
      else if (score < 6.5) bins["5 - 6.5 (TB)"] += count;
      else if (score < 8) bins["6.5 - 8 (Khá)"] += count;
      else if (score < 9) bins["8 - 9 (Giỏi)"] += count;
      else bins["9 - 10 (Xuất sắc)"] += count;
    });

    return Object.values(bins);
  };

  // --- CẤU HÌNH BIỂU ĐỒ CHART.JS ---
  const chartLabels = [
    "< 5 (Trượt)",
    "5 - 6.5 (TB)",
    "6.5 - 8 (Khá)",
    "8 - 9 (Giỏi)",
    "9 - 10 (Xuất sắc)",
  ];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Bài Kiểm tra (Test)",
        data: processScoreDistribution(stats?.scoreTestDistribution),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "Bài Thi kết thúc (Exam)",
        data: processScoreDistribution(stats?.scoreExamDistribution),
        backgroundColor: "rgba(153, 102, 255, 0.7)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: { family: "'Inter', sans-serif", weight: "bold" as const },
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#666",
        borderColor: "#e5e7eb",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Số lượt đạt điểm", color: "#888" },
        grid: { color: "#f3f4f6" }, // Màu vạch kẻ ngang mờ
      },
      x: {
        grid: { display: false }, // Ẩn vạch kẻ dọc cho thoáng
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  if (loading || !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" tip="Đang phân tích dữ liệu tổng quan..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 4 CARD THỐNG KÊ NHANH */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} md={6}>
          <Card className="rounded-2xl border-none shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white p-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-100 mb-1 font-medium text-xs uppercase tracking-wider">
                  Tổng học viên
                </p>
                <Title level={2} className="!text-white !m-0">
                  {stats.totalStudents}
                </Title>
              </div>
              <TeamOutlined className="text-4xl opacity-30" />
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card className="rounded-2xl border-none shadow-sm bg-gradient-to-br from-orange-400 to-orange-500 text-white p-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-orange-100 mb-1 font-medium text-xs uppercase tracking-wider">
                  Học liệu (Video & Text)
                </p>
                <Title level={2} className="!text-white !m-0">
                  {stats.totalVideos + stats.totalLectures}
                </Title>
              </div>
              <PlaySquareOutlined className="text-4xl opacity-30" />
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card className="rounded-2xl border-none shadow-sm bg-gradient-to-br from-cyan-500 to-cyan-600 text-white p-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-cyan-100 mb-1 font-medium text-xs uppercase tracking-wider">
                  Bài Đánh giá (Test & Exam)
                </p>
                <Title level={2} className="!text-white !m-0">
                  {stats.totalTests + stats.totalExams}
                </Title>
              </div>
              <FileDoneOutlined className="text-4xl opacity-30" />
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card className="rounded-2xl border-none shadow-sm bg-gradient-to-br from-purple-500 to-purple-600 text-white p-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-purple-100 mb-1 font-medium text-xs uppercase tracking-wider">
                  Đánh giá khóa học
                </p>
                <div className="flex items-end gap-2">
                  <Title level={2} className="!text-white !m-0">
                    {stats.averageRating.toFixed(1)}
                  </Title>
                  <Text className="text-purple-100 mb-1">
                    ({stats.totalReviews} lượt)
                  </Text>
                </div>
              </div>
              <StarOutlined className="text-4xl opacity-30" />
            </div>
          </Card>
        </Col>
      </Row>

      {/* KHU VỰC BIỂU ĐỒ */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            className="rounded-2xl border-gray-100 shadow-sm h-full"
            title={
              <div className="flex items-center gap-2">
                <BarChartOutlined className="text-blue-500 text-xl" />
                <span className="font-bold text-gray-800 text-lg">
                  Biểu đồ Phổ điểm hệ thống
                </span>
              </div>
            }
          >
            <div className="h-[350px] w-full p-2">
              <Bar data={chartData} options={chartOptions} />
            </div>
            <div className="mt-4 flex justify-center gap-8 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span>
                💡 Trục ngang (X): Dải điểm đã được quy đổi (Thang 10)
              </span>
              <span>
                💡 Trục dọc (Y): Số lượng lượt nộp bài đạt mức điểm tương ứng
              </span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OverviewTab;
