import { Spin } from "antd";
import { useAppStore } from "../../store/useAppStore.store";

const GlobalLoading = () => {
  const { isLoading } = useAppStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="text-center">
        <Spin size="large" />
        <p className="mt-4 text-primary font-medium animate-pulse">
          Đang xử lý...
        </p>
      </div>
    </div>
  );
};

export default GlobalLoading;
