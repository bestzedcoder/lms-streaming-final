import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Card,
  Typography,
  message,
  Tag,
  Button,
  Drawer,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  FolderOpenOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { courseService } from "../services/course.service";
import { useDebounce } from "../hooks/useDebounce";
import type {
  InstructorResponse,
  CourseOfInstructorResponse,
} from "../@types/course.type";

const { Title, Text } = Typography;

const InstructorCoursesPage: React.FC = () => {
  // State Instructor
  const [instructors, setInstructors] = useState<InstructorResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);

  // State Drawer & Course
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedInstructor, setSelectedInstructor] =
    useState<InstructorResponse | null>(null);
  const [courses, setCourses] = useState<CourseOfInstructorResponse[]>([]);
  const [courseLoading, setCourseLoading] = useState(false);

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      try {
        const res = await courseService.getAllInstructor({
          page: 1,
          limit: 10,
          email: debouncedSearchText,
        });
        setInstructors(res.data.result);
      } catch (error) {
        message.error("Lỗi tải danh sách giảng viên");
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, [debouncedSearchText]);

  const openCourseDrawer = async (instructor: InstructorResponse) => {
    setSelectedInstructor(instructor);
    setDrawerVisible(true);
    setCourseLoading(true);
    try {
      const res = await courseService.getCourses(instructor.instructorId);
      setCourses(res.data);
    } catch (error) {
      message.error("Lỗi tải khóa học của giảng viên");
    } finally {
      setCourseLoading(false);
    }
  };

  const handleToggleLockCourse = async (
    courseId: string,
    currentStatus: string,
  ) => {
    try {
      if (currentStatus === "LOCKED") {
        await courseService.unlockCourse(courseId);
        message.success("Đã mở khóa khóa học!");
      } else {
        await courseService.lockCourse(courseId);
        message.success("Đã khóa khóa học!");
      }
      // Reload danh sách khóa học của instructor này
      if (selectedInstructor) {
        const res = await courseService.getCourses(
          selectedInstructor.instructorId,
        );
        setCourses(res.data);
      }
    } catch (error) {
      message.error("Thao tác thất bại!");
    }
  };

  const instructorColumns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (t: string) => <strong className="text-slate-700">{t}</strong>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (t: string) => <Text className="font-mono text-sm">{t}</Text>,
    },
    { title: "SĐT", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Khóa học",
      dataIndex: "countCourses",
      key: "countCourses",
      render: (val: number) => <Tag color="blue">{val} khóa</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right" as const,
      render: (_: any, record: InstructorResponse) => (
        <Button
          type="primary"
          ghost
          icon={<FolderOpenOutlined />}
          onClick={() => openCourseDrawer(record)}
        >
          Xem khóa học
        </Button>
      ),
    },
  ];

  const courseColumns = [
    {
      title: "Tên khóa học",
      dataIndex: "title",
      key: "title",
      render: (t: string) => (
        <span className="font-medium text-slate-800">{t}</span>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (t: string) => <Tag>{t}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s: string) => {
        const colors: any = {
          PUBLISHED: "success",
          PENDING: "warning",
          PRIVATE: "default",
          LOCKED: "error",
        };
        return <Tag color={colors[s] || "default"}>{s}</Tag>;
      },
    },
    {
      title: "Học viên",
      dataIndex: "countStudents",
      key: "countStudents",
      render: (v: number) => (
        <span className="text-emerald-600 font-medium">{v}</span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right" as const,
      render: (_: any, record: CourseOfInstructorResponse) =>
        record.status === "LOCKED" ? (
          <Tooltip title="Mở khóa">
            <Button
              type="text"
              className="text-emerald-500"
              icon={<UnlockOutlined />}
              onClick={() =>
                handleToggleLockCourse(record.courseId, record.status)
              }
            />
          </Tooltip>
        ) : (
          <Tooltip title="Khóa khóa học này">
            <Button
              type="text"
              danger
              icon={<LockOutlined />}
              onClick={() =>
                handleToggleLockCourse(record.courseId, record.status)
              }
            />
          </Tooltip>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <Title level={3} className="text-slate-800 !mb-0">
        Tra cứu khóa học giáo viên
      </Title>

      <Card className="shadow-sm border-0 rounded-xl">
        <div className="mb-6 w-full md:w-1/2 lg:w-1/3">
          <Input
            placeholder="Nhập email giáo viên..."
            prefix={<SearchOutlined className="text-gray-400" />}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>
        <Table
          columns={instructorColumns}
          dataSource={instructors}
          rowKey="instructorId"
          loading={loading}
        />
      </Card>

      <Drawer
        title={`Khóa học của: ${selectedInstructor?.fullName || ""}`}
        placement="right"
        width={800}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <Table
          columns={courseColumns}
          dataSource={courses}
          rowKey="courseId"
          loading={courseLoading}
          pagination={false}
        />
      </Drawer>
    </div>
  );
};

export default InstructorCoursesPage;
