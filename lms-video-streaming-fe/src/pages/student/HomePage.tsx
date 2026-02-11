import { Button } from "antd";
import { useAuthStore } from "../../store/useAuthStore.store";
import { useNavigate } from "react-router-dom";
import { notify } from "../../utils/notification.utils";

const HomePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    notify.info("Đã đăng xuất", "Hẹn gặp lại bạn!");
    navigate("/login");
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-primary mb-4">
        Trang chủ Học viên
      </h1>

      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-md inline-block">
          <img
            src={user.avatarUrl || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="w-20 h-20 rounded-full mx-auto mb-4"
          />
          <p className="text-xl">
            Xin chào, <strong>{user.fullName}</strong>
          </p>
          <p className="text-gray-500 mb-4">
            {user.email} - ({user.role})
          </p>

          <Button danger onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      ) : (
        <p>Bạn chưa đăng nhập (Lỗi logic nếu vào được đây)</p>
      )}
    </div>
  );
};

export default HomePage;
