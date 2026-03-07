import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Card,
  Typography,
  message,
  Space,
  Avatar,
  Modal,
} from "antd";
import { CheckCircleOutlined, PlaySquareOutlined } from "@ant-design/icons";
import { courseService } from "../services/course.service";
import type { CoursePendingResponse } from "../@types/course.type";
import { useNotification } from "../context/NotificationContext";

const { Title } = Typography;

const CoursePendingPage: React.FC = () => {
  const [courses, setCourses] = useState<CoursePendingResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { decreaseCount } = useNotification();

  const fetchPendingCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await courseService.getCoursesPending();
      setCourses(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách khóa học chờ duyệt");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingCourses();
  }, [fetchPendingCourses]);

  const handleApprove = (course: CoursePendingResponse) => {
    Modal.confirm({
      title: "Xác nhận duyệt khóa học",
      content: `Bạn có chắc chắn muốn duyệt khóa học "${course.title}" của giảng viên ${course.instructorName}?`,
      okText: "Duyệt ngay",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await courseService.approveCourse(course.courseId);
          message.success("Đã duyệt khóa học thành công!");
          fetchPendingCourses();
          decreaseCount();
        } catch (error) {
          message.error("Lỗi khi duyệt khóa học!");
        }
      },
    });
  };

  const columns = [
    {
      title: "Khóa học",
      key: "courseInfo",
      render: (_: any, record: CoursePendingResponse) => (
        <div className="flex items-center gap-4">
          <Avatar
            shape="square"
            size={64}
            src={record.thumbnail}
            icon={<PlaySquareOutlined />}
            className="rounded-lg bg-blue-50 text-blue-400"
          />
          <div>
            <div className="font-semibold text-slate-800 text-base line-clamp-1">
              {record.title}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Giảng viên",
      key: "instructor",
      render: (_: any, record: CoursePendingResponse) => (
        <div>
          <div className="font-medium text-slate-700">
            {record.instructorName}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">
            {record.instructorEmail}
          </div>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right" as const,
      render: (_: any, record: CoursePendingResponse) => (
        <Space>
          <Button
            type="primary"
            className="bg-emerald-500 hover:bg-emerald-600"
            icon={<CheckCircleOutlined />}
            onClick={() => handleApprove(record)}
          >
            Duyệt khóa học
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Title level={3} className="text-slate-800 !mb-0">
        Phê duyệt khóa học
      </Title>
      <Card className="shadow-sm border-0 rounded-xl">
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="courseId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (t) => `Tổng: ${t} khóa chờ duyệt`,
          }}
        />
      </Card>
    </div>
  );
};

export default CoursePendingPage;
