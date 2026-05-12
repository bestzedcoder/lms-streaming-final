import React, { useEffect, useState } from "react";
import {
  List,
  Card,
  Tag,
  Typography,
  Spin,
  Empty,
  message,
  Button,
  Modal,
  Image,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MessageOutlined,
  EditOutlined,
  CalendarOutlined,
  BookOutlined,
  EyeOutlined,
  GlobalOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import type { RegistrationResponse } from "../../@types/student.types";
import { studentService } from "../../services/student.service";

const { Title, Text } = Typography;

const ANTD_FALLBACK_IMG =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";

const RegistrationCoursePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RegistrationResponse[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RegistrationResponse | null>(
    null,
  );

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        const res = await studentService.getRegistrations();
        setData(res.data || []);
      } catch (error) {
        message.error("Lỗi khi tải danh sách yêu cầu");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const openDetailsModal = (item: RegistrationResponse) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const closeDetailsModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const renderRegistrationStatus = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Tag
            icon={<CheckCircleOutlined />}
            color="success"
            className="rounded-full px-3 py-1 font-medium border-none m-0"
          >
            Đã duyệt
          </Tag>
        );
      case "REJECTED":
        return (
          <Tag
            icon={<CloseCircleOutlined />}
            color="error"
            className="rounded-full px-3 py-1 font-medium border-none m-0"
          >
            Từ chối
          </Tag>
        );
      case "PENDING":
      default:
        return (
          <Tag
            icon={<ClockCircleOutlined />}
            color="warning"
            className="rounded-full px-3 py-1 font-medium border-none m-0"
          >
            Đang chờ
          </Tag>
        );
    }
  };

  const renderCourseStatus = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="text-xs text-blue-500 font-medium flex items-center gap-1">
            <GlobalOutlined /> Công khai
          </span>
        );
      case "PRIVATE":
        return (
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
            <EyeInvisibleOutlined /> Riêng tư
          </span>
        );
      case "LOCKED":
        return (
          <span className="text-xs text-red-500 font-medium flex items-center gap-1">
            <LockOutlined /> Đã khóa
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="text-xs text-orange-500 font-medium flex items-center gap-1">
            <ClockCircleOutlined /> Chờ duyệt
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Spin tip="Đang tải dữ liệu..." size="large" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {data.length === 0 ? (
        <Empty
          description="Bạn chưa có yêu cầu tham gia khóa học nào"
          className="py-12"
        />
      ) : (
        <List
          grid={{ gutter: 24, column: 1 }}
          dataSource={data}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            className: "mt-8 text-center",
            position: "bottom",
          }}
          renderItem={(item) => (
            <List.Item className="mb-4">
              <Card
                className="rounded-2xl shadow-sm border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden"
                styles={{ body: { padding: 0 } }}
                bodyStyle={{ padding: 0 }}
              >
                <div className="flex flex-col sm:flex-row h-auto sm:h-[130px]">
                  <div className="w-full sm:w-48 h-32 sm:h-full bg-gray-100 shrink-0 relative overflow-hidden">
                    <div className="w-full h-full absolute inset-0">
                      <Image
                        src={item.course.thumbnail || "error-trigger"}
                        fallback={ANTD_FALLBACK_IMG}
                        preview={false}
                        className="w-full h-full object-cover"
                        wrapperStyle={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <Title
                        level={5}
                        className="!mb-1 text-gray-800 line-clamp-1 leading-snug pr-2"
                        title={item.course.title}
                      >
                        {item.course.title}
                      </Title>
                      {renderCourseStatus(item.course.status)}
                    </div>

                    <div className="flex justify-between items-end mt-4 sm:mt-auto pt-3 border-t border-dashed border-gray-200">
                      <div>{renderRegistrationStatus(item.status)}</div>

                      <Button
                        type="primary"
                        ghost
                        shape="round"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => openDetailsModal(item)}
                        className="hover:shadow-sm"
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
        title={
          <div className="text-lg font-bold flex items-center gap-2">
            <BookOutlined className="text-blue-500" /> Chi tiết yêu cầu tham gia
          </div>
        }
        open={isModalVisible}
        onCancel={closeDetailsModal}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={closeDetailsModal}
            className="rounded-lg"
          >
            Đóng
          </Button>,
        ]}
        centered
      >
        {selectedItem && (
          <div className="mt-4 flex flex-col gap-5">
            <div className="flex gap-4">
              <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                <Image
                  src={selectedItem.course.thumbnail || "error-trigger"}
                  fallback={ANTD_FALLBACK_IMG}
                  className="w-full h-full object-cover"
                  preview={false}
                />
              </div>
              <div>
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                  Khóa học
                </Text>
                <Text className="text-base font-semibold text-gray-800 line-clamp-1 mb-1">
                  {selectedItem.course.title}
                </Text>
                <div className="flex items-center gap-3">
                  {renderCourseStatus(selectedItem.course.status)}
                  <span className="text-gray-300">|</span>
                  {renderRegistrationStatus(selectedItem.status)}
                </div>
              </div>
            </div>

            <div>
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                Lời nhắn của bạn
              </Text>
              <div className="text-gray-600 text-sm flex gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <MessageOutlined className="mt-0.5 text-blue-400" />
                <span>
                  {selectedItem.studentMessage || "Không có lời nhắn."}
                </span>
              </div>
            </div>

            {selectedItem.status !== "PENDING" && (
              <div>
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                  Phản hồi từ Giảng viên
                </Text>
                <div
                  className={`text-sm flex gap-2 p-3 rounded-xl border ${selectedItem.status === "APPROVED" ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"}`}
                >
                  <EditOutlined className="mt-0.5" />
                  <span className="font-medium">
                    {selectedItem.teacherNote || "Không có ghi chú thêm."}
                  </span>
                </div>
              </div>
            )}

            {selectedItem.resolvedAt && (
              <div className="pt-4 border-t border-gray-100 flex items-center text-sm text-gray-500">
                <CalendarOutlined className="mr-2" />
                Thời gian xử lý:{" "}
                {new Date(selectedItem.resolvedAt).toLocaleString("vi-VN")}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RegistrationCoursePage;
