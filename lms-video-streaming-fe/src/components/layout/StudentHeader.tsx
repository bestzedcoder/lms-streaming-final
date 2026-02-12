import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Layout,
  Button,
  Avatar,
  Dropdown,
  Badge,
  Input,
  type MenuProps,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  BellOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  BookOutlined,
  HeartOutlined,
  GlobalOutlined,
  PlayCircleOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/useAuthStore.store";
import { notify } from "../../utils/notification.utils";
import { authService } from "../../services/auth.service";
import { useInstructorStore } from "../../store/useInstructorStore.store";

const { Header } = Layout;

const StudentHeader = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { reset } = useInstructorStore();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      reset();
      notify.info("Đăng xuất", "Đăng xuất thành công!");
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const categoryItems: MenuProps["items"] = [
    { key: "cntt", label: "Công nghệ thông tin" },
    { key: "dtvt", label: "Điện tử viễn thông" },
    { key: "cokh", label: "Cơ khí & Chế tạo" },
    { key: "kinhte", label: "Kinh tế & Quản lý" },
    { key: "ngonngu", label: "Ngoại ngữ" },
  ];

  const userMenuTimestamp: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div className="flex items-center gap-3 p-1 min-w-[200px]">
          <Avatar
            src={user?.avatarUrl}
            size="large"
            icon={<UserOutlined />}
            className="bg-primary"
          />
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 text-base">
              {user?.fullName}
            </span>
            <span className="text-xs text-gray-500">{user?.email}</span>
          </div>
        </div>
      ),
      onClick: () => navigate("/user/info"),
    },
    { type: "divider" },
    { key: "learning", label: "Quá trình học tập", icon: <BookOutlined /> },
    { key: "wishlist", label: "Danh sách yêu thích", icon: <HeartOutlined /> },
    {
      key: "cart",
      label: "Giỏ hàng của tôi",
      icon: <ShoppingCartOutlined />,
      onClick: () => navigate("/student/cart"),
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      className={`fixed top-0 w-full z-50 px-4 md:px-8 h-[72px] flex items-center justify-between transition-all duration-300 bg-white
        ${isScrolled ? "shadow-md border-gray-200" : "shadow-sm border-b border-gray-100"}
      `}
    >
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <RocketOutlined className="text-white text-lg" />
          </div>
          <span className="text-2xl font-bold text-gray-800 tracking-tighter group-hover:text-primary transition-colors">
            HUST <span className="text-primary">LMS</span>
          </span>
        </Link>

        <Dropdown menu={{ items: categoryItems }} trigger={["hover"]}>
          <span className="text-sm font-medium text-gray-600 hover:text-primary cursor-pointer transition-colors hidden lg:block">
            Danh mục
          </span>
        </Dropdown>
      </div>

      <div className="hidden md:flex flex-1 max-w-xl px-8">
        <div className="w-full relative">
          <Input
            prefix={<SearchOutlined className="text-gray-400 text-lg mr-2" />}
            placeholder="Tìm kiếm khóa học, giảng viên..."
            className="rounded-full py-2.5 px-5 bg-gray-50 border-transparent hover:bg-white hover:border-primary hover:shadow-md focus:bg-white focus:border-primary focus:shadow-md transition-all text-sm font-medium h-11"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <Link
          to="/student/courses"
          className="hidden xl:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors group"
        >
          <PlayCircleOutlined className="text-lg group-hover:scale-110 transition-transform" />
          <span>Khóa học HUST</span>
        </Link>

        {isAuthenticated && user ? (
          <>
            <Tooltip title="Giỏ hàng">
              <Link
                to="/student/cart"
                className="text-gray-600 hover:text-primary transition-colors relative"
              >
                <Badge count={2} size="small" offset={[0, 0]} color="#0056D2">
                  <ShoppingCartOutlined className="text-2xl" />
                </Badge>
              </Link>
            </Tooltip>

            <Tooltip title="Vào học ngay">
              <Link
                to="/student/my-courses"
                className="hidden lg:block text-sm font-medium text-gray-600 hover:text-primary"
              >
                Vào học
              </Link>
            </Tooltip>

            {/* Notifications */}
            <Dropdown
              menu={{
                items: [{ key: "1", label: "Thông báo mới từ hệ thống" }],
              }}
              trigger={["click"]}
              placement="bottomRight"
              arrow
            >
              <Badge count={5} size="small" offset={[-2, 2]}>
                <BellOutlined className="text-xl text-gray-600 cursor-pointer hover:text-primary transition-colors" />
              </Badge>
            </Dropdown>

            {/* Avatar User */}
            <Dropdown
              menu={{ items: userMenuTimestamp }}
              trigger={["hover"]}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
            >
              <div className="cursor-pointer border-2 border-transparent hover:border-primary rounded-full transition-all p-0.5">
                <Avatar
                  src={user.avatarUrl}
                  className="bg-primary font-bold shadow-sm"
                  size="large"
                >
                  {user.fullName?.charAt(0).toUpperCase()}
                </Avatar>
              </div>
            </Dropdown>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button className="rounded-full border-gray-300 text-gray-700 font-bold hover:text-primary hover:border-primary h-10 px-6">
                Đăng nhập
              </Button>
            </Link>

            <Link to="/register">
              <Button
                type="primary"
                className="rounded-full bg-black text-white font-bold border-black hover:bg-gray-800 hover:border-gray-800 h-10 px-6 shadow-lg shadow-gray-500/20"
              >
                Đăng ký
              </Button>
            </Link>

            <Button
              icon={<GlobalOutlined />}
              className="hidden lg:flex items-center justify-center border-none text-gray-500 hover:bg-gray-100 rounded-full w-10 h-10"
            />
          </>
        )}
      </div>
    </Header>
  );
};

export default StudentHeader;
