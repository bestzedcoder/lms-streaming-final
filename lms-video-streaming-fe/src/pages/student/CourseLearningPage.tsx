import React, { useState } from "react";
import { Tabs, Layout, Button } from "antd";
import {
  BookOutlined,
  TrophyOutlined,
  MessageOutlined,
  WarningOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom"; // Giả sử bạn dùng react-router
import CourseCurriculumTab from "./components/CourseCurriculumTab";
import LearningResultsTab from "./components/LearningResultsTab";
import CourseDiscussionTab from "./components/CourseDiscussionTab";
import CourseReportTab from "./components/CourseReportTab";

const { Content } = Layout;

const CourseLearningPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <BookOutlined /> Nội dung khóa học
        </span>
      ),
      children: <CourseCurriculumTab slug={slug!} />,
    },
    {
      key: "2",
      label: (
        <span>
          <TrophyOutlined /> Kết quả học tập
        </span>
      ),
      children: <LearningResultsTab slug={slug!} />,
    },
    {
      key: "3",
      label: (
        <span>
          <MessageOutlined /> Thảo luận & Đánh giá
        </span>
      ),
      children: <CourseDiscussionTab slug={slug!} />,
    },
    {
      key: "4",
      label: (
        <span className="text-red-500">
          <WarningOutlined /> Báo cáo vi phạm
        </span>
      ),
      children: <CourseReportTab slug={slug!} />,
    },
  ];

  return (
    <Layout className="min-h-screen bg-white">
      <Content className="max-w-7xl mx-auto w-full p-6">
        <div className="flex justify-end items-start">
          <Button
            type="default"
            size="large"
            icon={
              <ArrowLeftOutlined className="group-hover:-translate-x-1 transition-transform" />
            }
            onClick={() => navigate("/student/my-courses")}
            className="
                group
                flex items-center 
                h-11 px-6 
                rounded-xl 
                font-semibold 
                text-gray-600 
                border-gray-300
                shadow-sm 
                hover:text-blue-600 
                hover:border-blue-400 
                hover:bg-blue-50/50
                transition-all 
                duration-300
            "
          >
            Trở lại các khóa học của bạn
          </Button>
        </div>

        <Tabs
          defaultActiveKey="1"
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          size="large"
          items={tabItems}
          className="custom-learning-tabs p-2 rounded-xl"
        />
      </Content>
    </Layout>
  );
};

export default CourseLearningPage;
