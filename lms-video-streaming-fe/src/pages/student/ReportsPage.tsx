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
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  AlertOutlined,
  FileTextOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import type { RequestResponse } from "../../@types/student.types";
import { studentService } from "../../services/student.service";

const { Title, Text } = Typography;

const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RequestResponse[]>([]);

  // State quản lý Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RequestResponse | null>(
    null,
  );

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await studentService.getRequests();
        setData(res.data || []);
      } catch (error) {
        console.error("getRequests error:", error);
        message.error("Lỗi khi tải danh sách báo cáo & yêu cầu");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const openDetailsModal = (item: RequestResponse) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const closeDetailsModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const getTypeConfig = (type: string) => {
    if (type === "TEACHER_REQUEST") {
      return {
        tagText: "Yêu cầu cấp quyền Giảng viên",
        leftBg: "bg-blue-50 border-blue-100/50",
        iconWrapper: "bg-blue-100 text-blue-500",
        icon: <IdcardOutlined className="text-2xl" />,
        modalTitle: "Chi tiết Yêu cầu",
        modalIcon: <IdcardOutlined className="text-blue-500" />,
        contentBoxBg: "bg-blue-50/50 border-blue-100",
        contentIcon: (
          <FileTextOutlined className="mt-1 text-blue-400 text-lg" />
        ),
        targetLabel: "Tiêu đề yêu cầu",
      };
    }
    return {
      tagText: "Khóa học bị báo cáo",
      leftBg: "bg-orange-50 border-orange-100/50",
      iconWrapper: "bg-orange-100 text-orange-500",
      icon: <AlertOutlined className="text-2xl" />,
      modalTitle: "Chi tiết Báo cáo",
      modalIcon: <ExclamationCircleOutlined className="text-orange-500" />,
      contentBoxBg: "bg-orange-50/50 border-orange-100",
      contentIcon: (
        <FileTextOutlined className="mt-1 text-orange-400 text-lg" />
      ),
      targetLabel: "Khóa học",
    };
  };

  const renderStatusTag = (status: boolean) => {
    if (status) {
      return (
        <Tag
          icon={<CheckCircleOutlined />}
          color="success"
          className="rounded-full px-3 py-1 font-medium border-none m-0"
        >
          Đã giải quyết
        </Tag>
      );
    }
    return (
      <Tag
        icon={<ClockCircleOutlined />}
        color="warning"
        className="rounded-full px-3 py-1 font-medium border-none m-0"
      >
        Đang xử lý
      </Tag>
    );
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Spin tip="Đang tải dữ liệu..." size="large" />
      </div>
    );
  }

  const modalConfig = selectedItem
    ? getTypeConfig(selectedItem.requestType)
    : null;

  return (
    <div className="animate-fade-in">
      {data.length === 0 ? (
        <Empty
          description="Bạn chưa gửi yêu cầu hoặc báo cáo nào"
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
          renderItem={(item) => {
            const config = getTypeConfig(item.requestType);

            return (
              <List.Item className="mb-4">
                <Card
                  className="rounded-2xl shadow-sm border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden"
                  styles={{ body: { padding: 0 } }}
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="flex flex-col sm:flex-row h-auto sm:h-[120px]">
                    <div
                      className={`w-full sm:w-32 h-24 sm:h-full flex items-center justify-center shrink-0 border-r ${config.leftBg}`}
                    >
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center ${config.iconWrapper}`}
                      >
                        {config.icon}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {config.tagText}
                          </Text>
                        </div>
                        <Title
                          level={5}
                          className="!mb-1 text-gray-800 line-clamp-1 leading-snug pr-2"
                          title={item.title}
                        >
                          {item.title}
                        </Title>
                      </div>

                      <div className="flex justify-between items-end mt-4 sm:mt-auto pt-3 border-t border-dashed border-gray-200">
                        <div>{renderStatusTag(item.status)}</div>

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
            );
          }}
        />
      )}

      <Modal
        title={
          <div className="text-lg font-bold flex items-center gap-2 text-gray-800">
            {modalConfig?.modalIcon} {modalConfig?.modalTitle}
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
        {selectedItem && modalConfig && (
          <div className="mt-4 flex flex-col gap-5">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
              <div>
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                  {modalConfig.targetLabel}
                </Text>
                <Text className="text-base font-semibold text-gray-800 line-clamp-1">
                  {selectedItem.title}
                </Text>
              </div>
              <div className="shrink-0 ml-4">
                {renderStatusTag(selectedItem.status)}
              </div>
            </div>

            <div>
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                Nội dung đính kèm
              </Text>
              <div
                className={`text-gray-700 text-sm flex items-start gap-3 p-4 rounded-xl border ${modalConfig.contentBoxBg}`}
              >
                {modalConfig.contentIcon}
                <span className="leading-relaxed">
                  {selectedItem.description}
                </span>
              </div>
            </div>

            {selectedItem.status && selectedItem.resolvedAt && (
              <div className="pt-4 border-t border-gray-100 flex items-center text-sm text-green-600 font-medium">
                <CheckCircleOutlined className="mr-2" />
                Đã được Admin xử lý vào lúc:{" "}
                {new Date(selectedItem.resolvedAt).toLocaleString("vi-VN")}
              </div>
            )}

            {!selectedItem.status && (
              <div className="pt-4 border-t border-gray-100 flex items-center text-sm text-gray-500 italic">
                <ClockCircleOutlined className="mr-2" />
                Đội ngũ quản trị đang xem xét yêu cầu của bạn.
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportsPage;
