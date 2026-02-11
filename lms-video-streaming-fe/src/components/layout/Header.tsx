// components/layout/Header.tsx
import { Avatar, Dropdown, MenuProps } from "antd";
import { useAuthStore } from "../../store/useAuthStore.store";

const Header = () => {
  // Lấy user từ store (Zustand tự động re-render khi user thay đổi)
  const { user, logout, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <button>Login</button>;
  }

  const items: MenuProps["items"] = [
    { key: "1", label: "Hồ sơ cá nhân" },
    { key: "2", label: "Đăng xuất", onClick: logout }, // Gọi action logout
  ];

  return (
    <div className="header">
      <span>
        Xin chào, <strong>{user.fullName}</strong>
      </span>

      <Dropdown menu={{ items }}>
        <Avatar src={user.avatarUrl}>{user.fullName.charAt(0)}</Avatar>
      </Dropdown>
    </div>
  );
};
