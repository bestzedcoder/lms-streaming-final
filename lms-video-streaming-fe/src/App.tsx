import { App as AntdApp, ConfigProvider, Spin } from "antd";
import AppRouter from "./routes/AppRouter.routes";
import GlobalNotification from "./components/common/GlobalNotification";
import "antd/dist/reset.css";
import { useAuthStore } from "./store/useAuthStore.store";
import { useEffect } from "react";
import { WebSocketProvider } from "./context/useWebSocket";

function App() {
  const { checkAuth, isInitialized } = useAuthStore();
  useEffect(() => {
    if (!isInitialized) {
      checkAuth();
    }
  }, [checkAuth, isInitialized]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Spin size="large" tip="Đang xác thực tài khoản..." />
      </div>
    );
  }
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0056D2",
        },
      }}
    >
      <AntdApp>
        <GlobalNotification />
        <WebSocketProvider>
          <AppRouter />
        </WebSocketProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
