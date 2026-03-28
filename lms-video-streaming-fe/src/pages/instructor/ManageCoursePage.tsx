import { useEffect, useState } from "react";
import { Tabs, Button, Tag, Spin, Result } from "antd";
import { ArrowLeftOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { instructorService } from "../../services/instructor.service";
import type { InstructorCourseDetailsResponse } from "../../@types/instructor.types";
import CourseBasicInfo from "../../components/CourseBasicInfo";
import CourseCurriculum from "../../components/CourseCurriculum";
import CourseSettings from "../../components/CourseSettings";

const ManageCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InstructorCourseDetailsResponse | null>(
    null,
  );

  const STATUS_CONFIG = {
    PUBLISHED: {
      label: "Công khai",
      color: "green",
      className: "animate-pulse", // Hiệu ứng nháy nhẹ nếu muốn
    },
    PENDING: {
      label: "Chờ phê duyệt",
      color: "gold", // Màu vàng cam
      className: "",
    },
    PRIVATE: {
      label: "Riêng tư",
      color: "default", // Màu xám
      className: "",
    },
    LOCKED: {
      label: "Đang bị khóa",
      color: "red",
      className: "opacity-70", // Làm mờ đi một chút
    },
  };

  const fetchDetails = async () => {
    try {
      const res = await instructorService.getCourseDetails(courseId!);
      if (res.data) setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchDetails();
  }, [courseId]);

  if (loading)
    return (
      <div className="h-[60vh] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  if (!data)
    return (
      <Result
        status="404"
        title="Không tìm thấy khóa học"
        subTitle="Khóa học có thể đã bị xóa."
        extra={
          <Button
            type="primary"
            onClick={() => navigate("/instructor/courses")}
          >
            Quay lại
          </Button>
        }
      />
    );

  const { course, sections } = data;

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="flex gap-4 items-center">
          <Button
            icon={<ArrowLeftOutlined />}
            shape="circle"
            onClick={() => navigate("/instructor/courses")}
          />
          <div>
            <h1 className="text-2xl font-bold m-0 text-gray-800 flex items-center gap-3">
              {course.title}
              {course.status && STATUS_CONFIG[course.status] && (
                <Tag
                  className={`m-0 text-sm font-normal ${STATUS_CONFIG[course.status].className}`}
                  color={STATUS_CONFIG[course.status].color}
                >
                  {STATUS_CONFIG[course.status].label}
                </Tag>
              )}
            </h1>
            <span className="text-gray-500 text-sm">
              Cập nhật lần cuối:{" "}
              {new Date(course.updatedAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>

        {course.status === "PUBLISHED" && (
          <Button
            onClick={() =>
              window.open(`/student/courses/${course.slug}`, "_blank")
            }
            icon={<EyeOutlined />}
          >
            Xem trang Public
          </Button>
        )}
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Tabs
          defaultActiveKey="2"
          size="large"
          items={[
            {
              key: "1",
              label: "Thông tin cơ bản",
              children: (
                <CourseBasicInfo course={course} onRefresh={fetchDetails} />
              ),
            },
            {
              key: "2",
              label: "Chương trình học",
              children: (
                <CourseCurriculum
                  courseId={course.id}
                  sections={sections}
                  onRefresh={fetchDetails}
                />
              ),
            },
            {
              key: "3",
              label: "Cài đặt & Xuất bản",
              children: (
                <CourseSettings course={course} onRefresh={fetchDetails} />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ManageCoursePage;
