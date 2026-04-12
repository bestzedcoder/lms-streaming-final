import { useState } from "react";
import { Card, Tabs, Typography } from "antd";
import { UnorderedListOutlined, CloudUploadOutlined } from "@ant-design/icons";
import VideoList from "./resource/VideoList";
import VideoUploader from "./resource/VideoUploader";

const { Title, Text } = Typography;

const VideoResourcePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");

  const tabItems = [
    {
      key: "list",
      label: (
        <span className="flex items-center gap-2 px-4 text-base font-medium">
          <UnorderedListOutlined /> Danh sách Video
        </span>
      ),
      children: <VideoList />,
    },
    {
      key: "upload",
      label: (
        <span className="flex items-center gap-2 px-4 text-base font-medium">
          <CloudUploadOutlined /> Tải lên Video mới
        </span>
      ),
      children: <VideoUploader />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Title level={3} className="!m-0 text-gray-800">
          Kho Videos
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

export default VideoResourcePage;
