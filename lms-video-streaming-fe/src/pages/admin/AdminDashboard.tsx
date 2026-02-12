import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Avatar,
  Progress,
  Tooltip,
} from "antd";
import {
  UsergroupAddOutlined,
  ReadOutlined,
  DollarCircleOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons";

const AdminDashboard = () => {
  // Mock Data
  const stats = [
    {
      title: "Tổng người dùng",
      value: 15420,
      icon: <UsergroupAddOutlined />,
      color: "text-blue-600",
      bg: "bg-blue-100",
      trend: "+12% tuần này",
    },
    {
      title: "Tổng khóa học",
      value: 345,
      icon: <ReadOutlined />,
      color: "text-purple-600",
      bg: "bg-purple-100",
      trend: "+5 khóa mới",
    },
    {
      title: "Doanh thu sàn",
      value: "450M",
      icon: <DollarCircleOutlined />,
      color: "text-green-600",
      bg: "bg-green-100",
      trend: "+8% so với tháng trước",
    },
    {
      title: "Chờ phê duyệt",
      value: 12,
      icon: <ClockCircleOutlined />,
      color: "text-orange-600",
      bg: "bg-orange-100",
      trend: "Cần xử lý ngay",
    },
  ];

  const pendingCourses = [
    {
      key: "1",
      name: "Nhập môn Trí tuệ nhân tạo (AI)",
      instructor: "TS. Lê Văn A",
      date: "12/02/2026",
      category: "CNTT",
    },
    {
      key: "2",
      name: "Kỹ năng giao tiếp trong kinh doanh",
      instructor: "ThS. Phạm Thị B",
      date: "11/02/2026",
      category: "Kinh tế",
    },
    {
      key: "3",
      name: "Cơ học kỹ thuật 1",
      instructor: "PGS. Trần Văn C",
      date: "10/02/2026",
      category: "Cơ khí",
    },
    {
      key: "4",
      name: "Luyện thi TOEIC 4 kỹ năng",
      instructor: "Ms. Alice Nguyen",
      date: "09/02/2026",
      category: "Ngoại ngữ",
    },
  ];

  const columns = [
    {
      title: "Tên khóa học",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-semibold text-gray-700">{text}</span>
      ),
    },
    {
      title: "Giảng viên",
      dataIndex: "instructor",
      key: "instructor",
      render: (text: string) => <span className="text-gray-500">{text}</span>,
    },
    { title: "Ngày gửi", dataIndex: "date", key: "date" },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (tag: string) => <Tag color="blue">{tag}</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      render: () => (
        <div className="flex gap-2">
          <Tooltip title="Duyệt nhanh">
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              className="bg-green-600 hover:bg-green-500 border-none"
            />
          </Tooltip>
          <Tooltip title="Từ chối">
            <Button
              type="primary"
              danger
              size="small"
              icon={<CloseCircleOutlined />}
            />
          </Tooltip>
          <Button size="small" icon={<MoreOutlined />} />
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* --- 1. STATS CARDS --- */}
      <Row gutter={[24, 24]} className="mb-8">
        {stats.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              bordered={false}
              className="rounded-xl shadow-sm hover:shadow-lg transition-all cursor-default border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 font-medium mb-1">{item.title}</p>
                  <h3 className="text-3xl font-extrabold text-gray-800 m-0">
                    {item.value}
                  </h3>
                </div>
                <div
                  className={`p-3 rounded-lg ${item.bg} ${item.color} text-xl`}
                >
                  {item.icon}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center text-xs font-semibold text-gray-500">
                <span className="text-green-500 bg-green-50 px-1.5 py-0.5 rounded mr-2 flex items-center">
                  <ArrowUpOutlined />
                </span>
                {item.trend}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* --- 2. TRAFFIC CHART & SYSTEM HEALTH --- */}
        <Col xs={24} lg={16}>
          <Card
            title="Phê duyệt khóa học chờ (Pending)"
            bordered={false}
            className="rounded-xl shadow-sm h-full"
            extra={<Button type="link">Xem tất cả</Button>}
          >
            <Table
              columns={columns}
              dataSource={pendingCourses}
              pagination={false}
              className="ant-table-striped"
              rowClassName="hover:bg-gray-50 transition-colors"
            />
          </Card>
        </Col>

        {/* --- 3. RIGHT SIDEBAR (SYSTEM INFO) --- */}
        <Col xs={24} lg={8}>
          <Card
            title="Trạng thái hệ thống"
            bordered={false}
            className="rounded-xl shadow-sm mb-6"
          >
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 font-medium">CPU Usage</span>
                  <span className="font-bold text-gray-800">45%</span>
                </div>
                <Progress
                  percent={45}
                  strokeColor="#6366f1"
                  showInfo={false}
                  size="small"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 font-medium">
                    Memory (RAM)
                  </span>
                  <span className="font-bold text-gray-800">72%</span>
                </div>
                <Progress
                  percent={72}
                  strokeColor="#f59e0b"
                  status="active"
                  showInfo={false}
                  size="small"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 font-medium">Storage</span>
                  <span className="font-bold text-gray-800">30%</span>
                </div>
                <Progress
                  percent={30}
                  strokeColor="#10b981"
                  showInfo={false}
                  size="small"
                />
              </div>
            </div>
          </Card>

          <Card
            title="Thành viên mới nhất"
            bordered={false}
            className="rounded-xl shadow-sm"
          >
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                    />
                    <div>
                      <div className="font-bold text-sm text-gray-700">
                        User {i + 1}
                      </div>
                      <div className="text-xs text-gray-400">Student</div>
                    </div>
                  </div>
                  <Tag
                    color={i % 2 === 0 ? "green" : "blue"}
                    className="mr-0 rounded-full"
                  >
                    {i % 2 === 0 ? "Active" : "New"}
                  </Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
