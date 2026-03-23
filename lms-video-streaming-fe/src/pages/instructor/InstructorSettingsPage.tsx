import { useEffect, useState } from "react";
import { Form, Input, Button, Card, Typography, Row, Col } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { instructorService } from "../../services/instructor.service";
import { notify } from "../../utils/notification.utils";
import { useInstructorStore } from "../../store/useInstructorStore.store";

const { Title, Text } = Typography;
const { TextArea } = Input;

const InstructorSettingsPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { instructorInfo, setInstructorInfo } = useInstructorStore();

  useEffect(() => {
    if (instructorInfo) {
      form.setFieldsValue({
        nickname: instructorInfo.nickname,
        jobTitle: instructorInfo.jobTitle,
        bio: instructorInfo.bio,
      });
    } else {
      form.resetFields();
    }
  }, [instructorInfo, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        nickname: values.nickname,
        jobTitle: values.jobTitle,
        bio: values.bio,
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
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <Title level={2}>Thiết lập hồ sơ giảng viên</Title>
        <Text type="secondary">
          Thông tin này giúp học viên nhận diện và tin tưởng bạn hơn.
        </Text>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} size="large">
        <Card className="shadow-sm rounded-xl mb-6" bordered={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span className="font-semibold">Biệt danh</span>}
                name="nickname"
                rules={[{ required: true, message: "Vui lòng nhập biệt danh" }]}
              >
                <Input placeholder="VD: Huy Code Dạo" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-semibold">Chức danh chuyên môn</span>
                }
                name="jobTitle"
                rules={[{ required: true, message: "Vui lòng nhập chức danh" }]}
              >
                <Input placeholder="VD: Senior Frontend Developer" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={
              <span className="font-semibold">Giới thiệu bản thân (Bio)</span>
            }
            name="bio"
            rules={[
              { required: true, message: "Vui lòng nhập giới thiệu" },
              { min: 50, message: "Tối thiểu 50 ký tự" },
            ]}
          >
            <TextArea
              rows={6}
              showCount
              maxLength={2000}
              placeholder="Chia sẻ về kinh nghiệm giảng dạy của bạn..."
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            block
            className="h-12 text-lg font-bold mt-4"
          >
            Lưu thông tin giảng viên
          </Button>
        </Card>
      </Form>
    </div>
  );
};

export default InstructorSettingsPage;
