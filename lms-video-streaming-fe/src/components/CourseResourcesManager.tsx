import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Drawer,
  List,
  message,
  Typography,
  Empty,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { instructorService } from "../services/instructor.service";
import type { InstructorLessonDetailResponse } from "../@types/instructor.types";

const { Text } = Typography;

interface Props {
  courseId: string;
  onRefresh: () => void;
}

const CourseResourcesManager: React.FC<Props> = ({ courseId, onRefresh }) => {
  const [lessons, setLessons] = useState<InstructorLessonDetailResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // States cho Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [targetLesson, setTargetLesson] =
    useState<InstructorLessonDetailResponse | null>(null);
  const [selectionList, setSelectionList] = useState<any[]>([]);
  const [selectionLoading, setSelectionLoading] = useState(false);

  // 1. Load danh sách bài học trong khóa học
  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await instructorService.getLessonsInCourse(courseId);
      setLessons(res.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách bài học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  // 2. Xử lý mở Drawer và load data theo Type
  const handleOpenSelector = async (lesson: InstructorLessonDetailResponse) => {
    setTargetLesson(lesson);
    setIsDrawerOpen(true);
    setSelectionLoading(true);
    setSelectionList([]);

    try {
      let res;
      if (lesson.lessonType === "VIDEO") {
        res = await instructorService.getSelectVideos();
      } else if (lesson.lessonType === "TEXT") {
        res = await instructorService.getSelectLectures();
      } else {
        res = await instructorService.getSelectQuizzes();
      }
      setSelectionList(res.data || []);
    } catch (error) {
      message.error("Lỗi khi tải danh sách tài nguyên");
    } finally {
      setSelectionLoading(false);
    }
  };

  // 3. Xử lý Gắn tài nguyên (Add)
  const handleAddResource = async (resourceId: string) => {
    if (!targetLesson) return;
    try {
      await instructorService.addResourceForLesson({
        courseId: courseId,
        lessonId: targetLesson.id,
        resourceId: resourceId,
        type: targetLesson.lessonType,
      });
      message.success("Đã gắn tài nguyên thành công!");
      setIsDrawerOpen(false);
      fetchLessons(); // Reload lại bảng để cập nhật hasResource
      onRefresh(); // Cập nhật data tổng nếu cần
    } catch (error) {
      message.error("Có lỗi xảy ra khi gắn tài nguyên");
    }
  };

  // 4. Xử lý Gỡ tài nguyên (Remove)
  const handleRemoveResource = async (lessonId: string) => {
    try {
      await instructorService.removeResourceForLesson({
        courseId: courseId,
        lessonId: lessonId,
      });
      message.success("Đã gỡ tài nguyên khỏi bài học");
      fetchLessons();
      onRefresh();
    } catch (error) {
      message.error("Lỗi khi gỡ tài nguyên");
    }
  };

  const columns = [
    {
      title: "Tên bài học",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Loại nội dung",
      dataIndex: "lessonType",
      key: "lessonType",
      width: 150,
      render: (type: string) => {
        const config = {
          VIDEO: {
            color: "blue",
            icon: <PlayCircleOutlined />,
            label: "Video",
          },
          TEXT: {
            color: "orange",
            icon: <FileTextOutlined />,
            label: "Tài liệu",
          },
          QUIZ: {
            color: "purple",
            icon: <QuestionCircleOutlined />,
            label: "Bài Quiz",
          },
        };
        const item = (config as any)[type];
        return (
          <Tag color={item.color} icon={item.icon}>
            {item.label}
          </Tag>
        );
      },
    },
    {
      title: "Tình trạng",
      dataIndex: "hasResource",
      key: "hasResource",
      width: 150,
      render: (has: boolean) => (
        <Tag color={has ? "success" : "default"}>
          {has ? "Đã có tài nguyên" : "Chưa có nội dung"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right" as const,
      width: 200,
      render: (_: any, record: InstructorLessonDetailResponse) => (
        <Space>
          {!record.hasResource ? (
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => handleOpenSelector(record)}
            >
              Gắn tài nguyên
            </Button>
          ) : (
            <Popconfirm
              title="Gỡ tài nguyên này?"
              onConfirm={() => handleRemoveResource(record.id)}
              okText="Gỡ"
              cancelText="Hủy"
            >
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                Gỡ bỏ
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="py-2">
      <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
        <Text type="secondary">
          <LinkOutlined className="mr-2" />
          Tại đây bạn có thể liên kết các Video, Bài giảng PDF hoặc Bài Quiz đã
          tạo vào từng bài học cụ thể của khóa học.
        </Text>
      </div>

      <Table
        columns={columns}
        dataSource={lessons}
        rowKey="id"
        loading={loading}
        pagination={false}
        className="shadow-sm border rounded-lg"
      />

      {/* DRAWER CHỌN TÀI NGUYÊN (TRƯỢT TỪ PHẢI) */}
      <Drawer
        title={
          <div className="flex flex-col">
            <span className="text-lg">
              Chọn {targetLesson?.lessonType} bài học
            </span>
            <Text type="secondary" className="text-xs font-normal">
              Bài học: {targetLesson?.title}
            </Text>
          </div>
        }
        placement="right"
        width={450}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        destroyOnClose
      >
        <List
          loading={selectionLoading}
          dataSource={selectionList}
          locale={{ emptyText: <Empty description="Kho dữ liệu trống" /> }}
          renderItem={(item) => {
            // Logic lấy ID và Title giữ nguyên như cũ
            const id = item.videoId || item.lectureId || item.quizId;
            const title = item.title;

            return (
              <List.Item
                key={id}
                className="p-0 border-none mb-4 animate-fade-in" // Xóa padding mặc định của List.Item
              >
                <div
                  className="w-full flex items-center gap-4 bg-white hover:bg-blue-50/50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 cursor-pointer transition-all duration-300 group shadow-sm hover:shadow-md"
                  onClick={() => handleAddResource(id)}
                >
                  {/* Phần 1: Icon đại diện cho loại tài nguyên (Được làm to và nổi bật hơn) */}
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                    {targetLesson?.lessonType === "VIDEO" ? (
                      <PlayCircleOutlined />
                    ) : targetLesson?.lessonType === "TEXT" ? (
                      <FileTextOutlined />
                    ) : (
                      <QuestionCircleOutlined />
                    )}
                  </div>

                  {/* Phần 2: Nội dung văn bản (Nằm giữa) */}
                  <div className="flex-grow min-w-0">
                    <Text
                      strong
                      className="block text-gray-800 text-base mb-0.5 truncate group-hover:text-blue-700 transition-colors"
                    >
                      {title}
                    </Text>
                    <Text type="secondary" className="text-xs italic">
                      Gắn tài nguyên vào bài học: {targetLesson?.title}
                    </Text>
                  </div>

                  {/* Phần 3: Nút hành động "Thêm" (Nổi bật khi hover) */}
                  <div className="flex-shrink-0 ml-auto pl-2">
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<PlusOutlined />}
                      className="scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 bg-blue-600 border-blue-600 hover:bg-blue-700 shadow-sm"
                    />
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      </Drawer>
    </div>
  );
};

export default CourseResourcesManager;
