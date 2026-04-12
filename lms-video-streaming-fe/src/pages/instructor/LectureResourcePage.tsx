import { CloudUploadOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useState } from "react";
import LectureList from "./resource/LectureList";
import LectureUploader from "./resource/LectureUploader";
import { Card, Tabs, Typography } from "antd";

const { Title, Text } = Typography;

const LectureResourcePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");

  const tabItems = [
    {
      key: "list",
      label: (
        <span className="flex items-center gap-2 px-4 text-base font-medium">
          <UnorderedListOutlined /> Danh sách Lecture
        </span>
      ),
      children: <LectureList />,
    },
    {
      key: "upload",
      label: (
        <span className="flex items-center gap-2 px-4 text-base font-medium">
          <CloudUploadOutlined /> Tải lên Lecture mới
        </span>
      ),
      children: <LectureUploader />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Title level={3} className="!m-0 text-gray-800">
          Kho Lectures
        </Title>
        <Text type="secondary">
          Quản lý và tải lên các tài nguyên dùng cho khóa học
        </Text>
      </div>

      <Card
        bordered={false}
        className="shadow-sm rounded-xl overflow-hidden"
        bodyStyle={{ padding: "0 24px 24px 24px" }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
          destroyInactiveTabPane={false}
        />
      </Card>
    </div>
  );
};

export default LectureResourcePage;
