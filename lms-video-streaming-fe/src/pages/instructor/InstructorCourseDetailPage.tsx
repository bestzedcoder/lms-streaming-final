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
  Table,
  Avatar,
  List,
  Rate,
  Input,
  Tooltip,
  Space,
  Popconfirm,
  message,
  Modal,
} from "antd";
import {
  UserOutlined,
  ReadOutlined,
  StarFilled,
  EditOutlined,
  CalendarOutlined,
  SearchOutlined,
  MailOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { instructorService } from "../../services/instructor.service";
import type {
  InstructorCourseInfoResponse,
  ReviewCourseResponse,
  InstructorCourseParticipantResponse,
} from "../../@types/instructor.types";

const { Title, Text } = Typography;
const { TextArea } = Input; // Sử dụng TextArea cho phần nhập lý do

const InstructorCourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<InstructorCourseInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentSearch, setStudentSearch] = useState("");

  // --- THÊM STATE ĐỂ QUẢN LÝ MODAL BAN HỌC VIÊN ---
  const [isBanModalVisible, setIsBanModalVisible] = useState(false);
  const [selectedStudentForBan, setSelectedStudentForBan] = useState<
    string | null
  >(null);
  const [banReason, setBanReason] = useState("");

  useEffect(() => {
    if (id) fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await instructorService.getCourse(id!);
      if (res.data) setData(res.data);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải thông tin khóa học.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm helper để cập nhật UI tránh lặp code
  const updateStudentUI = (
    studentId: string,
    newStatus: "ACTIVE" | "BANNED",
  ) => {
    setData((prevData) => {
      if (!prevData) return prevData;
      return {
        ...prevData,
        students: prevData.students.map((student) =>
          student.id === studentId
            ? { ...student, status: newStatus }
            : student,
        ),
      };
    });
  };

  const handleToggleStudentStatus = async (
    studentId: string,
    currentStatus: "ACTIVE" | "BANNED",
  ) => {
    if (currentStatus === "ACTIVE") {
      setSelectedStudentForBan(studentId);
      setBanReason("");
      setIsBanModalVisible(true);
    } else {
      try {
        await instructorService.active({
          userId: studentId,
          courseId: id!,
        });
        updateStudentUI(studentId, "ACTIVE");
        message.success("Đã mở khóa học viên thành công!");
      } catch (error) {
        console.error(error);
        message.error("Có lỗi xảy ra khi mở khóa học viên.");
      }
    }
  };

  const handleConfirmBan = async () => {
    if (!selectedStudentForBan) return;

    try {
      await instructorService.banned({
        userId: selectedStudentForBan,
        courseId: id!,
        reason: banReason,
      });

      updateStudentUI(selectedStudentForBan, "BANNED");
      message.success("Đã cấm học viên thành công!");

      setIsBanModalVisible(false);
      setSelectedStudentForBan(null);
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi cấm học viên.");
    }
  };

  if (loading)
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );

  if (!data)
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Empty description="Không tìm thấy dữ liệu khóa học" />
      </div>
    );

  const { course, students, reviews } = data;

  const getStarValue = (rateEnum: string): number => {
    const map: Record<string, number> = {
      ONE: 1,
      TWO: 2,
      THREE: 3,
      FOUR: 4,
      FIVE: 5,
    };
    return map[rateEnum] || 0;
  };

  const renderStatus = (status: string) => {
    const map: any = {
      PUBLISHED: { color: "success", label: "Đang hoạt động" },
      PRIVATE: { color: "default", label: "Bản nháp" },
      PENDING: { color: "warning", label: "Chờ duyệt" },
      LOCKED: { color: "error", label: "Đã khóa" },
    };
    const s = map[status] || { color: "default", label: status };
    return (
      <Tag color={s.color} className="text-sm px-2 py-0.5">
        {s.label}
      </Tag>
    );
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      <Descriptions
        bordered
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        size="middle"
        labelStyle={{ fontWeight: "bold", width: "150px" }}
      >
        <Descriptions.Item label="Tiêu đề">{course.title}</Descriptions.Item>
        <Descriptions.Item label="Danh mục">
          <Tag color="cyan">{course.category?.name}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Trình độ">{course.level}</Descriptions.Item>
        <Descriptions.Item label="Người tạo">
          {course.createdBy}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {new Date(course.createdAt).toLocaleDateString("vi-VN")}
        </Descriptions.Item>
        <Descriptions.Item label="Cập nhật cuối">
          {new Date(course.updatedAt).toLocaleDateString("vi-VN")}
        </Descriptions.Item>
      </Descriptions>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Mô tả ngắn" size="small" className="bg-gray-50 h-full">
          <div className="text-gray-600 italic">
            {course.descriptionShort || "Chưa có mô tả ngắn."}
          </div>
        </Card>

        <Card
          title="Yêu cầu đầu vào"
          size="small"
          className="bg-gray-50 h-full"
        >
          {course.requirements ? (
            <ul className="list-none pl-0 m-0 space-y-2">
              {!course.requirements.includes("<") ? (
                course.requirements.split(";").map(
                  (req, idx) =>
                    req.trim() && (
                      <li
                        key={idx}
                        className="flex gap-2 items-start text-gray-700"
                      >
                        <CheckCircleOutlined className="text-green-500 mt-1 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ),
                )
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: course.requirements }}
                />
              )}
            </ul>
          ) : (
            <span className="text-gray-400">Không có yêu cầu cụ thể.</span>
          )}
        </Card>
      </div>

      <Card
        title="Mô tả chi tiết nội dung"
        size="small"
        className="bg-gray-50 border-gray-200"
      >
        <div
          className="text-gray-700 leading-relaxed custom-html-content"
          dangerouslySetInnerHTML={{ __html: course.description }}
        />
      </Card>
    </div>
  );

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()),
  );

  const StudentsTab = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Text strong className="text-gray-600">
          Tổng số: {students.length} học viên
        </Text>
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Tìm theo tên hoặc email..."
          className="w-64"
          allowClear
          onChange={(e) => setStudentSearch(e.target.value)}
        />
      </div>
      <Table
        dataSource={filteredStudents}
        rowKey="id"
        pagination={{ pageSize: 8 }}
        locale={{
          emptyText: (
            <Empty
              description="Chưa có học viên nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        columns={[
          {
            title: "Học viên",
            dataIndex: "fullName",
            key: "fullName",
            render: (text, record) => (
              <div className="flex items-center gap-3">
                <Avatar
                  src={record.avatarUrl}
                  icon={<UserOutlined />}
                  className={
                    record.status === "BANNED"
                      ? "bg-gray-200 text-gray-400"
                      : "bg-indigo-100 text-indigo-600"
                  }
                />
                <span
                  className={`font-medium ${record.status === "BANNED" ? "text-gray-400 line-through" : "text-gray-700"}`}
                >
                  {text}
                </span>
              </div>
            ),
          },
          {
            title: "Email liên hệ",
            dataIndex: "email",
            key: "email",
            render: (text) => (
              <span className="text-gray-500">
                <MailOutlined className="mr-2" />
                {text}
              </span>
            ),
          },
          {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: "ACTIVE" | "BANNED") => (
              <Tag
                color={status === "ACTIVE" ? "success" : "error"}
                className="border-0"
              >
                {status === "ACTIVE" ? "Đang học" : "Bị cấm"}
              </Tag>
            ),
          },
          {
            title: "Hành động",
            key: "action",
            align: "right",
            render: (_: any, record: InstructorCourseParticipantResponse) => (
              <Space>
                {record.status === "ACTIVE" ? (
                  // Bấm khóa -> Mở Modal (không cần Popconfirm)
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<LockOutlined />}
                    onClick={() =>
                      handleToggleStudentStatus(record.id, record.status)
                    }
                  >
                    Khóa
                  </Button>
                ) : (
                  // Bấm mở khóa -> Hiện Popconfirm xác nhận nhanh
                  <Popconfirm
                    title="Mở khóa cho học viên này?"
                    description="Học viên sẽ có thể tiếp tục học."
                    onConfirm={() =>
                      handleToggleStudentStatus(record.id, record.status)
                    }
                    okText="Đồng ý"
                    cancelText="Hủy"
                    placement="left"
                  >
                    <Button
                      type="text"
                      size="small"
                      className="text-green-600 hover:text-green-500 hover:bg-green-50"
                      icon={<UnlockOutlined />}
                    >
                      Mở khóa
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            ),
          },
        ]}
      />
    </div>
  );

  const ReviewsTab = () => (
    <div className="max-w-4xl">
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Empty
            description="Chưa có đánh giá nào từ học viên"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={reviews}
          pagination={{ pageSize: 5, align: "center" }}
          renderItem={(item: ReviewCourseResponse) => (
            <List.Item className="bg-white p-4 mb-3 border border-gray-100 rounded-lg shadow-sm">
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={item.user.avatarUrl}
                    icon={<UserOutlined />}
                    size={48}
                    className="border border-gray-200"
                  />
                }
                title={
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">
                      {item.user.email}
                    </span>
                    <Rate
                      disabled
                      defaultValue={getStarValue(item.rate)}
                      className="text-sm"
                    />
                  </div>
                }
                description={
                  <div className="mt-2 text-gray-600 bg-gray-50 p-3 rounded italic">
                    "{item.content}"
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  const tabItems = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2">
          <BarChartOutlined /> Tổng quan
        </span>
      ),
      children: OverviewTab(),
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined /> Học viên ({students.length})
        </span>
      ),
      children: StudentsTab(),
    },
    {
      key: "3",
      label: (
        <span className="flex items-center gap-2">
          <StarFilled /> Đánh giá ({reviews.length})
        </span>
      ),
      children: ReviewsTab(),
    },
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-10">
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
              src={
                course.thumbnail || "https://placehold.co/300x200?text=No+Image"
              }
              width={280}
              height={180}
              className="rounded-lg shadow-sm border border-gray-100 object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <Title level={3} className="!mb-2 !mt-0 text-gray-800">
                  {course.title}
                </Title>
                <div className="flex items-center gap-3 mb-4">
                  {renderStatus(course.status)}
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500 flex items-center gap-1 text-sm">
                    <CalendarOutlined /> Tạo ngày:{" "}
                    {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
              <Tooltip title="Chỉnh sửa nội dung bài học, video">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  size="large"
                  className="bg-indigo-600 hover:bg-indigo-500 shadow-md"
                  onClick={() =>
                    navigate(`/instructor/courses/${course.id}/manage`)
                  }
                >
                  Quản lý nội dung
                </Button>
              </Tooltip>
            </div>

            <div className="mt-auto">
              <Row
                gutter={16}
                className="bg-gray-50 p-4 rounded-xl border border-gray-100"
              >
                <Col span={8}>
                  <Statistic
                    title={
                      <span className="text-gray-500 text-xs uppercase font-bold">
                        Học viên
                      </span>
                    }
                    value={course.totalStudents}
                    prefix={<UserOutlined className="text-blue-500 mr-1" />}
                    valueStyle={{ fontWeight: 600 }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={
                      <span className="text-gray-500 text-xs uppercase font-bold">
                        Bài học
                      </span>
                    }
                    value={course.totalLessons}
                    prefix={<ReadOutlined className="text-purple-500 mr-1" />}
                    valueStyle={{ fontWeight: 600 }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={
                      <span className="text-gray-500 text-xs uppercase font-bold">
                        Đánh giá trung bình
                      </span>
                    }
                    value={course.averageRating || 0}
                    precision={1}
                    prefix={<StarFilled className="text-yellow-400 mr-1" />}
                    suffix={
                      <span className="text-xs text-gray-400">
                        / 5 ({course.countRating})
                      </span>
                    }
                    valueStyle={{ fontWeight: 600 }}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Card>

      <Card bordered={false} className="shadow-sm rounded-xl min-h-[400px]">
        <Tabs defaultActiveKey="1" items={tabItems} size="large" />
      </Card>

      {/* --- MODAL BAN HỌC VIÊN --- */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <LockOutlined className="text-red-500" />
            <span>Xác nhận cấm học viên</span>
          </div>
        }
        open={isBanModalVisible}
        onOk={handleConfirmBan}
        onCancel={() => {
          setIsBanModalVisible(false);
          setSelectedStudentForBan(null);
        }}
        okText="Khóa học viên"
        cancelText="Hủy bỏ"
        okButtonProps={{ danger: true }}
      >
        <div className="mb-4 text-gray-600">
          Vui lòng nhập lý do cấm học viên này (tùy chọn). Học viên sẽ không thể
          xem nội dung khóa học nữa.
        </div>
        <TextArea
          rows={4}
          placeholder="Nhập lý do cấm (ví dụ: Vi phạm chính sách, Spam...)"
          value={banReason}
          onChange={(e) => setBanReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default InstructorCourseDetailPage;
