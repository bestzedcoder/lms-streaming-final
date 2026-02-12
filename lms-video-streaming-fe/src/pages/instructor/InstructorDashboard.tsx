import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Progress,
  Button,
  Avatar,
  Typography,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  DollarCircleOutlined,
  ReadOutlined,
  StarOutlined,
  ArrowUpOutlined,
  MoreOutlined,
  CheckCircleFilled,
  GlobalOutlined,
  LinkedinFilled,
  FacebookFilled,
  YoutubeFilled,
  EditOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/useAuthStore.store";
import { useInstructorStore } from "../../store/useInstructorStore.store";
import { useNavigate } from "react-router-dom";

const InstructorDashboard = () => {
  const { user } = useAuthStore();
  const { instructorInfo } = useInstructorStore();
  const navigate = useNavigate();

  // --- MOCK DATA GIỮ NGUYÊN ---
  const stats = [
    {
      title: "Tổng doanh thu",
      value: "125.000.000đ",
      icon: <DollarCircleOutlined />,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      trend: "+15%",
    },
    {
      title: "Học viên",
      value: "1,240",
      icon: <UserOutlined />,
      color: "text-blue-600",
      bg: "bg-blue-100",
      trend: "+120",
    },
    {
      title: "Khóa học",
      value: "8",
      icon: <ReadOutlined />,
      color: "text-violet-600",
      bg: "bg-violet-100",
      trend: "Active",
    },
    {
      title: "Đánh giá",
      value: "4.8/5.0",
      icon: <StarOutlined />,
      color: "text-amber-500",
      bg: "bg-amber-100",
      trend: "Tuyệt vời",
    },
  ];

  const recentCourses = [
    {
      key: "1",
      name: "Lập trình Java Spring Boot 2024",
      students: 450,
      price: "1.200.000đ",
      status: "Active",
      rating: 4.9,
      img: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    },
    {
      key: "2",
      name: "ReactJS Masterclass: Từ Zero đến Hero",
      students: 320,
      price: "990.000đ",
      status: "Active",
      rating: 4.8,
      img: "https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg",
    },
    {
      key: "3",
      name: "Docker & Kubernetes cho DevOps",
      students: 0,
      price: "1.500.000đ",
      status: "Draft",
      rating: 0,
      img: "https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLb9yZ.png",
    },
  ];

  const columns = [
    {
      title: "Khóa học",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <img
            src={record.img}
            alt=""
            className="w-10 h-10 rounded object-cover border border-gray-100"
          />
          <span className="font-semibold text-gray-700">{text}</span>
        </div>
      ),
    },
    { title: "Học viên", dataIndex: "students", key: "students" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      className: "font-medium",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={status === "Active" ? "success" : "default"}
          className="rounded-full border-0 px-3 font-medium"
        >
          {status === "Active" ? "Đang bán" : "Bản nháp"}
        </Tag>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) =>
        rating > 0 ? (
          <span className="flex items-center gap-1 font-medium text-gray-700">
            <StarOutlined className="text-amber-400" /> {rating}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">Chưa có</span>
        ),
    },
    {
      title: "",
      key: "action",
      render: () => (
        <Button
          type="text"
          icon={<MoreOutlined />}
          className="text-gray-400 hover:text-gray-600"
        />
      ),
    },
  ];

  return (
    <div className="animate-fade-in pb-10">
      {/* --- 1. PROFILE HEADER SECTION --- */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          {/* Avatar Column */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative">
              <div className="p-1.5 bg-white rounded-full shadow-lg">
                {/* --- ĐÂY LÀ PHẦN ĐÃ CHỈNH SỬA --- */}
                <Avatar
                  size={120}
                  src={user?.avatarUrl} // Luôn ưu tiên hiển thị ảnh từ User Store
                  icon={<UserOutlined />} // Icon fallback nếu ảnh lỗi/chưa có
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-4xl border-4 border-white object-cover"
                >
                  {/* Logic fallback: Nếu KHÔNG có ảnh thì mới hiển thị chữ cái đầu */}
                  {!user?.avatarUrl && user?.fullName?.charAt(0).toUpperCase()}
                </Avatar>
              </div>
              <div
                className="absolute bottom-4 right-2 bg-emerald-500 w-5 h-5 rounded-full border-[3px] border-white shadow-sm"
                title="Online Status"
              ></div>
            </div>
          </div>

          {/* Info Column */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-gray-800 m-0 tracking-tight">
                {user?.fullName}
              </h1>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-100">
                <CheckCircleFilled /> Official Instructor
              </div>
            </div>

            <p className="text-blue-600 font-semibold text-lg mb-4">
              {instructorInfo?.title || "Chức danh chuyên môn chưa cập nhật"}
            </p>

            {/* Bio Section */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5 text-gray-600 text-sm leading-relaxed border border-gray-100 text-left">
              {instructorInfo?.bio ? (
                <div
                  className="prose prose-sm max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: instructorInfo.bio }}
                />
              ) : (
                <span className="italic text-gray-400">
                  "Hãy cập nhật tiểu sử để học viên hiểu rõ hơn về kinh nghiệm
                  của bạn..."
                </span>
              )}
            </div>

            {/* Social & Meta */}
            <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 pt-2 border-t border-gray-100">
              <div className="flex gap-3">
                {instructorInfo?.socialLinks?.website && (
                  <Tooltip title="Website">
                    <a
                      href={instructorInfo.socialLinks.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-400 hover:text-blue-600 transition-colors text-lg"
                    >
                      <GlobalOutlined />
                    </a>
                  </Tooltip>
                )}
                {/* Các icon social khác... */}
              </div>

              <Button
                type="dashed"
                icon={<EditOutlined />}
                onClick={() => navigate("/instructor/settings")}
                className="text-gray-500 hover:text-blue-600 hover:border-blue-600"
              >
                Cập nhật hồ sơ
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. STATS GRID (Giữ nguyên) --- */}
      <Row gutter={[20, 20]} className="mb-8">
        {stats.map((item, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <Card
              bordered={false}
              className="shadow-sm rounded-xl hover:shadow-md transition-all duration-300 cursor-default group h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${item.trend.includes("+") ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}
                >
                  {item.trend.includes("+") && (
                    <RiseOutlined className="mr-1" />
                  )}
                  {item.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 m-0">
                {item.value}
              </h3>
              <p className="text-gray-500 font-medium text-sm mt-1">
                {item.title}
              </p>
            </Card>
          </Col>
        ))}
      </Row>

      {/* --- 3. CHARTS & COURSES (Giữ nguyên) --- */}
      <Row gutter={[24, 24]}>
        {/* Left: Revenue Chart */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <span className="font-bold text-gray-700 text-lg">
                Doanh thu 12 tháng qua
              </span>
            }
            bordered={false}
            className="shadow-sm rounded-xl h-full"
            extra={<Button size="small">Chi tiết</Button>}
          >
            {/* ... Chart code ... */}
            <div className="h-64 flex items-end justify-between gap-3 px-2 pb-4 pt-4 border-b border-dashed border-gray-100">
              {[35, 55, 45, 70, 60, 85, 75, 90, 100, 80, 95, 85].map((h, i) => (
                <div
                  key={i}
                  className="w-full bg-slate-50 rounded-t-md relative group cursor-pointer h-full flex flex-col justify-end"
                >
                  <div
                    className="w-full bg-blue-500 rounded-t-md transition-all duration-500 group-hover:bg-blue-600 group-hover:shadow-lg shadow-blue-200 relative"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      Tháng {i + 1}: {h}tr
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Right: Goals & Tips */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <span className="font-bold text-gray-700 text-lg">
                Mục tiêu tháng này
              </span>
            }
            bordered={false}
            className="shadow-sm rounded-xl h-full"
          >
            <div className="flex flex-col gap-8 py-2">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-600">
                    Doanh thu mục tiêu
                  </span>
                  <span className="font-bold text-gray-800">75%</span>
                </div>
                <Progress
                  percent={75}
                  strokeColor="#3b82f6"
                  trailColor="#eff6ff"
                  strokeWidth={10}
                  showInfo={false}
                />
                <p className="text-xs text-gray-400 mt-2 font-medium text-right">
                  125tr / 150tr VND
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <span className="text-xl">💡</span> Tips giảng dạy
                </h4>
                <p className="text-sm text-blue-700 leading-relaxed m-0 opacity-90">
                  Thêm các bài tập thực hành (Coding Exercise) giúp tăng tỷ lệ
                  hoàn thành khóa học lên tới 30% so với video thuần túy.
                </p>
              </div>
            </div>
          </Card>
        </Col>

        {/* Bottom: Courses Table */}
        <Col span={24}>
          <Card
            title={
              <span className="font-bold text-gray-700 text-lg">
                Khóa học gần đây
              </span>
            }
            bordered={false}
            className="shadow-sm rounded-xl"
            extra={
              <Button type="link" className="font-medium">
                Xem tất cả
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={recentCourses}
              pagination={false}
              rowClassName="hover:bg-gray-50 transition-colors"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InstructorDashboard;
