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
import type { InstructorCourseResponse } from "../../types/instructor.types";
import { formatCurrency } from "../../utils/format.utils";

const { Title } = Typography;

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
      width: 320,
      render: (text: string, record: InstructorCourseResponse) => (
        <div className="flex gap-4 items-start">
          <Image
            src={
              record.thumbnail || "https://placehold.co/100x60?text=No+Image"
            }
            width={100}
            className="rounded-md border border-gray-200 object-cover"
            preview={false}
          />
          <div>
            <div
              className="font-bold text-gray-800 line-clamp-2 text-base leading-snug mb-1"
              title={text}
            >
              {text}
            </div>
            <Tag
              color="cyan"
              className="text-[11px] border-0 bg-cyan-50 text-cyan-700 m-0"
            >
              {record.category?.name || "Chưa phân loại"}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: 160,
      render: (originalPrice: number, record: InstructorCourseResponse) => {
        const hasDiscount =
          record.salePrice !== undefined &&
          record.salePrice !== null &&
          record.salePrice !== 0 &&
          record.salePrice <= originalPrice;

        // Tính % giảm giá
        const discountPercent = hasDiscount
          ? Math.round((record.salePrice! / originalPrice) * 100)
          : 0;

        const finalPrice = hasDiscount
          ? originalPrice - record.salePrice!
          : originalPrice;

        return (
          <div className="flex flex-col items-start">
            <div className="font-bold text-base">
              {finalPrice === 0 ? (
                <Tag color="green" className="font-bold">
                  Miễn phí
                </Tag>
              ) : (
                <span
                  className={hasDiscount ? "text-red-600" : "text-gray-700"}
                >
                  {formatCurrency(finalPrice)}
                </span>
              )}
            </div>

            {hasDiscount && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(originalPrice)}
                </span>
                <Tag
                  color="error"
                  bordered={false}
                  className="m-0 text-[10px] px-1 rounded-sm font-bold"
                >
                  -{discountPercent}%
                </Tag>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Hiệu quả",
      key: "metrics",
      width: 220,
      render: (_: any, record: InstructorCourseResponse) => (
        <div className="text-sm text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <ReadOutlined className="text-blue-500" />
            <span>
              {record.totalLessons} bài học • {record.totalSections} chương
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UserOutlined className="text-purple-500" />
            <span className="font-medium text-gray-700">
              {record.totalStudents} học viên
            </span>
          </div>
          <div className="flex items-center gap-1">
            <StarFilled className="text-yellow-400" />
            <span className="font-bold text-gray-700">
              {record.averageRating?.toFixed(1) || "0.0"}
            </span>
            <span className="text-xs">
              ({record.countRating || 0} đánh giá)
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center" as const,
      render: (status: string) => {
        const map: Record<string, { color: string; label: string }> = {
          PUBLISHED: { color: "success", label: "Đang bán" },
          PRIVATE: { color: "default", label: "Nháp" },
          PENDING: { color: "warning", label: "Chờ duyệt" },
          LOCKED: { color: "error", label: "Đã khóa" },
        };
        const s = map[status] || { color: "default", label: status };
        return (
          <Tag
            color={s.color}
            className="font-medium min-w-[80px] text-center border-0"
          >
            {s.label}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      align: "right" as const,
      render: (_: any, record: InstructorCourseResponse) => (
        <Space size="small">
          <Tooltip title="Quản lý & Chỉnh sửa">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
              onClick={() =>
                navigate(`/instructor/courses/${record.id}/manage`)
              }
            />
          </Tooltip>
          <Tooltip title="Xem chi tiết & Thống kê">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/instructor/courses/${record.id}`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <Title level={3} className="mb-6">
        Danh sách khóa học
      </Title>
      <Card bordered={false} className="shadow-sm rounded-xl">
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8, showSizeChanger: true }}
        />
      </Card>
    </div>
  );
};

export default InstructorCoursesPage;
