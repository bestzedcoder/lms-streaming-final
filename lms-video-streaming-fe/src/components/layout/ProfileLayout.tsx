import { Layout, Menu, Avatar, Typography } from "antd";
import {
  UserOutlined,
  CameraOutlined,
  ProfileOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.store";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const ProfileLayout = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const getSelectedKey = () => {
    if (location.pathname.includes("/edit-photo")) return "photo";
    if (location.pathname.includes("/edit-profile")) return "edit";
    if (location.pathname.includes("/security")) return "security";
    return "info";
  };

  const menuItems = [
    {
      key: "info",
      icon: <ProfileOutlined />,
      label: <Link to="/user/info">Hồ sơ công khai</Link>,
    },
    {
      key: "edit",
      icon: <UserOutlined />,
      label: <Link to="/user/edit-profile">Chỉnh sửa hồ sơ</Link>,
    },
    {
      key: "photo",
      icon: <CameraOutlined />,
      label: <Link to="/user/edit-photo">Ảnh đại diện</Link>,
    },
    {
      key: "security",
      icon: <SafetyCertificateOutlined />,
      label: <Link to="/user/security">Bảo mật & Mật khẩu</Link>,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
      <div className="w-full max-w-6xl">
        <Layout className="bg-white shadow-lg rounded-xl overflow-hidden min-h-[600px]">
          <Sider
            width={280}
            className="bg-white border-r border-gray-100"
            breakpoint="md"
            collapsedWidth="0"
          >
            <div className="p-8 text-center border-b border-gray-100">
              <Avatar
                size={80}
                src={user?.avatarUrl}
                className="mb-4 bg-primary font-bold text-2xl shadow-md border-4 border-white"
              >
                {user?.fullName?.charAt(0).toUpperCase()}
              </Avatar>
              <Title level={5} className="m-0 truncate">
                {user?.fullName}
              </Title>
              <Text type="secondary" className="text-xs">
                {user?.email}
              </Text>
            </div>

            <Menu
              mode="inline"
              selectedKeys={[getSelectedKey()]}
              items={menuItems}
              className="border-none py-4"
              itemIcon={<span className="text-lg" />}
              style={{ fontSize: "15px" }}
            />
          </Sider>

          <Content className="p-8 md:p-12 bg-white">
            <div className="max-w-3xl mx-auto animate-fade-in-up">
              <Outlet />
            </div>
          </Content>
        </Layout>
      </div>
    </div>
  );
};

export default ProfileLayout;
