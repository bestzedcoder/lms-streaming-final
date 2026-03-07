import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Avatar, List, Tag, Spin } from "antd";
import {
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  TrophyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { summaryService } from "../services/summary.service";
import type {
  SummaryDashboardResponse,
  SummaryMonthlyRevenueResponse,
} from "../@types/summary.type";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

// --- MOCK DATA (Tạm giữ cho các phần chưa có API) ---
const categoryData = [
  { name: "Lập trình Web", value: 45 },
  { name: "Khoa học Dữ liệu", value: 30 },
  { name: "Ngoại ngữ", value: 15 },
  { name: "Kỹ năng mềm", value: 10 },
];
const COLORS = ["#1677ff", "#52c41a", "#faad14", "#ff4d4f"];

const topCourses = [
  {
    id: 1,
    name: "Khóa học ReactJS Thực chiến",
    instructor: "Nguyễn Văn A",
    sales: 150,
    price: "1.200.000đ",
  },
  {
    id: 2,
    name: "Nhập môn Machine Learning",
    instructor: "Trần Thị B",
    sales: 120,
    price: "1.500.000đ",
  },
  {
    id: 3,
    name: "Tiếng Anh Giao tiếp IT",
    instructor: "Lê Văn C",
    sales: 95,
    price: "800.000đ",
  },
  {
    id: 4,
    name: "Java Spring Boot Masterclass",
    instructor: "Nguyễn Văn A",
    sales: 88,
    price: "1.400.000đ",
  },
];

// Hàm format tiền tệ (Ví dụ: 14.500.000 đ)
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// Hàm format tiền thu gọn (Ví dụ: 14.5 Tr)
const formatCompactCurrency = (value: number) => {
  if (value >= 1000000000) return (value / 1000000000).toFixed(1) + " Tỷ";
  if (value >= 1000000) return (value / 1000000).toFixed(1) + " Tr";
  return value.toLocaleString("vi-VN");
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { pendingCoursesCount } = useNotification(); // Lấy số lượng từ Context

  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] =
    useState<SummaryDashboardResponse | null>(null);
  const [revenueData, setRevenueData] = useState<
    SummaryMonthlyRevenueResponse[]
  >([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Chạy song song 2 API để tối ưu tốc độ load trang
        const [dashboardRes, revenueRes] = await Promise.all([
          summaryService.getSummaryDashboard(),
          summaryService.getSummaryMonthlyRevenue(),
        ]);

        if (dashboardRes.data) setSummaryData(dashboardRes.data);
        if (revenueRes.data) setRevenueData(revenueRes.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Spin size="large" tip="Đang tải dữ liệu tổng quan..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title level={3} className="text-slate-800 !mb-0">
        Tổng quan hệ thống
      </Title>

      {/* --- DÒNG 1: 5 KPI CARDS (Dùng Tailwind Grid để chia 5 cột đều nhau) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Card 1: Học viên */}
        <Card className="rounded-2xl shadow-sm border-0 hover:shadow-md transition-all h-full">
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <Text className="text-slate-500 font-medium whitespace-nowrap">
                  Tổng Học viên
                </Text>
                <Title level={2} className="!m-0 text-slate-800">
                  {summaryData?.totalStudents?.toLocaleString("vi-VN") || 0}
                </Title>
              </div>
              <Avatar
                size={48}
                className="bg-blue-50 text-blue-500 shrink-0"
                icon={<UserOutlined className="text-xl" />}
              />
            </div>
            <div className="mt-4 text-sm text-slate-400 font-medium">
              Đang hoạt động
            </div>
          </div>
        </Card>

        {/* Card 2: Giảng viên */}
        <Card className="rounded-2xl shadow-sm border-0 hover:shadow-md transition-all h-full">
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <Text className="text-slate-500 font-medium whitespace-nowrap">
                  Tổng Giảng viên
                </Text>
                <Title level={2} className="!m-0 text-slate-800">
                  {summaryData?.totalTeachers?.toLocaleString("vi-VN") || 0}
                </Title>
              </div>
              <Avatar
                size={48}
                className="bg-cyan-50 text-cyan-500 shrink-0"
                icon={<TeamOutlined className="text-xl" />}
              />
            </div>
            <div className="mt-4 text-sm text-slate-400 font-medium">
              Trên hệ thống
            </div>
          </div>
        </Card>

        {/* Card 3: Doanh thu */}
        <Card className="rounded-2xl shadow-sm border-0 hover:shadow-md transition-all h-full">
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <Text className="text-slate-500 font-medium whitespace-nowrap">
                  Tổng Doanh thu
                </Text>
                <Title
                  level={2}
                  className="!m-0 text-slate-800 text-emerald-600"
                >
                  {formatCompactCurrency(summaryData?.totalRevenues || 0)}
                </Title>
              </div>
              <Avatar
                size={48}
                className="bg-emerald-50 text-emerald-500 shrink-0"
                icon={<DollarOutlined className="text-xl" />}
              />
            </div>
            <div className="mt-4 text-sm text-slate-400 font-medium">
              Tích lũy toàn thời gian
            </div>
          </div>
        </Card>

        {/* Card 4: Tổng Khóa học */}
        <Card className="rounded-2xl shadow-sm border-0 hover:shadow-md transition-all h-full">
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <Text className="text-slate-500 font-medium whitespace-nowrap">
                  Tổng Khóa học
                </Text>
                <Title level={2} className="!m-0 text-slate-800">
                  {summaryData?.totalCourses?.toLocaleString("vi-VN") || 0}
                </Title>
              </div>
              <Avatar
                size={48}
                className="bg-purple-50 text-purple-500 shrink-0"
                icon={<BookOutlined className="text-xl" />}
              />
            </div>
            <div className="mt-4 text-sm text-slate-400 font-medium">
              Đã xuất bản
            </div>
          </div>
        </Card>

        {/* Card 5: Cần duyệt */}
        <Card
          className="rounded-2xl shadow-sm border-0 hover:shadow-md transition-all bg-gradient-to-br from-orange-50 to-red-50 cursor-pointer h-full"
          onClick={() => navigate("/pending-courses")}
        >
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <Text className="text-orange-600 font-medium whitespace-nowrap">
                  Cần phê duyệt
                </Text>
                <Title level={2} className="!m-0 text-red-600">
                  {pendingCoursesCount}
                </Title>
              </div>
              <Avatar
                size={48}
                className="bg-red-100 text-red-500 shrink-0"
                icon={<ExclamationCircleOutlined className="text-xl" />}
              />
            </div>
            <div className="mt-4 text-sm text-red-500 font-semibold hover:underline flex items-center gap-1">
              Xử lý ngay <span className="text-lg leading-none">→</span>
            </div>
          </div>
        </Card>
      </div>
      {/* --- DÒNG 2: BIỂU ĐỒ (RECHARTS) --- */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title="Xu hướng Doanh thu (10 tháng gần nhất)"
            className="rounded-2xl shadow-sm border-0 h-full"
          >
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#1677ff" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#1677ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />

                  {/* Trục X map với trường `time` trả về từ API (VD: T1/26) */}
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8c8c8c" }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8c8c8c" }}
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}Tr`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Doanh thu"
                    stroke="#1677ff"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Biểu đồ Phân bổ (Donut Chart) */}
        <Col xs={24} lg={8}>
          <Card
            title="Phân bổ Khóa học"
            className="rounded-2xl shadow-sm border-0 h-full"
          >
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* --- DÒNG 3: DANH SÁCH --- */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card
            title={
              <span>
                <TrophyOutlined className="text-yellow-500 mr-2" />
                Top Khóa học Bán chạy
              </span>
            }
            className="rounded-2xl shadow-sm border-0"
          >
            <List
              itemLayout="horizontal"
              dataSource={topCourses}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <Text strong className="text-blue-600">
                      {item.price}
                    </Text>,
                  ]}
                  className="hover:bg-slate-50 transition-colors px-4 rounded-lg"
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        className={
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                              ? "bg-gray-400"
                              : index === 2
                                ? "bg-amber-600"
                                : "bg-blue-100 text-blue-600"
                        }
                      >
                        {index + 1}
                      </Avatar>
                    }
                    title={
                      <span className="font-semibold text-slate-800">
                        {item.name}
                      </span>
                    }
                    description={`Giảng viên: ${item.instructor} | Đã bán: ${item.sales} lượt`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
