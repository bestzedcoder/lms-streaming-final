import React, { useEffect, useState } from "react";
import {
  Progress,
  Table,
  Tag,
  Typography,
  message,
  Spin,
  Col,
  Row,
  Space,
} from "antd";
import {
  TrophyOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { studentService } from "../../../services/student.service";
import type { QuizResultResponse } from "../../../@types/student.types";

const { Title, Text } = Typography;

type Props = {
  slug: string;
};

const LearningResultsTab: React.FC<Props> = ({ slug }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<QuizResultResponse[]>([]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await studentService.getQuizResults(slug);
      let data = res.data || [];

      // Sắp xếp lịch sử làm bài theo thời gian từ cũ nhất đến mới nhất
      data.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
      );

      setResults(data);
    } catch (error) {
      message.error("Không thể tải kết quả học tập");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchResults();
  }, [slug]);

  // Cập nhật mốc qua bài là >= 5 điểm (thang điểm 10)
  const calculateTotalProgress = () => {
    if (results.length === 0) return 0;
    const passedCount = results.filter((r) => r.score >= 5).length;
    return Math.round((passedCount / results.length) * 100);
  };

  const columns = [
    {
      title: "Bài đánh giá",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <Space>
          <TrophyOutlined className="text-yellow-500 text-lg" />
          <Text strong className="text-gray-800">
            {text}
          </Text>
        </Space>
      ),
    },
    {
      title: "Phân loại",
      dataIndex: "type",
      key: "type",
      width: 140,
      render: (type: "TEST" | "EXAM") => {
        if (type === "EXAM") {
          return (
            <Tag
              color="purple"
              icon={<FileDoneOutlined />}
              className="m-0 border-none font-semibold"
            >
              KẾT THÚC
            </Tag>
          );
        }
        return (
          <Tag
            color="cyan"
            icon={<ClockCircleOutlined />}
            className="m-0 border-none font-semibold"
          >
            KIỂM TRA
          </Tag>
        );
      },
    },
    {
      title: "Số câu đúng",
      key: "result",
      align: "center" as const,
      width: 150,
      render: (_: any, record: QuizResultResponse) => (
        <Text strong className="text-gray-600">
          {record.correctAnswers}{" "}
          <span className="text-gray-400 font-normal">
            / {record.totalQuestions}
          </span>
        </Text>
      ),
    },
    {
      title: "Điểm số",
      dataIndex: "score",
      key: "score",
      align: "center" as const,
      width: 120,
      render: (score: number) => {
        // Chỉ cần so sánh điểm số trực tiếp >= 5
        const isPassed = score >= 5;
        return (
          <Tag
            color={isPassed ? "green" : "red"}
            className="rounded-full px-3 py-0.5 border-none font-bold text-sm m-0"
          >
            {score}
          </Tag>
        );
      },
    },
    {
      title: "Ngày nộp bài",
      dataIndex: "time",
      key: "time",
      align: "right" as const,
      render: (time: string) => (
        <Text type="secondary" className="text-sm">
          <CalendarOutlined className="mr-1.5" />
          {new Date(time).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Thống kê tổng quát */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 shadow-sm">
        <Row align="middle" gutter={24}>
          <Col xs={24} md={16}>
            <Title level={4} className="!mt-0 text-gray-800">
              Tiến độ hoàn thành bài tập
            </Title>
            <Text type="secondary">
              Hệ thống ghi nhận kết quả dựa trên các bài Đánh giá bạn đã nộp.
              Cần đạt từ{" "}
              <Text strong className="text-gray-700">
                5 điểm
              </Text>{" "}
              trở lên để được tính là qua bài.
            </Text>
            <Progress
              percent={calculateTotalProgress()}
              status="active"
              strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
              className="mt-4"
              strokeWidth={12}
            />
          </Col>
          <Col xs={0} md={8} className="text-center">
            <div className="bg-white p-5 rounded-xl shadow-inner inline-block border border-blue-50">
              <CheckCircleFilled className="text-4xl text-green-500" />
              <div className="text-2xl font-bold mt-2 text-gray-800">
                {results.length}
              </div>
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1">
                Lượt nộp bài
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Bảng kết quả */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <Text strong className="text-lg text-gray-800">
            Lịch sử làm bài
          </Text>
        </div>
        <Spin spinning={loading}>
          <Table
            dataSource={results}
            columns={columns}
            rowKey={(record) => record.title + record.time}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              position: ["bottomCenter"],
              className: "py-4",
            }}
            locale={{ emptyText: "Bạn chưa thực hiện bài kiểm tra nào." }}
          />
        </Spin>
      </div>
    </div>
  );
};

export default LearningResultsTab;
