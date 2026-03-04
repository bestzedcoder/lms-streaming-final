import React from "react";
import { Card, Row, Col, Typography, Avatar, List, Tag } from "antd";
import {
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  TrophyOutlined,
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

const { Title, Text } = Typography;

// --- MOCK DATA ---
const revenueData = [
  { month: "Tháng 8", revenue: 12000000, users: 120 },
  { month: "Tháng 9", revenue: 19000000, users: 150 },
  { month: "Tháng 10", revenue: 15000000, users: 180 },
  { month: "Tháng 11", revenue: 28000000, users: 250 },
  { month: "Tháng 12", revenue: 35000000, users: 320 },
  { month: "Tháng 1", revenue: 42000000, users: 400 },
];

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

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <Title level={3} className="text-slate-800 !mb-0">
        Tổng quan hệ thống
      </Title>

      {/* --- DÒNG 1: KPI CARDS --- */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl shadow-sm border-0 hover:shadow-md transition-all">
            <div className="flex justify-between items-center">
              <div>
                <Text className="text-slate-500 font-medium">
                  Tổng Học viên
                </Text>
                <Title level={2} className="!m-0 text-slate-800">
                  2,450
                </Title>
              </div>
              <Avatar
                size={56}
                className="bg-blue-50 text-blue-500"
                icon={<UserOutlined className="text-2xl" />}
              />
            </div>
            <div className="mt-4 text-sm text-emerald-500 font-medium">
              ↑ +12% so với tháng trước
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl shadow-sm border-0 hover:shadow-md transition-all">
            <div className="flex justify-between items-center">
              <div>
                <Text className="text-slate-500 font-medium">
                  Tổng Doanh thu (VNĐ)
                </Text>
                <Title level={2} className="!m-0 text-slate-800">
                  145M
                </Title>
              </div>
              <Avatar
                size={56}
                className="bg-emerald-50 text-emerald-500"
                icon={<DollarOutlined className="text-2xl" />}
              />
            </div>
            <div className="mt-4 text-sm text-emerald-500 font-medium">
              ↑ +8.5% so với tháng trước
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl shadow-sm border-0 hover:shadow-md transition-all">
            <div className="flex justify-between items-center">
              <div>
                <Text className="text-slate-500 font-medium">
                  Khóa học đang hoạt động
                </Text>
                <Title level={2} className="!m-0 text-slate-800">
                  128
                </Title>
              </div>
              <Avatar
                size={56}
                className="bg-purple-50 text-purple-500"
                icon={<BookOutlined className="text-2xl" />}
              />
            </div>
            <div className="mt-4 text-sm text-slate-400 font-medium">
              Bao gồm 12 danh mục
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl shadow-sm border-0 hover:shadow-md transition-all bg-gradient-to-br from-orange-50 to-red-50">
            <div className="flex justify-between items-center">
              <div>
                <Text className="text-orange-600 font-medium">
                  Khóa học cần duyệt
                </Text>
                <Title level={2} className="!m-0 text-red-600">
                  12
                </Title>
              </div>
              <Avatar
                size={56}
                className="bg-red-100 text-red-500"
                icon={<ExclamationCircleOutlined className="text-2xl" />}
              />
            </div>
            <div className="mt-4 text-sm text-red-500 font-medium cursor-pointer hover:underline">
              Xử lý ngay →
            </div>
          </Card>
        </Col>
      </Row>

      {/* --- DÒNG 2: BIỂU ĐỒ (RECHARTS) --- */}
      <Row gutter={[16, 16]}>
        {/* Biểu đồ Doanh thu (Area Chart) */}
        <Col xs={24} lg={16}>
          <Card
            title="Xu hướng Doanh thu & Người dùng (6 tháng)"
            className="rounded-2xl shadow-sm border-0 h-full"
          >
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    {/* Gradient cho Doanh thu */}
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
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8c8c8c" }}
                    dy={10}
                  />
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8c8c8c" }}
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number) =>
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value)
                    }
                  />
                  <Area
                    yAxisId="left"
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
