import { App as AntdApp, ConfigProvider } from "antd";
import AppRouter from "./routes/AppRouter.routes";
import GlobalNotification from "./components/common/GlobalNotification";
import "antd/dist/reset.css";

function App() {
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
        <AppRouter />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
