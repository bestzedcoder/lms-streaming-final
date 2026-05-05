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

  // 1. Fetch dữ liệu kết quả Quiz
  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await studentService.getQuizResults(slug);
      let data = res.data || [];

      // 2. Sắp xếp theo thứ tự thời gian sớm nhất (Earliest first)
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

  const calculateTotalProgress = () => {
    if (results.length === 0) return 0;
    const passedCount = results.filter(
      (r) => r.correctAnswers / r.totalQuestions >= 0.5,
    ).length;
    return Math.round((passedCount / results.length) * 100);
  };

  const columns = [
    {
      title: "Bài kiểm tra",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <Space>
          <TrophyOutlined className="text-yellow-500" />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Kết quả",
      key: "result",
      render: (_: any, record: QuizResultResponse) => (
        <Text>
          {record.correctAnswers} / {record.totalQuestions}
          <small className="text-gray-400 ml-1">câu đúng</small>
        </Text>
      ),
    },
    {
      title: "Điểm số",
      key: "score",
      render: (_: any, record: QuizResultResponse) => {
        const score = Math.round(
          (record.correctAnswers / record.totalQuestions) * 100,
        );
        const isPassed = score >= 50;
        return (
          <Tag
            color={isPassed ? "green" : "red"}
            className="rounded-full px-3 border-none font-bold"
          >
            {score}/100
          </Tag>
        );
      },
    },
    {
      title: "Ngày thực hiện",
      dataIndex: "time",
      key: "time",
      render: (time: string) => (
        <Text type="secondary">
          <CalendarOutlined className="mr-1" />
          {new Date(time).toLocaleString("vi-VN")}
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
            <Title level={4} className="!mt-0">
              Tiến độ hoàn thành bài tập
            </Title>
            <Text type="secondary">
              Hệ thống ghi nhận kết quả dựa trên các bài Quiz bạn đã thực hiện
              sớm nhất đến muộn nhất.
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
            <div className="bg-white p-4 rounded-xl shadow-inner inline-block">
              <CheckCircleFilled className="text-4xl text-green-500" />
              <div className="text-2xl font-bold mt-1">{results.length}</div>
              <div className="text-gray-400 text-xs">Bài đã làm</div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Bảng kết quả */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Spin spinning={loading}>
          <Table
            dataSource={results}
            columns={columns}
            rowKey={(record) => record.title + record.time}
            // Chỉ để 10 bài kiểm tra 1 page
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
