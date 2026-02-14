import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Tag,
  Row,
  Col,
  Statistic,
  Tabs,
  Button,
  Skeleton,
  Image,
  Descriptions,
  Breadcrumb,
  Empty,
} from "antd";
import {
  UserOutlined,
  ReadOutlined,
  StarFilled,
  DollarCircleOutlined,
  EditOutlined,
  CalendarOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { instructorService } from "../../services/instructor.service";
import type { InstructorCourseResponse } from "../../types/instructor.types";
import { formatCurrency } from "../../utils/format.utils";

const { Title } = Typography;

const InstructorCourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<InstructorCourseResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await instructorService.getCourse(id!);
      if (res.data) setCourse(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-8">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  if (!course) return <Empty description="Không tìm thấy khóa học" />;

  const renderStatus = (status: string) => {
    const map: any = {
      PUBLISHED: { color: "success", label: "Đang hoạt động" },
      PRIVATE: { color: "default", label: "Bản nháp" },
      PENDING: { color: "warning", label: "Chờ duyệt" },
      LOCKED: { color: "error", label: "Đã khóa" },
    };
    const s = map[status] || { color: "default", label: status };
    return (
      <Tag color={s.color} className="text-base px-3 py-1">
        {s.label}
      </Tag>
    );
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2">
          <BarChartOutlined />
          Tổng quan
        </span>
      ),
      children: (
        <div className="space-y-6">
          <Descriptions
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="Tiêu đề">
              {course.title}
            </Descriptions.Item>
            <Descriptions.Item label="Danh mục">
              <Tag color="cyan">{course.category?.name}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trình độ">
              {course.level}
            </Descriptions.Item>
            <Descriptions.Item label="Giá gốc">
              {formatCurrency(course.price)}
            </Descriptions.Item>
            <Descriptions.Item label="Giá khuyến mãi">
              {course.salePrice ? formatCurrency(course.salePrice) : "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(course.createdAt).toLocaleDateString("vi-VN")}{" "}
              <span className="text-gray-400 text-xs">
                ({new Date(course.createdAt).toLocaleTimeString("vi-VN")})
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối">
              {new Date(course.updatedAt).toLocaleDateString("vi-VN")}
            </Descriptions.Item>
          </Descriptions>

          <Card title="Mô tả khóa học" size="small" className="bg-gray-50">
            <div className="whitespace-pre-line text-gray-700">
              {course.description}
            </div>
          </Card>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined />
          Danh sách học viên
        </span>
      ),
      children: (
        <div className="min-h-[200px] flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg bg-gray-50">
          <Empty description="Tính năng quản lý học viên đang được phát triển" />
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <span className="flex items-center gap-2">
          <StarFilled />
          Đánh giá & Nhận xét
        </span>
      ),
      children: (
        <div className="min-h-[200px] flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg bg-gray-50">
          <Empty description="Chưa có đánh giá nào" />
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="mb-4">
        <Breadcrumb
          items={[
            { title: "Quản lý" },
            {
              title: (
                <a onClick={() => navigate("/instructor/courses")}>Khóa học</a>
              ),
            },
            { title: "Chi tiết" },
          ]}
        />
      </div>

      <Card bordered={false} className="shadow-sm rounded-xl mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="shrink-0">
            <Image
              src={course.thumbnail || "https://placehold.co/300x200"}
              width={280}
              className="rounded-lg shadow-sm border border-gray-100 object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <Title level={3} className="!mb-2">
                  {course.title}
                </Title>
                <div className="flex items-center gap-3 mb-4">
                  {renderStatus(course.status)}
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <CalendarOutlined />{" "}
                    {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="large"
                onClick={() =>
                  navigate(`/instructor/courses/${course.id}/manage`)
                }
              >
                Chỉnh sửa nội dung
              </Button>
            </div>

            <div className="mt-auto">
              <Row
                gutter={16}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <Col span={6}>
                  <Statistic
                    title="Học viên"
                    value={course.totalStudents}
                    prefix={<UserOutlined className="text-blue-500" />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Bài học"
                    value={course.totalLessons}
                    prefix={<ReadOutlined className="text-purple-500" />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Đánh giá"
                    value={course.averageRating || 0}
                    precision={1}
                    prefix={<StarFilled className="text-yellow-400" />}
                    suffix={<span className="text-xs text-gray-400">/ 5</span>}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Doanh thu (Ước tính)"
                    value={course.totalStudents * (course.price || 0)}
                    prefix={<DollarCircleOutlined className="text-green-500" />}
                    formatter={(value) => formatCurrency(value)}
                    valueStyle={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#16a34a",
                    }}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Card>

      <Card bordered={false} className="shadow-sm rounded-xl">
        <Tabs defaultActiveKey="1" items={tabItems} size="large" />
      </Card>
    </div>
  );
};

export default InstructorCourseDetailPage;
