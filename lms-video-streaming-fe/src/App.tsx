import { App as AntdApp, ConfigProvider } from "antd";
import AppRouter from "./routes/AppRouter.routes";
import GlobalNotification from "./components/common/GlobalNotification";
import "antd/dist/reset.css"; // Reset CSS của Antd

function App() {
  return (
    // 1. ConfigProvider: Cấu hình Theme (Màu xanh chủ đạo)
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0056D2", // Màu primary bạn chọn ở bài trước
        },
      }}
    >
      {/* 2. AntdApp: Cung cấp Context cho Notification/Message/Modal */}
      <AntdApp>
        {/* 3. GlobalNotification: Kích hoạt cầu nối */}
        <GlobalNotification />

        {/* 4. Router chính của bạn */}
        <AppRouter />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
