import { useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  Tag,
  Card,
  List,
  Button,
  Skeleton,
  Empty,
  Form,
  message,
  Modal,
  Checkbox,
} from "antd";
import {
  EditOutlined,
  CheckCircleFilled,
  BookOutlined,
  IdcardOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/useAuthStore.store";
import { useNavigate } from "react-router-dom";
import { profileService } from "../../services/profile.service";
import type { UserCourseResponse } from "../../@types/user.types";
import { studentService } from "../../services/student.service";
import TextArea from "antd/es/input/TextArea";

const { Title, Paragraph, Text } = Typography;

const InfoPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<UserCourseResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        const res = await profileService.getCourseMe();
        if (res.data) {
          setCourses(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  // Xử lý submit form xin quyền
  const handleRequestInstructor = async (values: { message?: string }) => {
    try {
      setSubmitting(true);
      await studentService.instructorRequest({ message: values.message });
      message.success("Đã gửi yêu cầu cấp quyền giảng viên thành công!");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      console.error("Failed to request instructor:", error);
      message.error(
        error.message || "Gửi yêu cầu thất bại. Vui lòng thử lại sau.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <div>
          <Title level={2}>Hồ sơ công khai</Title>
          <Paragraph type="secondary">
            Thông tin hiển thị cho giảng viên và học viên khác.
          </Paragraph>
        </div>
        <Button
          icon={<EditOutlined />}
          onClick={() => navigate("/user/edit-profile")}
        >
          Sửa
        </Button>
      </div>

      <div className="border rounded-xl p-8 bg-gray-50 text-center mb-8 shadow-sm">
        <Avatar
          size={100}
          src={user?.avatarUrl}
          icon={<BookOutlined />}
          className="mb-4 border-4 border-white shadow-md bg-blue-500"
        >
          {user?.fullName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Title level={3} style={{ marginBottom: 5 }}>
          {user?.fullName}
        </Title>
        <div className="flex justify-center gap-2 mb-4">
          <Tag color="blue" className="uppercase font-bold">
            {user?.role}
          </Tag>
          {user?.updateProfile && (
            <Tag color="success" icon={<CheckCircleFilled />}>
              Đã xác minh
            </Tag>
          )}
        </div>
        <p className="text-gray-500 max-w-lg mx-auto italic">
          "Học tập không bao giờ là quá muộn. Hãy đam mê và theo đuổi sự nghiệp
          lập trình."
        </p>

        {user?.role === "STUDENT" && ( // Thay đổi điều kiện role này cho phù hợp với logic của bạn
          <Button
            type="dashed"
            icon={<IdcardOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Đăng ký trở thành Giảng viên
          </Button>
        )}
      </div>

      <Title level={4}>
        Khóa học đã tham gia{" "}
        <span className="text-gray-400 text-sm font-normal">
          ({courses.length})
        </span>
      </Title>

      {loading ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, lg: 2 }}
          dataSource={[1, 2, 3, 4]}
          renderItem={() => (
            <List.Item>
              <Card>
                <Skeleton loading={true} avatar active>
                  <Card.Meta
                    title="Card title"
                    description="This is the description"
                  />
                </Skeleton>
              </Card>
            </List.Item>
          )}
        />
      ) : courses.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, lg: 2 }}
          dataSource={courses}
          renderItem={(item) => (
            <List.Item className="h-full pb-4">
              <Card
                hoverable
                className="rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md h-full"
                bodyStyle={{ padding: 16, height: "100%" }}
                onClick={() => navigate(`/student/courses/${item.slug}`)}
              >
                <div className="flex gap-4 items-start h-full">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={
                        item.thumbnail ||
                        "https://placehold.co/150?text=No+Image"
                      }
                      className="w-full h-full rounded-lg object-cover border border-gray-100"
                      alt={item.title}
                    />
                  </div>

                  <div className="flex flex-col flex-1 h-full min-h-[6rem]">
                    <div>
                      <h4 className="font-bold text-gray-800 m-0 text-base line-clamp-2 mb-1">
                        {item.title}
                      </h4>
                      <Text type="secondary" className="text-sm line-clamp-1">
                        {item.descriptionShort}
                      </Text>
                    </div>
                    <div className="mt-auto pt-3 flex items-end justify-between">
                      <Tag
                        color="processing"
                        className="m-0 text-xs px-2 py-0.5 rounded"
                      >
                        Đã sở hữu
                      </Tag>
                      <Tag color={item.status === "ACTIVE" ? "green" : "red"}>
                        {item.status}
                      </Tag>
                    </div>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty
          description="Bạn chưa đăng ký khóa học nào."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button
            type="primary"
            onClick={() => navigate("/student/courses/search")}
          >
            Khám phá ngay
          </Button>
        </Empty>
      )}

      <Modal
        title="Đăng ký trở thành Giảng viên"
        open={isModalOpen}
        onCancel={handleCancelModal}
        footer={null}
        destroyOnClose
        width={600} // Mở rộng Modal một chút để chứa phần điều khoản cho đẹp
      >
        <div className="mb-4 text-gray-600">
          Hãy cho chúng tôi biết lý do bạn muốn trở thành giảng viên. Đội ngũ
          quản trị sẽ xem xét hồ sơ và liên hệ lại với bạn.
        </div>

        <Form form={form} layout="vertical" onFinish={handleRequestInstructor}>
          <Form.Item
            name="message"
            label="Lời nhắn giới thiệu (Tùy chọn)"
            rules={[
              {
                max: 500,
                message: "Lời nhắn không được vượt quá 500 ký tự",
              },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="Nhập thông tin giới thiệu bản thân, chuyên môn, kinh nghiệm giảng dạy của bạn..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-5 text-sm text-gray-700">
            <div className="font-bold text-orange-600 mb-2 flex items-center gap-2">
              <WarningOutlined />
              Quy định dành cho Giảng viên
            </div>
            <ul className="list-disc pl-5 space-y-1 mb-0">
              <li>
                Cam kết chỉ cung cấp nội dung học tập chất lượng, hữu ích và có
                bản quyền hợp lệ.
              </li>
              <li>
                <strong>Tuyệt đối nghiêm cấm</strong> việc đăng tải nội dung đồi
                trụy, bạo lực, phản động hoặc vi phạm pháp luật Việt Nam.
              </li>
              <li>
                Nền tảng có quyền khóa tài khoản vĩnh viễn và gỡ bỏ khóa học
                ngay lập tức nếu phát hiện vi phạm mà không cần báo trước.
              </li>
              <li>
                Tuân thủ mọi Quy tắc cộng đồng và Điều khoản dịch vụ của hệ
                thống.
              </li>
            </ul>
          </div>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          "Bạn phải đồng ý với các điều khoản để tiếp tục!",
                        ),
                      ),
              },
            ]}
          >
            <Checkbox className="font-medium text-gray-800">
              Tôi đã đọc, hiểu và cam kết tuân thủ các quy định trên.
            </Checkbox>
          </Form.Item>

          <Form.Item className="mb-0 mt-6 text-right">
            <Button onClick={handleCancelModal} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Gửi yêu cầu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InfoPage;
