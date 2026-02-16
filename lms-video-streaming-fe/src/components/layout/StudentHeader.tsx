import { useState, useEffect } from "react";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import {
  Layout,
  Button,
  Avatar,
  Dropdown,
  Badge,
  Input,
  type MenuProps,
  Tooltip,
  Spin,
} from "antd";
import {
  SearchOutlined,
  BellOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  BookOutlined,
  HeartOutlined,
  RocketOutlined,
  PlayCircleOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/useAuthStore.store";
import { notify } from "../../utils/notification.utils";
import { authService } from "../../services/auth.service";
import { useInstructorStore } from "../../store/useInstructorStore.store";
import { publicService } from "../../services/public.service";
import type { CategoryPublicResponse } from "../../types/public.types";

const { Header } = Layout;

const StudentHeader = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { reset } = useInstructorStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<CategoryPublicResponse[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);

    fetchCategories();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchCategories = async () => {
    setLoadingCats(true);
    try {
      const res = await publicService.getCategories();
      if (res.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setLoadingCats(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      reset();
      notify.info("Đăng xuất", "Đăng xuất thành công!");
      navigate("/login");
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const handleSearch = (value: string) => {
    if (!value.trim()) return;
    navigate({
      pathname: "/student/courses/search",
      search: `?${createSearchParams({ q: value.trim() })}`,
    });
  };

  const handleCategoryClick = (slug: string) => {
    navigate({
      pathname: "/student/courses/search",
      search: `?${createSearchParams({ category: slug })}`,
    });
  };

  const categoryMenuItems: MenuProps["items"] = loadingCats
    ? [
        {
          key: "loading",
          label: (
            <div className="p-2 text-center">
              <Spin size="small" />
            </div>
          ),
          disabled: true,
        },
      ]
    : [
        ...categories.map((cat) => ({
          key: cat.slug,
          label: cat.name,
          icon: <AppstoreOutlined />,
          onClick: () => handleCategoryClick(cat.slug),
        })),
        { type: "divider" },
        {
          key: "all",
          label: "Tất cả khóa học",
          icon: <PlayCircleOutlined />,
          onClick: () => navigate("/courses/search"),
        },
      ];

  const userMenu: MenuProps["items"] = [
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
    {
      key: "learning",
      label: "Quá trình học tập",
      icon: <BookOutlined />,
      onClick: () => navigate("/student/my-courses"),
    },
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

        <Dropdown
          menu={{
            items: categoryMenuItems,
            className: "max-h-[400px] overflow-y-auto",
          }}
          trigger={["hover"]}
          placement="bottomLeft"
        >
          <div className="items-center gap-2 cursor-pointer py-2 px-3 rounded-md hover:bg-gray-50 transition-colors hidden lg:flex">
            <AppstoreOutlined className="text-gray-500" />
            <span className="text-sm font-medium text-gray-600 hover:text-primary">
              Danh mục
            </span>
          </div>
        </Dropdown>
      </div>

      <div className="hidden md:flex flex-1 max-w-xl px-8">
        <div className="w-full relative">
          {/* Wrapper tạo viền và bo tròn */}
          <div
            className="
        group flex items-center 
        bg-white 
        border border-gray-300 
        rounded-full 
        overflow-hidden 
        transition-all duration-300
        hover:border-primary hover:shadow-sm
        focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20
    "
          >
            <Input
              placeholder="Tìm kiếm khóa học, giảng viên..."
              allowClear
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={() => handleSearch(searchValue)}
              bordered={false}
              size="large"
              className="flex-1 pl-5"
            />

            <Button
              type="primary"
              onClick={() => handleSearch(searchValue)}
              className="
          h-full 
          rounded-none 
          bg-primary border-primary 
          px-6 
          flex items-center justify-center
        "
              style={{ height: "40px" }}
            >
              <SearchOutlined className="text-lg" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <Link
          to="/courses/search"
          className="hidden xl:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors group"
        >
          <PlayCircleOutlined className="text-lg group-hover:scale-110 transition-transform" />
          <span>Khóa học</span>
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

            <Dropdown
              menu={{ items: userMenu }}
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
          </>
        )}
      </div>
    </Header>
  );
};

export default StudentHeader;
