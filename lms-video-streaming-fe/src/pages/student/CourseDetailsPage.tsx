import {
  Typography,
  Button,
  Rate,
  Collapse,
  Avatar,
  Tag,
  Empty,
  Row,
  Col,
  Skeleton,
  Divider,
} from "antd";
import {
  PlayCircleOutlined,
  CheckOutlined,
  FileTextOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  VideoCameraOutlined,
  MobileOutlined,
  UserOutlined,
  StarFilled,
  CalendarOutlined,
  BarChartOutlined,
  LockFilled,
} from "@ant-design/icons";
import { notify } from "../../utils/notification.utils";
import { studentService } from "../../services/student.service";
import { publicService } from "../../services/public.service";
import { useEffect, useState } from "react";
import type { CoursePublicDetailsResponse } from "../../@types/public.types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.store";
import type { RegistrationCreatingRequest } from "../../@types/student.types";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

// --- 1. PHẦN HERO (BANNER ĐẦU TRANG) ---
const CourseHero = ({ course }: { course: any }) => (
  <div className="bg-[#1c1d1f] text-white py-12 px-4 md:px-8">
    <div className="max-w-7xl mx-auto lg:pr-[400px]">
      <Title
        level={1}
        className="!text-white !text-3xl md:!text-4xl !font-bold mb-4"
      >
        {course.title}
      </Title>
      <Paragraph className="text-gray-200 text-lg mb-6 max-w-3xl">
        {course.descriptionShort}
      </Paragraph>
      <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
        <Tag color="#fbc115" className="font-bold text-black border-none">
          Bán chạy
        </Tag>
        <span className="text-[#fbc115] font-bold flex items-center gap-1">
          {course.averageRating.toFixed(1)} <StarFilled />
        </span>
        <span className="text-indigo-300 underline cursor-pointer">
          ({course.countRating} đánh giá)
        </span>
        <span>{course.totalStudents.toLocaleString()} học viên</span>
      </div>
      <div className="flex flex-wrap gap-6 text-sm">
        <span>
          Được tạo bởi{" "}
          <Text className="text-indigo-300 underline cursor-pointer">
            {course.instructor.nickname}
          </Text>
        </span>
        <span>
          <GlobalOutlined className="mr-1" /> Tiếng Việt
        </span>
        <span>
          <CalendarOutlined className="mr-1" /> Cập nhật:{" "}
          {new Date(course.updatedAt).toLocaleDateString("vi-VN")}
        </span>
      </div>
    </div>
  </div>
);

