import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Avatar,
  Typography,
  Modal,
  message,
  Input,
  Form,
  Card,
  Divider,
  Descriptions,
  Tooltip,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  SearchOutlined,
  ReloadOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { instructorService } from "../../services/instructor.service";
import { useInstructorStore } from "../../store/useInstructorStore.store";
import type {
  RegistrationProcessingRequest,
  RegistrationResponse,
} from "../../@types/instructor.types";

const { Text, Title } = Typography;
const { TextArea } = Input;

const PendingRegistrationsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<RegistrationResponse[]>(
    [],
  );
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<{
    id: string;
    type: "APPROVE" | "REJECT";
  } | null>(null);

  const [form] = Form.useForm();
  const { decrementPending } = useInstructorStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await instructorService.getPendingRegistrations();
      setRegistrations(res.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách yêu cầu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hàm xử lý duyệt/từ chối
  const handleConfirmAction = async () => {
    if (!currentAction) return;
    try {
      const values = await form.validateFields();
      const payload: RegistrationProcessingRequest = {
        registrationId: currentAction.id,
        message: values.message,
      };

      setLoading(true);
      if (currentAction.type === "APPROVE") {
        await instructorService.approveRegistration(payload);
        message.success("Đã phê duyệt thành công!");
      } else {
        await instructorService.rejectRegistration(payload);
        message.warning("Đã từ chối yêu cầu.");
      }

      setRegistrations((prev) =>
        prev.filter((item) => item.id !== currentAction.id),
      );
      decrementPending();
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm hiển thị Modal chi tiết
  const showDetailModal = (title: string, content: React.ReactNode) => {
    Modal.info({
      title,
      width: 600,
      maskClosable: true,
      content: <div className="mt-4">{content}</div>,
    });
  };

  // Lọc danh sách theo email thủ công từ thanh search
  const filteredData = registrations.filter(
    (item) =>
      item.student.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.student.fullName.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns = [
    {
      title: "Học viên",
      key: "student",
      render: (record: RegistrationResponse) => (
        <Space>
          <Avatar
            src={record.student.avatarUrl}
            icon={<UserOutlined />}
            className="border border-blue-100"
          />
          <div className="flex flex-col">
            <Text strong>{record.student.fullName}</Text>
            <Text type="secondary" className="text-xs">
              {record.student.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Khóa học",
      key: "course",
      render: (record: RegistrationResponse) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.course.title}</Text>
          <Tag color="processing">Chờ phê duyệt</Tag>
        </Space>
      ),
    },
    {
      title: "Thông tin chi tiết",
      key: "view",
      render: (record: RegistrationResponse) => (
        <Space split={<Divider type="vertical" />}>
          <Button
            type="link"
            size="small"
            icon={<UserOutlined />}
            onClick={() =>
              showDetailModal(
                "Thông tin học viên",
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Họ tên">
                    {record.student.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {record.student.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {record.student.phone || "N/A"}
                  </Descriptions.Item>
                </Descriptions>,
              )
            }
          >
            Học viên
          </Button>
          <Button
            type="link"
            size="small"
            icon={<BookOutlined />}
            onClick={() =>
              showDetailModal(
                "Thông tin khóa học",
                <div className="flex gap-4">
                  <img
                    src={record.course.thumbnail}
                    alt="thumb"
                    className="w-32 h-20 object-cover rounded shadow"
                  />
                  <div>
                    <Title level={5}>{record.course.title}</Title>
                    <Tag color="blue">{record.course.status}</Tag>
                  </div>
                </div>,
              )
            }
          >
            Khóa học
          </Button>
        </Space>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "right" as const,
      render: (record: RegistrationResponse) => (
        <Space>
          <Tooltip title="Chấp nhận">
            <Button
              type="primary"
              shape="circle"
              icon={<CheckOutlined />}
              className="bg-green-600 hover:bg-green-500 border-none"
              onClick={() =>
                setCurrentAction({ id: record.id, type: "APPROVE" }) ||
                openActionModal(record.id, "APPROVE")
              }
            />
          </Tooltip>
          <Tooltip title="Từ chối">
            <Button
              danger
              shape="circle"
              icon={<CloseOutlined />}
              onClick={() => openActionModal(record.id, "REJECT")}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const openActionModal = (id: string, type: "APPROVE" | "REJECT") => {
    setCurrentAction({ id, type });
    const defaultMsg =
      type === "APPROVE"
        ? "Chúc mừng! Yêu cầu tham gia khóa học của bạn đã được phê duyệt."
        : "Rất tiếc, yêu cầu đăng ký của bạn không được chấp nhận.";
    form.setFieldsValue({ message: defaultMsg });
    setIsModalOpen(true);
  };

  return (
    <Card className="shadow-md border-none rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Title level={3} className="!mb-1">
            Phê duyệt đăng ký
          </Title>
          <Text type="secondary">
            Quản lý danh sách học viên đăng ký khóa học
          </Text>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Tìm theo email hoặc tên..."
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-xs rounded-lg"
            allowClear
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchData}
            loading={loading}
          />
        </div>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        className="border border-gray-50 rounded-lg"
      />

      <Modal
        title={
          currentAction?.type === "APPROVE"
            ? "Xác nhận Phê duyệt"
            : "Xác nhận Từ chối"
        }
        open={isModalOpen}
        onOk={handleConfirmAction}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={loading}
        okText="Gửi thông báo"
        okButtonProps={{ danger: currentAction?.type === "REJECT" }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="message"
            label="Lời nhắn gửi học viên"
            rules={[{ required: true, message: "Vui lòng nhập lời nhắn!" }]}
          >
            <TextArea rows={4} showCount maxLength={500} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default PendingRegistrationsPage;
