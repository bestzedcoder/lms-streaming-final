import React from "react";
import { Badge, Dropdown, Typography, Button, Empty } from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  FileDoneOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Notification } from "../../@types/notification.types";
import { useNotificationStore } from "../../store/useNotification.store";

const { Text } = Typography;

type Props = {
  role: "student" | "instructor";
  pendingApprovals?: number;
};

const NotificationBell: React.FC<Props> = ({ role, pendingApprovals = 0 }) => {
  const navigate = useNavigate();
  const notifications = useNotificationStore((state) =>
    role === "student"
      ? state.studentNotifications
      : state.instructorNotifications,
  );
  const clearNotifications = useNotificationStore((state) =>
    role === "student"
      ? state.clearStudentNotifications
      : state.clearInstructorNotifications,
  );

  // Tổng số thông báo
  const totalCount = notifications.length + pendingApprovals;

  const getNotificationConfig = (type: Notification["type"]) => {
    switch (type) {
      case "TEACHER_REQUEST_APPROVED":
      case "COURSE_APPROVED":
        return {
          icon: <CheckCircleOutlined />,
          color: "text-green-600",
          bg: "bg-green-100",
        };
      case "VIDEO_APPROVED":
      case "RESOURCE_APPROVED":
      case "VIDEO_PROCESSING_SUCCESS":
        return {
          icon: <FileDoneOutlined />,
          color: "text-blue-600",
          bg: "bg-blue-100",
        };
      case "VIDEO_PROCESSING_FAILED":
      case "VIDEO_REJECTED":
      case "RESOURCE_REJECTED":
        return {
          icon: <CloseCircleOutlined />,
          color: "text-red-600",
          bg: "bg-red-100",
        };
      case "VIDEO_VALIDATION_FAILED":
      case "RESOURCE_VALIDATION_FAILED":
        return {
          icon: <WarningOutlined />,
          color: "text-orange-600",
          bg: "bg-orange-100",
        };
      default:
        return {
          icon: <BellOutlined />,
          color: "text-gray-600",
          bg: "bg-gray-100",
        };
    }
  };

  const menuRender = () => (
    <div className="w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-50 bg-slate-50/80 backdrop-blur-sm">
        <Text strong className="text-gray-800 text-base">
          Thông báo
        </Text>
        {notifications.length > 0 && (
          <Button
            type="link"
            size="small"
            onClick={clearNotifications}
            className="text-gray-500 hover:text-red-500"
          >
            Xóa tất cả
          </Button>
        )}
      </div>

      <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
        {totalCount === 0 ? (
          <Empty description="Bạn không có thông báo nào" className="py-8" />
        ) : (
          <div className="flex flex-col">
            {/* 1. MỤC CỐ ĐỊNH: Hiển thị nếu có học viên chờ duyệt */}
            {pendingApprovals > 0 && (
              <div
                className="flex items-start gap-4 p-4 border-b border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer group"
                onClick={() => navigate("/instructor/students")}
              >
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg bg-blue-100 text-blue-600 shadow-sm">
                  <TeamOutlined />
                </div>
                <div className="flex flex-col flex-1 justify-center">
                  <Text
                    strong
                    className="text-sm text-gray-800 group-hover:text-blue-600 transition-colors"
                  >
                    Học viên chờ duyệt
                  </Text>
                  <Text type="secondary" className="text-xs mt-0.5">
                    Bạn có{" "}
                    <span className="font-bold text-red-500">
                      {pendingApprovals}
                    </span>{" "}
                    yêu cầu tham gia khóa học cần phê duyệt.
                  </Text>
                </div>
              </div>
            )}

            {/* 2. DANH SÁCH THÔNG BÁO TỪ WEBSOCKET */}
            {notifications.map((notif, index) => {
              const config = getNotificationConfig(notif.type);
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 border-b border-gray-50 hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg ${config.bg} ${config.color}`}
                  >
                    {config.icon}
                  </div>
                  <div className="flex flex-col flex-1">
                    <Text
                      strong
                      className="text-sm text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1"
                    >
                      {notif.title}
                    </Text>
                    <Text
                      type="secondary"
                      className="text-xs mt-0.5 line-clamp-2"
                    >
                      {notif.content}
                    </Text>
                    <Text type="secondary" className="text-[10px] mt-1 italic">
                      {new Date(notif.createAt).toLocaleString("vi-VN")}
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Dropdown
      dropdownRender={menuRender}
      trigger={["click"]}
      placement="bottomRight"
      arrow
    >
      {/* GIỮ NGUYÊN THIẾT KẾ UI MÀ BẠN YÊU THÍCH TẠI ĐÂY */}
      <Badge count={totalCount} size="small" offset={[-4, 4]}>
        <Button
          type="text"
          icon={<BellOutlined className="text-xl text-gray-600" />}
          shape="circle"
          className="hover:bg-gray-100 w-10 h-10 flex items-center justify-center"
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;
