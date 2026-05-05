import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Tag,
  Spin,
  Empty,
  Typography,
  Row,
  Col,
  message,
  Image,
  Space,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  SettingOutlined,
  LockOutlined,
  StopOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { studentService } from "../../services/student.service";
import type { CourseEnrollmentResponse } from "../../@types/student.types";

const { Title, Text } = Typography;

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<CourseEnrollmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyCourses = async () => {
    try {
      const res = await studentService.getCourses();
      setCourses(res.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách khóa học của bạn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleJoinCourse = (slug: string) => {
    navigate(`/student/courses/${slug}/learning`);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex justify-center items-center">
        <Spin size="large" tip="Đang tải lộ trình học tập..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="mb-8 flex justify-between items-end border-b pb-4">
        <div>
          <Title level={2} className="!mb-1">
            Khóa học của tôi
          </Title>
          <Text type="secondary">
            Tiếp tục hành trình chinh phục kiến thức của bạn.
          </Text>
        </div>
        <Tag color="blue" className="px-4 py-1 rounded-full font-medium">
          {courses.length} Khóa học
        </Tag>
      </div>

      {courses.length === 0 ? (
        <Empty description="Bạn chưa đăng ký khóa học nào" className="py-20" />
      ) : (
        <div className="space-y-6">
          {courses.map((course) => {
            // Logic kiểm tra quyền truy cập
            const isReady =
              course.status === "PUBLISHED" && course.active === "ACTIVE";
            const isBanned = course.active === "BANNED";
            const isLocked =
              course.status === "LOCKED" || course.status === "PRIVATE";

            return (
              <Card
                key={course.slug}
                className={`overflow-hidden border-gray-100 shadow-sm transition-all duration-300 rounded-2xl ${
                  isReady
                    ? "hover:shadow-md hover:border-blue-200"
                    : "bg-gray-50 opacity-80"
                }`}
                bodyStyle={{ padding: 0 }}
              >
                <Row align="middle">
                  {/* Thumbnail Section */}
                  <Col xs={24} md={6} lg={5}>
                    <div className="relative h-40 md:h-48 w-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        height="100%"
                        width="100%"
                        className="object-cover"
                        fallback="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" // Ảnh mặc định khi không có/lỗi
                      />
                      {!isReady && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                          <Tag
                            color="error"
                            icon={<StopOutlined />}
                            className="px-3 py-1 text-sm rounded-md"
                          >
                            KHÔNG THỂ TRUY CẬP
                          </Tag>
                        </div>
                      )}
                    </div>
                  </Col>

                  {/* Info Section */}
                  <Col xs={24} md={18} lg={19}>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 pr-4">
                          <Title
                            level={4}
                            className={`!mb-2 ${isReady ? "text-gray-800" : "text-gray-400"}`}
                          >
                            {course.title}
                          </Title>
                          <Space size="large" className="text-gray-500 text-sm">
                            <span>
                              <UserOutlined /> {course.author}
                            </span>
                            <span>
                              <CalendarOutlined />{" "}
                              {new Date(course.startTime).toLocaleDateString(
                                "vi-VN",
                              )}
                            </span>
                          </Space>
                        </div>
                        <Button
                          type="text"
                          shape="circle"
                          icon={<SettingOutlined className="text-gray-400" />}
                        />
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex-1">
                          {isBanned ? (
                            <Tag
                              color="red"
                              icon={<StopOutlined />}
                              className="border-none py-1 px-3"
                            >
                              Bạn đã bị chặn khỏi khóa học này
                            </Tag>
                          ) : isLocked ? (
                            <Tag
                              color="default"
                              icon={<LockOutlined />}
                              className="border-none py-1 px-3"
                            >
                              Khóa học đang tạm đóng
                            </Tag>
                          ) : !isReady ? (
                            <Tag
                              color="warning"
                              className="border-none py-1 px-3"
                            >
                              Đang chờ phê duyệt/Nội dung chưa sẵn sàng
                            </Tag>
                          ) : (
                            <Tag
                              color="success"
                              className="border-none py-1 px-3"
                            >
                              Đã sẵn sàng
                            </Tag>
                          )}
                        </div>

                        <Button
                          type="primary"
                          size="large"
                          disabled={!isReady}
                          icon={
                            isReady ? <PlayCircleOutlined /> : <LockOutlined />
                          }
                          className={`rounded-xl px-10 font-bold h-12 flex items-center transition-all ${
                            isReady
                              ? "bg-[#303df2] hover:bg-blue-700 shadow-lg shadow-blue-100 border-none"
                              : "bg-gray-300 border-none text-gray-500"
                          }`}
                          onClick={() => handleJoinCourse(course.slug)}
                        >
                          {isReady ? "VÀO HỌC NGAY" : "KHÔNG THỂ VÀO"}
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
