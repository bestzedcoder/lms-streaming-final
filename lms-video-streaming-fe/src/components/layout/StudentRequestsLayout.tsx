import React from "react";
import { Menu } from "antd";
import { AlertOutlined, IdcardOutlined } from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const StudentRequestsLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentKey = location.pathname.includes("registrations")
    ? "registrations"
    : "reports";

  const menuItems = [
    {
      key: "reports",
      icon: <AlertOutlined />,
      label: "Các yêu cầu báo cáo",
      onClick: () => navigate("/student/my-requests/reports"),
    },
    {
      key: "registrations",
      icon: <IdcardOutlined />,
      label: "Yêu cầu tham gia khóa học",
      onClick: () => navigate("/student/my-requests/registrations"),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 animate-fade-in">
      <Menu
        mode="horizontal"
        selectedKeys={[currentKey]}
        items={menuItems}
        className="
          mb-8 bg-transparent border-b border-gray-200 
          text-lg font-semibold 
          w-full flex 
          [&>.ant-menu-item]:flex-1 
          [&>.ant-menu-item]:justify-center 
          [&>.ant-menu-item]:text-center
        "
      />

      <div className="min-h-[400px]">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentRequestsLayout;
