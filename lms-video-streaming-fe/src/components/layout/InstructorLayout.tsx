import { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Badge,
  Button,
  Dropdown,
  Spin,
  message,
} from "antd";
import {
  DashboardOutlined,
  VideoCameraOutlined,
  TeamOutlined,
  BarChartOutlined,
  WalletOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.store";
import { authService } from "../../services/auth.service";
import { useInstructorStore } from "../../store/useInstructorStore.store";

const { Header, Sider, Content } = Layout;

const InstructorLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();

  const {
    instructorInfo,
    isLoading,
    isInitialized,
    fetchInstructorInfo,
    reset,
  } = useInstructorStore();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchInstructorInfo();
  }, [fetchInstructorInfo]);

  useEffect(() => {
    if (!isLoading && isInitialized) {
      if (!instructorInfo && location.pathname !== "/instructor/settings") {
        message.warning("Vui lòng cập nhật thông tin giảng viên để tiếp tục.");
        navigate("/instructor/settings", { replace: true });
      }
    }
  }, [isLoading, isInitialized, instructorInfo, location.pathname, navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      reset();
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const menuItems = [
    {
      key: "/instructor/dashboard",
      icon: <DashboardOutlined />,
      label: "Tổng quan",
    },
    {
      key: "/instructor/courses",
      icon: <VideoCameraOutlined />,
      label: "Quản lý khóa học",
    },
    { key: "/instructor/students", icon: <TeamOutlined />, label: "Học viên" },
    {
      key: "/instructor/analytics",
      icon: <BarChartOutlined />,
      label: "Phân tích",
    },
    {
      key: "/instructor/earnings",
      icon: <WalletOutlined />,
      label: "Doanh thu",
    },
    {
      key: "/instructor/settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
  ];

  const userDropdownItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ cá nhân",
      onClick: () => navigate("/user/info"),
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: handleLogout,
    },
  ];

  if (isLoading && !isInitialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" tip="Đang tải thông tin giảng viên..." />
      </div>
    );
  }

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="bg-white border-r border-gray-200 shadow-sm fixed left-0 h-full z-20"
        width={250}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          {!collapsed ? (
            <span className="text-xl font-extrabold text-blue-600 tracking-tighter">
              HUST <span className="text-gray-800">INSTRUCTOR</span>
            </span>
          ) : (
            <span className="text-xl font-bold text-blue-600">H</span>
          )}
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={menuItems.map((item) => ({
            ...item,
            onClick: () => navigate(item.key),
          }))}
          className="border-none mt-4 text-base font-medium"
        />
      </Sider>

      <Layout
        className={`transition-all duration-200 bg-gray-50 ${
          collapsed ? "ml-[80px]" : "ml-[250px]"
        }`}
      >
        <Header className="bg-white p-0 h-16 flex items-center justify-between px-6 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
            />
            <h2 className="text-lg font-semibold text-gray-700 m-0 hidden md:block">
              Bảng điều khiển
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="hidden md:flex items-center bg-blue-600 font-medium shadow-md shadow-blue-200 hover:bg-blue-500 border-none h-9"
              onClick={() => navigate("/instructor/courses/create")}
            >
              Tạo khóa học
            </Button>

            <Badge count={3} size="small" offset={[-4, 4]}>
              <Button
                type="text"
                icon={<BellOutlined className="text-xl text-gray-600" />}
                shape="circle"
                className="hover:bg-gray-100"
              />
            </Badge>

            <Dropdown
              menu={{ items: userDropdownItems }}
              trigger={["click"]}
              placement="bottomRight"
              arrow
            >
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 px-3 rounded-full transition-all border border-transparent hover:border-gray-200">
                <Avatar
                  src={user?.avatarUrl}
                  className="bg-blue-100 text-blue-600 font-bold"
                  size="default"
                >
                  {user?.fullName?.charAt(0).toUpperCase()}
                </Avatar>
                <div className="hidden md:block leading-tight text-left">
                  <div className="font-bold text-sm text-gray-700">
                    {user?.fullName}
                  </div>
                  <div className="text-xs text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                    Giảng viên
                  </div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="m-6 min-h-[calc(100vh-64px-48px)]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default InstructorLayout;
