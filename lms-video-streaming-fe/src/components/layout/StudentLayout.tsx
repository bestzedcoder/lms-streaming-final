import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import StudentHeader from "./StudentHeader";

const { Content, Footer } = Layout;

const StudentLayout = () => {
  return (
    <Layout className="min-h-screen bg-white">
      <StudentHeader />
      <Content className="pt-20">
        <Outlet />
      </Content>

      <Footer className="text-center bg-gray-50 text-gray-500 py-8">
        HUST LMS ©{new Date().getFullYear()} Created by You
      </Footer>
    </Layout>
  );
};

export default StudentLayout;
