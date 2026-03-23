import { Card, Row, Col, Tag, Button, Avatar, Typography, Empty } from "antd";
import {
  UserOutlined,
  ReadOutlined,
  EditOutlined,
  CheckCircleFilled,
  TeamOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useInstructorStore } from "../../store/useInstructorStore.store";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const InstructorDashboard = () => {
  const { instructorInfo } = useInstructorStore();
  const navigate = useNavigate();

  const stats = [
    {
      title: "Học viên",
      value: instructorInfo?.totalStudents,
      icon: <TeamOutlined />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Khóa học",
      value: instructorInfo?.totalCourses,
      icon: <ReadOutlined />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Đánh giá",
      value: "4.9",
      icon: <StarOutlined />,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-10 animate-fade-in">
      <Card className="mb-8 border-0 shadow-sm rounded-2xl bg-white">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start p-4">
          <Avatar
            size={110}
            icon={<UserOutlined />}
            className="bg-gradient-to-br from-indigo-500 to-blue-500 border-4 border-white shadow-lg flex-shrink-0"
          >
            {instructorInfo?.nickname?.charAt(0).toUpperCase()}
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
              <Title level={2} className="!mb-0 !text-gray-800">
                {instructorInfo?.nickname || "Giảng viên mới"}
              </Title>
              <Tag
                color="cyan"
                icon={<CheckCircleFilled />}
                className="rounded-full border-0 px-3"
              >
                Official
              </Tag>
            </div>

            <Text className="text-lg text-blue-600 block mb-4 font-semibold">
              {instructorInfo?.jobTitle || "Chức danh chuyên môn chưa cập nhật"}
            </Text>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Tiểu sử giảng viên
              </div>
              {instructorInfo?.bio ? (
                <Paragraph className="text-slate-600 m-0 leading-relaxed italic">
                  "{instructorInfo.bio}"
                </Paragraph>
              ) : (
                <Text type="secondary" italic>
                  Vui lòng cập nhật giới thiệu để thu hút học viên.
                </Text>
              )}
            </div>

            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => navigate("/instructor/settings")}
              className="rounded-lg font-bold border-2 hover:bg-blue-50"
            >
              Thiết lập hồ sơ
            </Button>
          </div>
        </div>
      </Card>

      <Row gutter={[24, 24]} className="mb-8">
        {stats.map((item, idx) => (
          <Col xs={24} sm={12} lg={8} key={idx}>
            <Card
              bordered={false}
              className="shadow-sm rounded-2xl hover:shadow-md transition-shadow h-full"
            >
              <div className="flex items-center gap-5">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${item.bg} ${item.color}`}
                >
                  {item.icon}
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-800 leading-none mb-1">
                    {item.value}
                  </div>
                  <Text className="text-slate-400 font-medium">
                    {item.title}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        title={
          <span className="font-bold text-slate-700">Khóa học hiện có</span>
        }
        className="border-0 shadow-sm rounded-2xl"
      >
        {instructorInfo?.totalCourses && instructorInfo.totalCourses > 0 ? (
          <div className="py-12 text-center bg-slate-50/50 rounded-xl">
            <Text strong className="text-slate-500">
              Bạn đang quản lý {instructorInfo.totalCourses} khóa học công khai.
            </Text>
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-slate-400">Bạn chưa tạo nội dung nào.</span>
            }
          >
            <Button
              type="primary"
              className="rounded-lg bg-slate-900 border-slate-900 h-10 px-8"
            >
              Tạo khóa học đầu tiên
            </Button>
          </Empty>
        )}
      </Card>
    </div>
  );
};

export default InstructorDashboard;