// --- 2. PHẦN YÊU CẦU (REQUIREMENTS) ---
const CourseRequirements = ({ requirements }: { requirements?: string }) => {
  if (!requirements) return null;
  const items = requirements
    .split(";")
    .map((i) => i.trim())
    .filter((i) => i !== "");
  return (
    <div className="mb-10">
      <Title level={3} className="!text-2xl !font-bold mb-4">
        Yêu cầu
      </Title>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-gray-700">
            <CheckOutlined className="mt-1 text-gray-400 text-xs" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- 3. PHẦN NỘI DUNG KHÓA HỌC (CURRICULUM) ---
const CourseContent = ({
  sections,
  totalLessons,
  totalSections,
  level,
}: any) => (
  <div className="mb-12">
    <Title level={3} className="!text-2xl !font-bold mb-2">
      Nội dung khóa học
    </Title>
    <div className="flex items-center justify-between mb-4 text-gray-600 text-sm">
      <div className="flex gap-2">
        <span>
          {totalSections} chương • {totalLessons} bài học
        </span>
      </div>
      <Tag color="blue" icon={<BarChartOutlined />}>
        {level}
      </Tag>
    </div>
    <Collapse
      expandIconPosition="end"
      className="bg-white border-gray-200 rounded-lg overflow-hidden"
    >
      {sections.map((sec: any, idx: number) => (
        <Panel
          header={<span className="font-bold text-gray-800">{sec.title}</span>}
          key={idx}
          extra={
            <span className="text-gray-500 text-xs">
              {sec.lessons.length} bài học
            </span>
          }
        >
          {sec.lessons.map((lesson: any, lIdx: number) => (
            <div
              key={lIdx}
              className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded transition-colors cursor-default"
            >
              <div className="flex items-center gap-3">
                {lesson.lessonType === "VIDEO" ? (
                  <PlayCircleOutlined />
                ) : (
                  <FileTextOutlined />
                )}
                <span className="text-sm">{lesson.title}</span>
              </div>
              <span className="text-xs text-gray-400">{lesson.lessonType}</span>
            </div>
          ))}
        </Panel>
      ))}
    </Collapse>
  </div>
);

// --- 4. PHẦN GIỚI THIỆU GIẢNG VIÊN ---
const InstructorSection = ({ instructor }: { instructor: any }) => (
  <div className="mb-12 pt-8 border-t">
    <Title level={3} className="!text-2xl !font-bold mb-6">
      Giảng viên
    </Title>
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col items-center gap-4">
        <Avatar
          src={instructor.avatarUrl}
          size={120}
          icon={<UserOutlined />}
          className="shadow-lg border-4 border-white"
        />
        <div className="text-center">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <StarFilled className="text-orange-400" /> {instructor.totalCourses}{" "}
            Khóa học
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserOutlined className="text-orange-400" />{" "}
            {instructor.totalStudents} Học viên
          </div>
        </div>
      </div>
      <div className="flex-1">
        <Title
          level={4}
          className="!text-indigo-600 !mb-1 underline cursor-pointer"
        >
          {instructor.nickname}
        </Title>
        <Text strong className="text-gray-500 block mb-4">
          {instructor.title}
        </Text>
        <div
          className="text-gray-700 leading-relaxed custom-html-content"
          dangerouslySetInnerHTML={{ __html: instructor.bio }}
        />
      </div>
    </div>
  </div>
);

// --- 5. PHẦN ĐÁNH GIÁ (REVIEWS) ---
const ReviewSection = ({ reviews }: { reviews: any[] }) => (
  <div className="mb-12 pt-8 border-t">
    <Title level={3} className="!text-2xl !font-bold mb-6">
      Đánh giá từ học viên
    </Title>
    {reviews.length === 0 ? (
      <Empty description="Chưa có đánh giá nào" />
    ) : (
      <Row gutter={[24, 24]}>
        {reviews.map((rv, idx) => (
          <Col span={24} md={12} key={idx}>
            <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/30 h-full">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="bg-indigo-600 font-bold">
                  {rv.fullName.charAt(0)}
                </Avatar>
                <div>
                  <div className="font-bold text-sm">{rv.fullName}</div>
                  <Rate disabled defaultValue={5} className="text-[10px]" />
                </div>
              </div>
              <Paragraph className="text-gray-700 italic text-sm">
                "{rv.content}"
              </Paragraph>
            </div>
          </Col>
        ))}
      </Row>
    )}
  </div>
);

// --- 6. FLOATING CARD (BÊN PHẢI) ---
const CourseSidebar = ({
  course,
  hasAccess,
  userStatus,
  onEnroll,
  onStudy,
  loading,
  isAuthenticated,
}: any) => {
  const renderActionButton = () => {
    if (!isAuthenticated || !hasAccess) {
      return (
        <Button
          type="primary"
          size="large"
          block
          className="h-12 font-bold bg-black hover:bg-gray-800 border-none transition-all"
          onClick={onEnroll}
          loading={loading}
        >
          Đăng ký tham gia
        </Button>
      );
    }

    if (hasAccess && userStatus === "BANNED") {
      return (
        <div className="space-y-3">
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm font-medium">
            <LockFilled /> Quyền truy cập của bạn đã bị khóa
          </div>
          <Button
            disabled
            size="large"
            block
            className="h-12 font-bold bg-gray-200 border-none text-gray-400"
          >
            Không thể vào học
          </Button>
          <p className="text-[11px] text-gray-400 text-center italic">
            Vui lòng liên hệ bộ phận hỗ trợ để biết thêm chi tiết.
          </p>
        </div>
      );
    }

    return (
      <Button
        type="primary"
        size="large"
        block
        className="h-12 font-bold bg-[#a435f0] hover:bg-[#8710d8] border-none shadow-lg shadow-purple-200 transition-all"
        onClick={onStudy}
      >
        Vào học ngay
      </Button>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden sticky top-8">
      <div className="aspect-video relative group cursor-pointer border-b border-gray-100">
        <img
          src={course.thumbnail || "https://placehold.co/600x400?text=No+Image"}
          alt="thumbnail"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <PlayCircleOutlined className="text-6xl text-white" />
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">{renderActionButton()}</div>

        <Divider className="my-6" />

        <div className="space-y-3">
          <Text strong className="block mb-3 text-gray-800">
            Khóa học này bao gồm:
          </Text>
          <ul className="space-y-3 text-sm text-gray-600 p-0 list-none">
            <li className="flex items-center gap-3">
              <VideoCameraOutlined className="text-gray-400" />{" "}
              {course.totalLessons} bài giảng Video
            </li>
            <li className="flex items-center gap-3">
              <FileTextOutlined className="text-gray-400" /> Tài liệu học tập đi
              kèm
            </li>
            <li className="flex items-center gap-3">
              <MobileOutlined className="text-gray-400" /> Xem trên đa thiết bị
            </li>
            <li className="flex items-center gap-3">
              <SafetyCertificateOutlined className="text-gray-400" /> Chứng chỉ
              hoàn thành
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
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
  const [enrolling, setEnrolling] = useState<boolean>(false);

  useEffect(() => {
    if (slug) fetchCourseData();
    window.scrollTo(0, 0);
  }, [slug, isAuthenticated]);

  const [userStatus, setUserStatus] = useState<"ACTIVE" | "BANNED">("ACTIVE");

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const res = await studentService.getCourseDetails(slug!);
        if (res.data) {
          setCourse(res.data.course);
          setHasAccess(res.data.hasAccess);
          setUserStatus(res.data.status);
        }
      } else {
        const res = await publicService.getCourseDetails(slug!);
        if (res.data) {
          setCourse(res.data);
          setHasAccess(false);
        }
      }
    } catch (error) {
      notify.error("Lỗi", "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      notify.info(
        "Yêu cầu đăng nhập",
        "Vui lòng đăng nhập để đăng ký khóa học.",
      );
      return navigate(
        `/login?returnUrl=${encodeURIComponent(location.pathname)}`,
      );
    }

    setEnrolling(true);
    try {
      const request: RegistrationCreatingRequest = {
        slug: course?.slug || "",
        message: "Tôi muốn tham gia khóa học này",
      };

      await studentService.registration(request);
      notify.success("Thành công", "Bạn đã đăng ký khóa học thành công!");
    } catch (error) {
      console.log(error);
    } finally {
      setEnrolling(false);
    }
  };

  const handleStudyNow = () => {
    navigate(`/student/learning/${course?.slug}`);
  };

  if (loading) return <Skeleton active className="p-20" />;
  if (!course) return <Empty className="p-20" />;

  return (
    <div className="min-h-screen bg-white">
      <CourseHero course={course} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <Row gutter={[48, 48]}>
          <Col span={24} lg={16} className="py-10">
            <CourseRequirements requirements={course.requirements} />

            <div className="mb-10">
              <Title level={3} className="!text-2xl !font-bold mb-4">
                Mô tả
              </Title>
              <div
                className="prose max-w-none text-gray-700 custom-html-content"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </div>

            <CourseContent
              sections={course.sections}
              totalLessons={course.totalLessons}
              totalSections={course.totalSections}
              level={course.level}
            />

            <InstructorSection instructor={course.instructor} />

            <ReviewSection reviews={course.reviews} />
          </Col>

          <Col span={24} lg={8} className="relative">
            <div className="lg:-mt-64 z-30 relative">
              <CourseSidebar
                course={course}
                hasAccess={hasAccess}
                userStatus={userStatus}
                isAuthenticated={isAuthenticated}
                onEnroll={handleEnroll}
                onStudy={handleStudyNow}
                loading={enrolling}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
