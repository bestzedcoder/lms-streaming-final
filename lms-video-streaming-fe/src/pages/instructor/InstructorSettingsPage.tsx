import { useEffect, useState } from "react";
import { Form, Input, Button, Card, Alert, Typography, Row, Col } from "antd";
import {
  SaveOutlined,
  UserOutlined,
  GlobalOutlined,
  LinkedinOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { instructorService } from "../../services/instructor.service";
import { notify } from "../../utils/notification.utils";
import { useInstructorStore } from "../../store/useInstructorStore.store";

const { Title, Text } = Typography;
const { TextArea } = Input;

const InstructorSettingsPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { instructorInfo, setInstructorInfo } = useInstructorStore();
  const [isNewInstructor, setIsNewInstructor] = useState(false);

  useEffect(() => {
    if (instructorInfo) {
      form.setFieldsValue({
        title: instructorInfo.title,
        bio: instructorInfo.bio,
        website: instructorInfo.socialLinks?.website,
        linkedin: instructorInfo.socialLinks?.linkedin,
        facebook: instructorInfo.socialLinks?.facebook,
        youtube: instructorInfo.socialLinks?.youtube,
      });
      setIsNewInstructor(false);
    } else {
      setIsNewInstructor(true);
      form.resetFields();
    }
  }, [instructorInfo, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title,
        bio: values.bio,
        socialLinks: {
          website: values.website,
          linkedin: values.linkedin,
          facebook: values.facebook,
          youtube: values.youtube,
        },
      };

      await instructorService.updateInfo(payload);

      notify.success("Thành công", "Thông tin giảng viên đã được cập nhật!");

      if (instructorInfo) {
        setInstructorInfo({ ...instructorInfo, ...payload });
      } else {
        setInstructorInfo({
          ...payload,
          totalStudents: 0,
          totalCourses: 0,
          createdAt: new Date().toString(),
          updatedAt: new Date().toString(),
        });
      }

      setIsNewInstructor(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <Title level={2}>Hồ sơ giảng viên</Title>
        <Text type="secondary">
          Quản lý thông tin hiển thị công khai trên các khóa học của bạn.
        </Text>
      </div>

      {isNewInstructor && (
        <Alert
          message="Yêu cầu hoàn tất hồ sơ"
          description="Bạn cần cập nhật Tiêu đề và Giới thiệu bản thân trước khi có thể xuất bản khóa học mới. Hãy cho học viên biết bạn là ai!"
          type="warning"
          showIcon
          icon={<InfoCircleOutlined className="text-xl" />}
          className="mb-8 border-orange-200 bg-orange-50 text-orange-800 shadow-sm"
          action={
            <Button
              size="small"
              type="primary"
              ghost
              onClick={() => form.focusField("title")}
            >
              Cập nhật ngay
            </Button>
          }
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        size="large"
        requiredMark={false}
      >
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card
              title="Thông tin cơ bản"
              className="shadow-sm rounded-xl mb-6"
              bordered={false}
            >
              <Form.Item
                label={
                  <span className="font-semibold">Tiêu đề chuyên môn</span>
                }
                name="title"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                help="Ví dụ: Senior Software Engineer tại Google, Tiến sĩ Toán học..."
              >
                <Input
                  placeholder="VD: Chuyên gia Fullstack Web Development"
                  prefix={<UserOutlined className="text-gray-400" />}
                  className={
                    isNewInstructor ? "border-orange-300 bg-orange-50/30" : ""
                  }
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="font-semibold">
                    Giới thiệu bản thân (Bio)
                  </span>
                }
                name="bio"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giới thiệu bản thân",
                  },
                  { min: 50, message: "Hãy viết ít nhất 50 ký tự về bạn." },
                ]}
                help="Tiểu sử ngắn gọn về kinh nghiệm, sở thích và phong cách giảng dạy của bạn."
              >
                <TextArea
                  rows={6}
                  placeholder="Xin chào, tôi là..."
                  showCount
                  maxLength={2000}
                  className={
                    isNewInstructor ? "border-orange-300 bg-orange-50/30" : ""
                  }
                />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title="Mạng xã hội"
              className="shadow-sm rounded-xl mb-6"
              bordered={false}
            >
              <Text type="secondary" className="text-xs block mb-4">
                Giúp học viên kết nối với bạn qua các nền tảng khác.
              </Text>

              <Form.Item name="website" label="Website cá nhân">
                <Input
                  prefix={<GlobalOutlined className="text-gray-400" />}
                  placeholder="https://mywebsite.com"
                />
              </Form.Item>

              <Form.Item name="linkedin" label="LinkedIn">
                <Input
                  prefix={<LinkedinOutlined className="text-blue-700" />}
                  placeholder="Username hoặc URL"
                />
              </Form.Item>

              <Form.Item name="youtube" label="Youtube">
                <Input
                  prefix={<YoutubeOutlined className="text-red-600" />}
                  placeholder="Channel URL"
                />
              </Form.Item>

              <Form.Item name="facebook" label="Facebook">
                <Input
                  prefix={<FacebookOutlined className="text-blue-600" />}
                  placeholder="Username"
                />
              </Form.Item>
            </Card>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              block
              className="h-12 text-lg font-bold shadow-lg shadow-blue-200"
            >
              Lưu thay đổi
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default InstructorSettingsPage;
