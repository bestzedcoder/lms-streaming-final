import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Typography,
  Button,
  Rate,
  Collapse,
  Avatar,
  Skeleton,
  Divider,
  Tag,
} from "antd";
import {
  PlayCircleOutlined,
  CheckOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  VideoCameraOutlined,
  MobileOutlined,
  UserOutlined,
  StarFilled,
} from "@ant-design/icons";

import { useAuthStore } from "../../store/useAuthStore.store";
import { publicService } from "../../services/public.service";
import { studentService } from "../../services/student.service";
import { formatCurrency } from "../../utils/format.utils";
import { notify } from "../../utils/notification.utils";
import type { CoursePublicDetailsResponse } from "../../types/public.types";

const { Title } = Typography;
const { Panel } = Collapse;

const getRatingNumber = (rateEnum: string) => {
  const map: Record<string, number> = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
  };
  return map[rateEnum] || 0;
};

const getLessonIcon = (type: string) => {
  switch (type) {
    case "VIDEO":
      return <PlayCircleOutlined className="text-gray-500" />;
    case "QUIZ":
      return <QuestionCircleOutlined className="text-indigo-500" />;
    case "TEXT":
      return <FileTextOutlined className="text-blue-500" />;
    default:
      return <PlayCircleOutlined />;
  }
};

const CourseDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const [course, setCourse] = useState<CoursePublicDetailsResponse | null>(
    null,
  );
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (slug) fetchCourseData();
    window.scrollTo(0, 0);
  }, [slug, isAuthenticated]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const res = await studentService.getCourseDetails(slug!);
        if (res.data) {
          setCourse(res.data.course);
          setHasAccess(res.data.hasAccess);
        }
      } else {
        const res = await publicService.getCourseDetails(slug!);
        if (res.data) {
          setCourse(res.data);
          setHasAccess(false);
        }
      }
    } catch (error) {
      console.error(error);
      notify.error("Lỗi", "Không thể tải thông tin khóa học.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequireLogin = () => {
    notify.info(
      "Yêu cầu đăng nhập",
      "Vui lòng đăng nhập để thực hiện chức năng này.",
    );
    navigate(`/login?returnUrl=${encodeURIComponent(location.pathname)}`);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) return handleRequireLogin();
    notify.success("Thành công", "Đã thêm vào giỏ hàng!");
    // To do logic thêm giỏ hàng
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) return handleRequireLogin();
    navigate("/student/checkout");
  };

  const handleStudyNow = () => {
    navigate(`/student/learning/${course?.slug}`);
  };

  if (loading)
    return (
      <div className="max-w-7xl mx-auto p-8">
        <Skeleton active paragraph={{ rows: 15 }} />
      </div>
    );
  if (!course)
    return (
      <div className="text-center p-20 text-xl font-bold">
        Khóa học không tồn tại.
      </div>
    );

  return (
    <div className="relative min-h-screen bg-white">
      <div className="bg-[#1c1d1f] text-white pt-8 pb-12 px-4 md:px-8 lg:pb-16 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          <div className="lg:col-span-8 flex flex-col justify-center">
            <div className="text-indigo-300 font-bold mb-4 text-sm flex items-center gap-2">
              <span className="cursor-pointer hover:text-white transition-colors">
                Trang chủ
              </span>
              <span>›</span>
              <span className="cursor-pointer hover:text-white transition-colors">
                Khóa học
              </span>
            </div>

            <Title
              level={1}
              className="!text-white !font-bold !text-3xl md:!text-4xl !mb-4 leading-tight"
            >
              {course.title}
            </Title>

            <p className="text-lg text-gray-200 mb-6 leading-relaxed max-w-3xl">
              {course.descriptionShort}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm md:text-base">
              <span className="flex items-center gap-1 font-bold text-[#fbc115]">
                {course.averageRating.toFixed(1)} <StarFilled />
              </span>
              <span className="text-indigo-300 underline cursor-pointer hover:text-white">
                ({course.countRating} đánh giá)
              </span>
              <span>{course.countStudents.toLocaleString()} học viên</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-y-2 gap-x-6 text-sm text-gray-300">
              <span>
                Được tạo bởi{" "}
                <a className="text-indigo-300 underline hover:text-white">
                  {course.instructor.fullName}
                </a>
              </span>
              <span className="flex items-center gap-1">
                <GlobalOutlined /> Tiếng Việt
              </span>
              <span>
                Cập nhật gần nhất:{" "}
                {new Date(course.updatedAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 relative">
        <div className="lg:col-span-8 py-10">
          {course.requirements && (
            <div className="mb-10">
              <Title level={3} className="!font-bold !text-2xl !mb-6">
                Yêu cầu
              </Title>
              <div
                className="text-gray-700 text-base ml-4 format-html-list"
                dangerouslySetInnerHTML={{ __html: course.requirements }}
              />
            </div>
          )}

          <div className="mb-12">
            <Title level={3} className="!font-bold !text-2xl !mb-6">
              Mô tả khóa học
            </Title>
            {/* Nếu HTML (dùng ReactQuill lưu) thì dùng dangerouslySetInnerHTML */}
            <div
              className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
          </div>

          <div className="mb-12">
            <Title level={3} className="!font-bold !text-2xl !mb-2">
              Nội dung khóa học
            </Title>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <span>{course.totalSections} chương</span>
              <span>•</span>
              <span>{course.totalLessons} bài học</span>
              <span>•</span>
              <span>
                Trình độ:{" "}
                <Tag color="blue" className="ml-1">
                  {course.level}
                </Tag>
              </span>
            </div>

            <Collapse
              className="bg-white border-gray-200"
              expandIconPosition="end"
              defaultActiveKey={["0"]}
            >
              {course.sections.map((sec, secIdx) => (
                <Panel
                  header={
                    <span className="font-bold text-gray-800 text-base">
                      {sec.title}
                    </span>
                  }
                  key={secIdx.toString()}
                  extra={
                    <span className="text-gray-500 text-sm">
                      {sec.lessons.length} bài học
                    </span>
                  }
                  className="bg-gray-50/50"
                >
                  <div className="px-2">
                    {sec.descriptionShort && (
                      <div className="text-gray-600 text-sm mb-4 italic pb-3 border-b border-gray-100">
                        {sec.descriptionShort}
                      </div>
                    )}

                    <div className="flex flex-col gap-0">
                      {sec.lessons.length > 0 ? (
                        sec.lessons.map((lesson, lesIdx) => (
                          <div
                            key={lesIdx}
                            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {getLessonIcon(lesson.lessonType)}
                              <span
                                className={`text-sm ${lesson.lessonType === "VIDEO" ? "text-indigo-600 cursor-pointer underline-offset-2 hover:underline" : "text-gray-700"}`}
                              >
                                {lesson.title}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {lesson.lessonType === "VIDEO"
                                ? "05:30"
                                : "Bài tập"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-sm py-2">
                          Chưa có bài học nào trong chương này.
                        </div>
                      )}
                    </div>
                  </div>
                </Panel>
              ))}
            </Collapse>
          </div>

          <div className="mb-12">
            <Title level={3} className="!font-bold !text-2xl !mb-6">
              Giảng viên
            </Title>
            <div className="flex flex-col sm:flex-row gap-6">
              <Avatar
                src={course.instructor.avatarUrl}
                size={110}
                icon={<UserOutlined />}
                className="shrink-0 font-bold text-3xl bg-indigo-100 text-indigo-600"
              />
              <div>
                <h4 className="text-xl font-bold text-indigo-600 underline cursor-pointer mb-1">
                  {course.instructor.fullName}
                </h4>
                <p className="text-gray-500 mb-3">{course.instructor.title}</p>
                <div className="flex items-center gap-4 text-sm font-bold text-gray-700 mb-4">
                  <span className="flex items-center gap-1">
                    <PlayCircleOutlined /> {course.instructor.totalCourses} Khóa
                    học
                  </span>
                  <span className="flex items-center gap-1">
                    <UserOutlined /> Học viên
                  </span>
                </div>

                <div
                  className="text-gray-700 leading-relaxed text-sm prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: course.instructor.bio }}
                />
              </div>
            </div>
          </div>

          <div className="mb-12">
            <Title level={3} className="!font-bold !text-2xl !mb-6">
              Học viên đánh giá
            </Title>
            {course.reviews.length === 0 ? (
              <div className="text-gray-500 italic">
                Chưa có đánh giá nào cho khóa học này.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {course.reviews.map((rv, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 p-5 rounded-lg bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar
                        size="large"
                        className="bg-gray-800 text-white font-bold"
                      >
                        {rv.user.charAt(0).toUpperCase()}
                      </Avatar>
                      <div>
                        <div className="font-bold text-gray-800">{rv.user}</div>
                        <Rate
                          disabled
                          defaultValue={getRatingNumber(rv.rating)}
                          className="text-xs text-[#fbc115]"
                        />
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      "{rv.content}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 relative -mt-6 lg:-mt-72 mb-10 lg:mb-0 z-10">
          <div className="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden sticky top-24">
            {course.thumbnail && (
              <div className="relative aspect-video bg-gray-900 flex items-center justify-center overflow-hidden border-b border-gray-100">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <PlayCircleOutlined className="text-6xl text-white shadow-lg rounded-full" />
                </div>
              </div>
            )}

            <div className="p-6">
              {/* Phần Giá */}
              <div className="mb-6">
                {course.salePrice !== undefined &&
                course.price - course.salePrice === 0 ? (
                  <div className="text-3xl font-extrabold text-green-600">
                    Miễn phí
                  </div>
                ) : (
                  <div className="flex items-end gap-3 flex-wrap">
                    <span className="text-3xl font-extrabold text-gray-900">
                      {course.salePrice
                        ? formatCurrency(course.price - course.salePrice)
                        : formatCurrency(course.salePrice)}
                    </span>
                    {course.salePrice && course.salePrice < course.price ? (
                      <span className="text-lg text-gray-500 line-through mb-1">
                        {formatCurrency(course.price)}
                      </span>
                    ) : null}
                  </div>
                )}
              </div>

              {hasAccess ? (
                <div className="flex flex-col gap-3">
                  <div className="bg-green-50 text-green-700 p-3 rounded-lg text-center font-bold border border-green-200 text-sm flex items-center justify-center gap-2">
                    <CheckOutlined /> Bạn đã sở hữu khóa học này
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlayCircleOutlined />}
                    className="w-full bg-[#a435f0] hover:bg-[#8710d8] font-bold h-12 text-lg rounded-none"
                    onClick={handleStudyNow}
                  >
                    Vào học ngay
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button
                    type="primary"
                    size="large"
                    className="w-full bg-[#a435f0] hover:bg-[#8710d8] font-bold h-12 text-base rounded-none"
                    onClick={handleAddToCart}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    size="large"
                    className="w-full h-12 text-base font-bold rounded-none border-black text-black hover:bg-gray-100"
                    onClick={handleBuyNow}
                  >
                    Mua ngay
                  </Button>
                </div>
              )}

              <Divider className="my-6" />

              <div>
                <h4 className="font-bold text-gray-800 mb-3 text-base">
                  Khóa học này bao gồm:
                </h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-3">
                    <VideoCameraOutlined /> Theo yêu cầu video
                  </li>
                  <li className="flex items-center gap-3">
                    <FileTextOutlined /> {course.totalLessons} bài học & tài
                    liệu
                  </li>
                  <li className="flex items-center gap-3">
                    <MobileOutlined /> Truy cập trên thiết bị di động và TV
                  </li>
                  <li className="flex items-center gap-3">
                    <SafetyCertificateOutlined /> Giấy chứng nhận hoàn thành
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
