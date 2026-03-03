import React, { useState } from "react";
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
} from "@ant-design/icons";
import { Outlet, Link, useLocation } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();
  const { pendingCoursesCount } = useNotification();

  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary },
  } = theme.useToken();

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
      key: "/users",
      icon: <UserOutlined />,
      label: <Link to="/users">Quản lý người dùng</Link>,
    },
    {
      key: "/categories",
      icon: <AppstoreOutlined />,
      label: <Link to="/categories">Quản lý danh mục</Link>,
    },
    {
      key: "/revenue",
      icon: <BarChartOutlined />,
      label: <Link to="/revenue">Quản lý doanh thu</Link>,
    },
    {
      key: "/pending-courses",
      icon: <CheckCircleOutlined />,
      label: (
        <Link to="/pending-courses" className="flex  items-center w-full">
          <span>Phê duyệt khóa học</span>
          {pendingCoursesCount > 0 && (
            <Badge
              count={pendingCoursesCount}
              style={{ backgroundColor: "#ff4d4f", boxShadow: "none" }}
              offset={[10, 0]}
            />
          )}
        </Link>
      ),
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
        <div className="h-16 flex items-center justify-center border-b border-slate-700/50 transition-all duration-300">
          <Link to="/" className="flex items-center gap-3 overflow-hidden px-4">
            <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white font-bold shrink-0">
              H
            </div>
            {!collapsed && (
              <span className="text-white font-bold text-xl tracking-wide whitespace-nowrap">
                HUST LMS
              </span>
            )}
          </Link>
        </div>

        <div className="py-4">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
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
              className="text-lg w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center"
            />
          </div>

          <div className="flex items-center gap-4 cursor-pointer">
            <Dropdown
              menu={userMenu}
              placement="bottomRight"
              arrow
              trigger={["click"]}
            >
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors">
                <Avatar
                  style={{ backgroundColor: colorPrimary }}
                  icon={<UserOutlined />}
                />
                <div className="hidden md:flex flex-col leading-tight">
                  <Text strong className="text-slate-800">
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
          className="m-6 p-6 min-h-[280px]"
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
