import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  theme,
  message,
  Avatar,
  Dropdown,
  Badge,
  Typography,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  BookOutlined,
  FileSearchOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Outlet, Link, useLocation } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const location = useLocation();
  const { logout, user } = useAuth();

  // Lấy thêm pendingInstructorCount từ Context
  const { pendingCoursesCount, pendingInstructorCount } = useNotification();

  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary },
  } = theme.useToken();

  // Tự động mở submenu tương ứng dựa trên URL hiện tại
  useEffect(() => {
    const keys = [];
    if (
      location.pathname.includes("/pending-courses") ||
      location.pathname.includes("/courses-search") ||
      location.pathname.includes("/instructor-stats")
    ) {
      keys.push("sub-courses");
    }
    if (
      location.pathname.includes("/users") ||
      location.pathname.includes("/instructor-requests")
    ) {
      keys.push("sub-users");
    }
    setOpenKeys(keys);
  }, [location.pathname]);

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post("/admin/logout");
      message.success("Đã đăng xuất thành công!");
      setTimeout(() => {
        logout();
      }, 500);
    } catch (error) {
      message.error("Lỗi khi đăng xuất");
    }
  };

  const userMenu = {
    items: [
      {
        key: "profile",
        label: <span className="font-medium text-gray-700">Hồ sơ cá nhân</span>,
      },
      {
        type: "divider",
      },
      {
        key: "logout",
        icon: <LogoutOutlined className="text-red-500" />,
        label: <span className="text-red-500 font-medium">Đăng xuất</span>,
        onClick: handleLogout,
      },
    ] as any,
  };

  const sidebarMenuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: <Link to="/">Tổng quan</Link>,
    },
    {
      key: "sub-users",
      icon: <UserOutlined />,
      label: "Quản lý người dùng",
      children: [
        {
          key: "/users",
          label: <Link to="/users">Danh sách người dùng</Link>,
        },
        {
          key: "/instructor-requests",
          label: (
            <Link
              to="/instructor-requests"
              className="flex justify-between items-center w-full pr-4"
            >
              <span>Phê duyệt giảng viên</span>
              {pendingInstructorCount > 0 && (
                <Badge
                  count={pendingInstructorCount}
                  style={{ backgroundColor: "#ff4d4f", boxShadow: "none" }}
                  offset={[0, 0]}
                />
              )}
            </Link>
          ),
        },
      ],
    },
    {
      key: "/categories",
      icon: <AppstoreOutlined />,
      label: <Link to="/categories">Quản lý danh mục</Link>,
    },
    {
      key: "sub-courses",
      icon: <BookOutlined />,
      label: "Quản lý khóa học",
      children: [
        {
          key: "/pending-courses",
          icon: <CheckCircleOutlined />,
          label: (
            <Link
              to="/pending-courses"
              className="flex justify-between items-center w-full pr-4"
            >
              <span>Phê duyệt khóa học</span>
              {pendingCoursesCount > 0 && (
                <Badge
                  count={pendingCoursesCount}
                  style={{ backgroundColor: "#ff4d4f", boxShadow: "none" }}
                  offset={[0, 0]}
                />
              )}
            </Link>
          ),
        },
        {
          key: "/courses-search",
          icon: <FileSearchOutlined />,
          label: <Link to="/courses-search">Tra cứu theo giáo viên</Link>,
        },
        {
          key: "/instructor-stats",
          icon: <SolutionOutlined />,
          label: <Link to="/instructor-stats">Thống kê giáo viên</Link>,
        },
      ],
    },
    {
      key: "/revenue",
      icon: <BarChartOutlined />,
      label: <Link to="/revenue">Tổng doanh thu hệ thống</Link>,
    },
  ];

  return (
    <Layout className="min-h-screen bg-slate-50">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        width={260}
        className="shadow-2xl z-20"
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-700/50 transition-all duration-300 bg-slate-900">
          <Link
            to="/"
            className="flex items-center gap-3 overflow-hidden px-4 hover:opacity-80"
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-inner">
              H
            </div>
            {!collapsed && (
              <span className="text-white font-bold text-lg tracking-wider whitespace-nowrap">
                HUST LMS Admin
              </span>
            )}
          </Link>
        </div>

        <div
          className="py-4 overflow-y-auto overflow-x-hidden"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            items={sidebarMenuItems}
            className="border-none"
          />
        </div>
      </Sider>

      <Layout className="transition-all duration-300">
        <Header
          className="px-6 flex justify-between items-center sticky top-0 z-10"
          style={{
            background: colorBgContainer,
            boxShadow:
              "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
          }}
        >
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors text-gray-600"
            />
          </div>

          <div className="flex items-center gap-4 cursor-pointer">
            <Dropdown
              menu={userMenu}
              placement="bottomRight"
              arrow
              trigger={["click"]}
            >
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                <Avatar
                  style={{ backgroundColor: colorPrimary }}
                  icon={<UserOutlined />}
                  size="default"
                />
                <div className="hidden md:flex flex-col leading-tight items-start">
                  <Text strong className="text-slate-800 text-sm">
                    {user?.fullName || "Administrator"}
                  </Text>
                  <Text type="secondary" className="text-xs">
                    Quản trị viên
                  </Text>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          className="m-6 p-6 min-h-[280px] overflow-y-auto"
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
