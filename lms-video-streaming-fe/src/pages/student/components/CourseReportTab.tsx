import React, { useState } from "react";
import { Form, Input, Button, Alert, Card, Typography, message } from "antd";
import {
  WarningOutlined,
  SendOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { studentService } from "../../../services/student.service";
import type { InstructorAndCourseRequest } from "../../../@types/student.types";

const { Title, Text } = Typography;

type Props = {
  slug: string;
};

const CourseReportTab: React.FC<Props> = ({ slug }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { message: string }) => {
    setLoading(true);
    const payload: InstructorAndCourseRequest = {
      message: values.message,
    };

    try {
      await studentService.courseRequest(payload, slug);
      message.success("Báo cáo của bạn đã được gửi tới đội ngũ quản trị.");
      form.resetFields();
    } catch (error) {
      message.error("Gửi báo cáo thất bại. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      <Card className="rounded-3xl shadow-sm border-gray-100 overflow-hidden">
        {/* Banner cảnh báo */}
        <div className="bg-red-50 p-6 border-b border-red-100 mb-8 flex items-start gap-4">
          <WarningOutlined className="text-red-500 text-2xl mt-1" />
          <div>
            <Title level={4} className="!text-red-700 !mb-1">
              Báo cáo vi phạm khóa học
            </Title>
            <Text className="text-red-600/80">
              Sự an toàn và chất lượng nội dung là ưu tiên hàng đầu. Nếu bạn
              phát hiện khóa học này vi phạm bản quyền, chứa nội dung độc hại
              hoặc lừa đảo, hãy cho chúng tôi biết.
            </Text>
          </div>
        </div>

        <div className="px-4">
          <Alert
            className="mb-8 rounded-xl border-blue-100 bg-blue-50"
            message={
              <Text className="text-blue-700 text-sm">
                Đội ngũ Admin sẽ xem xét báo cáo của bạn trong vòng 24h - 48h
                làm việc.
              </Text>
            }
            type="info"
            showIcon
            icon={<InfoCircleOutlined className="text-blue-500" />}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label={
                <Text strong className="text-gray-700">
                  Chi tiết nội dung báo cáo
                </Text>
              }
              name="message"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập nội dung bạn muốn báo cáo",
                },
                {
                  min: 10,
                  message: "Nội dung báo cáo quá ngắn (tối thiểu 10 ký tự)",
                },
              ]}
            >
              <Input.TextArea
                rows={6}
                placeholder="Mô tả cụ thể vấn đề bạn gặp phải (ví dụ: Video bài 3 bị lỗi bản quyền, Giảng viên dùng ngôn từ không phù hợp...)"
                className="rounded-2xl p-4 border-gray-200 hover:border-red-300 focus:border-red-400 focus:shadow-[0_0_0_2px_rgba(255,77,79,0.1)] transition-all"
              />
            </Form.Item>

            <div className="flex flex-col gap-4 mt-8 pb-4">
              <Button
                type="primary"
                danger
                size="large"
                htmlType="submit"
                loading={loading}
                icon={<SendOutlined />}
                className="h-12 rounded-xl font-bold text-lg shadow-lg shadow-red-100 border-none"
              >
                Gửi báo cáo ngay
              </Button>
              <Text type="secondary" className="text-center text-xs italic">
                Bằng việc gửi báo cáo, bạn cam kết các thông tin cung cấp là
                đúng sự thật.
              </Text>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default CourseReportTab;
