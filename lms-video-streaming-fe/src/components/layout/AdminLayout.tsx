import { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Badge, Button, Dropdown, theme } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  ReadOutlined,
  BankOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.store";
import { authService } from "../../services/auth.service";
import { adminService } from "../../services/admin.service";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        await adminService.checkAuth();
      } catch (error) {
        console.error("Admin verification failed:", error);
      }
    };
    verifyAdminAccess();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/admin/users",
      icon: <TeamOutlined />,
      label: "Quản lý người dùng",
    },
    {
      key: "/admin/categories",
      icon: <AppstoreOutlined />,
      label: "Quản lý danh mục",
    },
    {
      key: "/admin/courses",
      icon: <ReadOutlined />,
      label: "Quản lý khóa học",
    },
    {
      key: "/admin/finance",
      icon: <BankOutlined />,
      label: "Tài chính & Doanh thu",
    },
    {
      key: "/admin/reports",
      icon: <FileTextOutlined />,
      label: "Báo cáo & Khiếu nại",
    },
    {
      key: "/admin/settings",
      icon: <SettingOutlined />,
      label: "Cấu hình hệ thống",
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="fixed left-0 h-full z-20 shadow-xl"
        width={260}
        theme="dark"
        style={{ background: "#001529" }}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-700/50">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <SafetyCertificateOutlined className="text-white text-lg" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold text-white tracking-wide">
                HUST <span className="text-indigo-400">ADMIN</span>
              </span>
            )}
          </Link>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={menuItems.map((item) => ({
            ...item,
            onClick: () => navigate(item.key),
          }))}
          className="mt-4 text-[15px] font-medium bg-[#001529]"
        />
      </Sider>

      <Layout
        className={`transition-all duration-300 ${collapsed ? "ml-[80px]" : "ml-[260px]"}`}
      >
        <Header
          style={{ background: colorBgContainer }}
          className="p-0 h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg w-10 h-10"
            />
            <h2 className="text-lg font-bold text-gray-800 m-0 hidden sm:block">
              Trung tâm quản trị
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <Badge count={5} size="small">
              <Button
                type="text"
                shape="circle"
                icon={<BellOutlined className="text-xl" />}
              />
            </Badge>

            <Dropdown
              menu={{
                items: [
                  {
                    key: "profile",
                    label: "Hồ sơ cá nhân",
                    onClick: () => navigate("/user/info"),
                  },
                  {
                    key: "logout",
                    label: "Đăng xuất",
                    danger: true,
                    icon: <LogoutOutlined />,
                    onClick: handleLogout,
                  },
                ],
              }}
            >
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 px-3 rounded-full transition-all border border-gray-100">
                <Avatar
                  src={user?.avatarUrl}
                  className="bg-indigo-600 font-bold"
                  size="default"
                >
                  {user?.fullName?.charAt(0).toUpperCase()}
                </Avatar>
                <div className="hidden md:block leading-tight text-right">
                  <div className="font-bold text-sm text-gray-700">
                    {user?.fullName}
                  </div>
                  <div className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-1.5 rounded inline-block">
                    Administrator
                  </div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="m-6 min-h-[calc(100vh-100px)]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
