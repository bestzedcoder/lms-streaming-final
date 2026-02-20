import { Card, Button, Tag, Alert, Modal, Typography } from "antd";
import {
  CloudUploadOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
  LockFilled,
  ClockCircleFilled,
} from "@ant-design/icons";
import { instructorService } from "../services/instructor.service";
import { notify } from "../utils/notification.utils";
import type { InstructorCourseResponse } from "../types/instructor.types";

const { Paragraph } = Typography;
const { confirm } = Modal;

interface Props {
  course: InstructorCourseResponse;
  onRefresh: () => void;
}

const CourseSettings = ({ course, onRefresh }: Props) => {
  const handleStatusChange = (newStatus: "PUBLISHED" | "PRIVATE") => {
    confirm({
      title:
        newStatus === "PUBLISHED" ? "Xuất bản khóa học?" : "Gỡ khóa học xuống?",
      content:
        newStatus === "PUBLISHED"
          ? "Khóa học sẽ được hiển thị công khai trên sàn."
          : "Khóa học sẽ chuyển về trạng thái Nháp (Private).",
      onOk: async () => {
        try {
          if (newStatus === "PUBLISHED") {
            await instructorService.publishCourse(course.id);
          } else {
            await instructorService.unpublishCourse(course.id);
          }
          notify.success("Thành công", "Cập nhật trạng thái thành công");
          onRefresh();
        } catch (e) {
          notify.error("Lỗi", "Không thể cập nhật trạng thái");
        }
      },
    });
  };

  const renderStatusSection = () => {
    if (course.status === "LOCKED") {
      return (
        <Alert
          message="Khóa học đã bị khóa (LOCKED)"
          description="Khóa học này đã bị quản trị viên khóa do vi phạm điều khoản. Vui lòng liên hệ Admin để được hỗ trợ."
          type="error"
          showIcon
          icon={<LockFilled />}
          className="mb-4"
        />
      );
    }
    if (course.status === "PENDING") {
      return (
        <Alert
          message="Đang chờ duyệt (PENDING)"
          description="Khóa học đang trong quá trình kiểm duyệt. Bạn không thể thay đổi trạng thái lúc này."
          type="warning"
          showIcon
          icon={<ClockCircleFilled />}
          className="mb-4"
        />
      );
    }

    const isPublished = course.status === "PUBLISHED";
    const canPublish = course.totalLessons > 0 && course.price !== undefined;

    return (
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-700">
              Trạng thái hiện tại:
            </span>
            <Tag
              color={isPublished ? "green" : "default"}
              className="text-sm font-bold px-2 py-0.5"
            >
              {isPublished ? "ĐANG BÁN (PUBLISHED)" : "BẢN NHÁP (PRIVATE)"}
            </Tag>
          </div>
          <Paragraph type="secondary" className="max-w-xl">
            {isPublished
              ? "Khóa học đang hoạt động bình thường. Học viên có thể tìm kiếm và đăng ký."
              : "Khóa học đang ở chế độ riêng tư. Chỉ bạn mới có thể nhìn thấy nội dung này."}
          </Paragraph>
        </div>

        <div>
          {isPublished ? (
            <Button
              danger
              size="large"
              icon={<CloudDownloadOutlined />}
              onClick={() => handleStatusChange("PRIVATE")}
            >
              Gỡ xuống (Unpublish)
            </Button>
          ) : (
            <div className="flex flex-col items-end gap-2">
              <Button
                type="primary"
                size="large"
                className="bg-green-600 hover:bg-green-500 shadow-md"
                icon={<CloudUploadOutlined />}
                onClick={() => handleStatusChange("PUBLISHED")}
                disabled={!canPublish}
              >
                Xuất bản khóa học
              </Button>
              {!canPublish && (
                <span className="text-xs text-red-500">
                  Cần có ít nhất 1 bài học và giá bán.
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card
        title={<span className="font-bold text-lg">Trạng thái & Hiển thị</span>}
        className="shadow-sm rounded-xl"
      >
        {renderStatusSection()}
      </Card>

      {course.status !== "LOCKED" && (
        <Card
          title={
            <span className="text-red-600 font-bold">Khu vực nguy hiểm</span>
          }
          className="shadow-sm rounded-xl border-red-100 bg-red-50/10"
        >
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-gray-800 m-0">Xóa khóa học</h4>
              <span className="text-gray-500 text-sm">
                Hành động này sẽ xóa vĩnh viễn khóa học và không thể hoàn tác.
              </span>
            </div>
            <Button danger type="primary" icon={<DeleteOutlined />}>
              Xóa vĩnh viễn
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
export default CourseSettings;
