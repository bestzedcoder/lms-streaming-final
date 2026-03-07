import React, { useState, useEffect } from "react";
import { Card, Typography, Table, Row, Col, Select, Avatar, Empty } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import type { InstructorResponse } from "../@types/course.type";

const { Title } = Typography;

// --- DỮ LIỆU FAKE ĐỂ TEST GIAO DIỆN ---
const fakeInstructors: InstructorResponse[] = [
  {
    instructorId: "inst-1",
    email: "nguyenvana@hust.edu.vn",
    fullName: "Nguyễn Văn A",
    phoneNumber: "0987654321",
    countCourses: 12,
    countStudents: 1540,
  },
  {
    instructorId: "inst-2",
    email: "tranthib@hust.edu.vn",
    fullName: "Trần Thị B",
    phoneNumber: "0912345678",
    countCourses: 8,
    countStudents: 980,
  },
  {
    instructorId: "inst-3",
    email: "levanc@hust.edu.vn",
    fullName: "Lê Văn C",
    phoneNumber: "0909090909",
    countCourses: 5,
    countStudents: 450,
  },
  {
    instructorId: "inst-4",
    email: "phamthid@hust.edu.vn",
    fullName: "Phạm Thị D",
    phoneNumber: "0988888888",
    countCourses: 15,
    countStudents: 2100,
  },
  {
    instructorId: "inst-5",
    email: "hoangvane@hust.edu.vn",
    fullName: "Hoàng Văn E",
    phoneNumber: "0977777777",
    countCourses: 3,
    countStudents: 120,
  },
];

const InstructorStatsPage: React.FC = () => {
  const [instructors, setInstructors] = useState<InstructorResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInstructor, setSelectedInstructor] =
    useState<InstructorResponse | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("2026");

  useEffect(() => {
    // Giả lập gọi API mất 0.8s
    const fetchInstructorsFake = () => {
      setLoading(true);
      setTimeout(() => {
        setInstructors(fakeInstructors);
        setSelectedInstructor(fakeInstructors[0]); // Mặc định chọn người đầu tiên
        setLoading(false);
      }, 800);
    };

    fetchInstructorsFake();
  }, []);

  // Hàm tạo Fake Doanh thu dựa trên năm và ID của giáo viên
  const generateFakeRevenue = (year: string) => {
    if (!selectedInstructor) return [];

    // Nếu là năm 2026 (năm hiện tại), chỉ tạo data 3 tháng đầu
    const months =
      year === "2026"
        ? ["Tháng 1", "Tháng 2", "Tháng 3"]
        : [
            "T1",
            "T2",
            "T3",
            "T4",
            "T5",
            "T6",
            "T7",
            "T8",
            "T9",
            "T10",
            "T11",
            "T12",
          ];

    // Dùng mã ASCII của ký tự cuối trong ID để làm "hạt giống" random (giúp mỗi giáo viên có biểu đồ khác nhau)
    const seed = selectedInstructor.instructorId.charCodeAt(
      selectedInstructor.instructorId.length - 1,
    );

    return months.map((month, index) => {
      // Công thức fake tiền: Dao động từ 5 triệu đến 25 triệu VNĐ
      const randomRevenue =
        (Math.abs(Math.sin(seed + index)) * 20 + 5) * 1000000;
      return {
        name: month,
        revenue: Math.round(randomRevenue),
      };
    });
  };

  const chartData = generateFakeRevenue(selectedYear);

  const columns = [
    {
      title: "Giảng viên",
      key: "info",
      render: (_: any, record: InstructorResponse) => (
        <div className="flex items-center gap-3">
          <Avatar
            icon={<UserOutlined />}
            className="bg-blue-100 text-blue-500"
          />
          <div>
            <div className="font-medium text-slate-800">{record.fullName}</div>
            <div className="text-xs text-slate-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Học sinh",
      dataIndex: "countStudents",
      align: "center" as const,
      width: 100,
      render: (val: number) => (
        <span className="font-semibold text-emerald-600">{val}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={3} className="text-slate-800 !mb-0">
          Thống kê Giảng viên
        </Title>
        <Select
          value={selectedYear}
          onChange={setSelectedYear}
          className="w-32"
          options={[
            { value: "2026", label: "Năm 2026" },
            { value: "2025", label: "Năm 2025" },
          ]}
        />
      </div>

      <Row gutter={[24, 24]}>
        {/* Cột trái: Danh sách giảng viên */}
        <Col xs={24} lg={9}>
          <Card
            className="shadow-sm border-0 rounded-xl h-[600px] overflow-y-auto"
            title="Chọn Giảng viên"
          >
            <Table
              columns={columns}
              dataSource={instructors}
              rowKey="instructorId"
              loading={loading}
              pagination={false}
              rowClassName={(record) =>
                record.instructorId === selectedInstructor?.instructorId
                  ? "bg-blue-50 cursor-pointer transition-colors"
                  : "cursor-pointer hover:bg-slate-50 transition-colors"
              }
              onRow={(record) => ({
                onClick: () => setSelectedInstructor(record),
              })}
            />
          </Card>
        </Col>

        {/* Cột phải: Biểu đồ */}
        <Col xs={24} lg={15}>
          <Card
            className="shadow-sm border-0 rounded-xl h-[600px]"
            title={
              selectedInstructor
                ? `Doanh thu: ${selectedInstructor.fullName}`
                : "Biểu đồ Doanh thu"
            }
          >
            {selectedInstructor ? (
              <div className="h-[480px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#8c8c8c" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) =>
                        `${(value / 1000000).toFixed(0)}Tr`
                      }
                    />
                    <RechartsTooltip
                      formatter={(value: number) =>
                        new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(value)
                      }
                      cursor={{ fill: "rgba(0,0,0,0.04)" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#1677ff"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={60}
                      animationDuration={1000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Empty description="Vui lòng chọn giảng viên bên trái" />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InstructorStatsPage;
