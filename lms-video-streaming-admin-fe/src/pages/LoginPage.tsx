import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res: any = await axiosClient.post("/admin/login", values);
      message.success("Đăng nhập thành công!");
      login(res.data);
    } catch (error) {
      message.error("Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-4">
            <UserOutlined className="text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            HUST LMS
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Đăng nhập hệ thống quản trị
          </p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          className="space-y-4"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập Email!" },
              { type: "email", message: "Email không đúng định dạng!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-slate-400 mr-2" />}
              placeholder="admin@hust.edu.vn"
              className="rounded-xl px-4 py-3 hover:border-blue-400 focus:border-blue-500 bg-slate-50 hover:bg-white"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập Mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-slate-400 mr-2" />}
              placeholder="••••••••"
              className="rounded-xl px-4 py-3 hover:border-blue-400 focus:border-blue-500 bg-slate-50 hover:bg-white"
            />
          </Form.Item>

          <Form.Item className="mt-8 mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-base shadow-lg shadow-blue-600/20 border-0"
            >
              ĐĂNG NHẬP
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-8 text-center text-sm text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} HUST LMS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
