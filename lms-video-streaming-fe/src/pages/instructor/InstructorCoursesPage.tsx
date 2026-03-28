import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Card,
  Typography,
  Tooltip,
  Image,
  Badge,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  StarFilled,
  ReadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { instructorService } from "../../services/instructor.service";
import type { InstructorCourseResponse } from "../../@types/instructor.types";

const { Title, Text } = Typography;

const InstructorCoursesPage = () => {
  const [courses, setCourses] = useState<InstructorCourseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await instructorService.getAllCourses();
        if (res.data) setCourses(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: "Thông tin khóa học",
      dataIndex: "title",
      key: "title",
      width: "45%",
      render: (text: string, record: InstructorCourseResponse) => (
        <div className="flex gap-4 items-center group">
          <div className="shrink-0 overflow-hidden rounded-lg shadow-sm border border-gray-100">
            <Image
              src={
                record.thumbnail || "https://placehold.co/120x68?text=No+Image"
              }
              width={120}
              height={68}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              preview={false}
            />
          </div>
          <div className="flex flex-col justify-center">
            <div
              className="font-bold text-gray-800 line-clamp-2 text-base leading-snug mb-1.5 cursor-pointer hover:text-blue-600 transition-colors"
              title={text}
              onClick={() =>
                navigate(`/instructor/courses/${record.id}/manage`)
              }
            >
              {text}
            </div>
            <div>
              <Tag
                color="blue"
                className="text-xs border-0 bg-blue-50 text-blue-600 m-0 px-2 py-0.5 rounded-md font-medium"
              >
                {record.category?.name || "Chưa phân loại"}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Hiệu quả tương tác",
      key: "metrics",
      width: "25%",
      render: (_: any, record: InstructorCourseResponse) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
              <ReadOutlined />
            </div>
            <span>
              <strong>{record.totalLessons || 0}</strong> bài học •{" "}
              <strong>{record.totalSections || 0}</strong> chương
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <UserOutlined />
            </div>
            <span>
              <strong>{record.totalStudents || 0}</strong> học viên tham gia
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <StarFilled />
            </div>
            <div className="flex items-center gap-1.5">
              <strong className="text-gray-800">
                {record.averageRating?.toFixed(1) || "0.0"}
              </strong>
              <span className="text-gray-400 text-xs">
                ({record.countRating || 0} đánh giá)
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status: string) => {
        const map: Record<
          string,
          {
            status: "success" | "processing" | "default" | "warning" | "error";
            label: string;
          }
        > = {
          PUBLISHED: { status: "success", label: "Đã xuất bản" },
          PRIVATE: { status: "default", label: "Bản nháp" },
          PENDING: { status: "warning", label: "Chờ phê duyệt" },
          LOCKED: { status: "error", label: "Đã khóa" },
        };
        const s = map[status] || { status: "default", label: status };

        return (
          <div className="bg-gray-50 px-3 py-1.5 rounded-full inline-block border border-gray-100">
            <Badge
              status={s.status}
              text={
                <span className="font-medium text-gray-700">{s.label}</span>
              }
            />
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: "15%",
      align: "center" as const,
      render: (_: any, record: InstructorCourseResponse) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa nội dung" color="blue">
            <Button
              type="text"
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center"
              icon={<EditOutlined className="text-lg" />}
              onClick={() =>
                navigate(`/instructor/courses/${record.id}/manage`)
              }
            />
          </Tooltip>
          <Tooltip title="Xem thống kê chi tiết" color="purple">
            <Button
              type="text"
              className="text-purple-500 hover:text-purple-600 hover:bg-purple-50 w-10 h-10 rounded-full flex items-center justify-center"
              icon={<EyeOutlined className="text-lg" />}
              onClick={() => navigate(`/instructor/courses/${record.id}`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Title level={3} className="m-0 text-gray-800">
            Khóa học của tôi
          </Title>
          <Text type="secondary" className="mt-1 block">
            Quản lý nội dung, theo dõi tiến độ và tương tác của học viên.
          </Text>
        </div>
      </div>

      {/* Table Area */}
      <Card
        bordered={false}
        className="shadow-sm rounded-2xl overflow-hidden border border-gray-100"
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            className: "px-6 pb-4",
          }}
          className="custom-instructor-table"
        />
      </Card>
    </div>
  );
};

export default InstructorCoursesPage;
