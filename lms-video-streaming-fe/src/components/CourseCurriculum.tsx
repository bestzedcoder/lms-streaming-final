import { useState } from "react";
import {
  Collapse,
  Button,
  List,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Tag,
  Popconfirm,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VideoCameraFilled,
  FileTextFilled,
  QuestionCircleFilled,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { instructorService } from "../services/instructor.service";
import { notify } from "../utils/notification.utils";
import type {
  InstructorSectionResponse,
  InstructorLessonResponse,
} from "../types/instructor.types";

const { Panel } = Collapse;

interface Props {
  courseId: string;
  sections: InstructorSectionResponse[];
  onRefresh: () => void;
}

const CourseCurriculum = ({ courseId, sections, onRefresh }: Props) => {
  const [sectionModal, setSectionModal] = useState({
    open: false,
    editing: null as any,
  });
  const [lessonModal, setLessonModal] = useState({
    open: false,
    editing: null as any,
    sectionId: "",
  });

  const [formSection] = Form.useForm();
  const [formLesson] = Form.useForm();

  const handleSaveSection = async (values: any) => {
    try {
      if (sectionModal.editing) {
        await instructorService.updateSection({
          courseId,
          sectionId: sectionModal.editing.id,
          ...values,
        });
      } else {
        await instructorService.addSection({ courseId, ...values });
      }
      notify.success("Thành công", "Đã lưu chương học");
      setSectionModal({ open: false, editing: null });
      onRefresh();
    } catch (e) {
      notify.error("Lỗi", "Không thể lưu chương");
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await instructorService.deleteSection({ courseId, sectionId });
      notify.success("Đã xóa", "Xóa chương thành công");
      onRefresh();
    } catch (e) {
      notify.error("Lỗi", "Không thể xóa chương");
    }
  };

  const handleSaveLesson = async (values: any) => {
    try {
      const payload = {
        ...values,
        courseId,
        sectionId: lessonModal.sectionId,
        preview: values.preview || false,
      };
      if (lessonModal.editing) {
        await instructorService.updateLesson({
          ...payload,
          lessonId: lessonModal.editing.id,
        });
      } else {
        await instructorService.addLesson(payload);
      }
      notify.success("Thành công", "Đã lưu bài học");
      setLessonModal({ open: false, editing: null, sectionId: "" });
      onRefresh();
    } catch (e) {
      notify.error("Lỗi", "Không thể lưu bài học");
    }
  };

  const handleDeleteLesson = async (lessonId: string, sectionId: string) => {
    try {
      await instructorService.deleteLesson({ courseId, sectionId, lessonId });
      notify.success("Đã xóa", "Xóa bài học thành công");
      onRefresh();
    } catch (e) {
      notify.error("Lỗi", "Không thể xóa bài học");
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <VideoCameraFilled className="text-blue-500 text-lg" />;
      case "QUIZ":
        return <QuestionCircleFilled className="text-orange-500 text-lg" />;
      default:
        return <FileTextFilled className="text-gray-500 text-lg" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold m-0 text-gray-800">
            Nội dung khóa học
          </h3>
          <p className="text-gray-500 m-0 text-sm">
            Xây dựng các chương và bài học cho khóa học của bạn.
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSectionModal({ open: true, editing: null });
            formSection.resetFields();
          }}
        >
          Thêm chương mới
        </Button>
      </div>

      {sections.length === 0 ? (
        <Empty description="Chưa có nội dung nào. Hãy tạo chương đầu tiên!" />
      ) : (
        <Collapse
          defaultActiveKey={sections.map((s) => s.id)}
          className="bg-white border-none shadow-sm rounded-lg overflow-hidden"
        >
          {sections.map((section, idx) => (
            <Panel
              key={section.id}
              className="mb-2 border border-gray-100 rounded bg-gray-50"
              header={
                <span className="font-bold text-base">
                  Chương {idx + 1}: {section.title}
                </span>
              }
              extra={
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex gap-2"
                >
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setSectionModal({ open: true, editing: section });
                      formSection.setFieldsValue(section);
                    }}
                  />
                  <Popconfirm
                    title="Xóa chương này?"
                    onConfirm={() => handleDeleteSection(section.id)}
                  >
                    <Button size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                  <Button
                    size="small"
                    type="primary"
                    ghost
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setLessonModal({
                        open: true,
                        editing: null,
                        sectionId: section.id,
                      });
                      formLesson.resetFields();
                    }}
                  >
                    Thêm bài
                  </Button>
                </div>
              }
            >
              <List
                dataSource={section.lessons}
                locale={{ emptyText: "Chưa có bài học nào trong chương này." }}
                renderItem={(lesson: InstructorLessonResponse, lIdx) => (
                  <List.Item
                    className="bg-white px-4 py-3 mb-1 border-b last:border-0 border-gray-100 hover:bg-gray-50 transition-colors"
                    actions={[
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setLessonModal({
                            open: true,
                            editing: lesson,
                            sectionId: section.id,
                          });
                          formLesson.setFieldsValue(lesson);
                        }}
                      />,
                      <Popconfirm
                        title="Xóa bài học?"
                        onConfirm={() =>
                          handleDeleteLesson(lesson.id, section.id)
                        }
                      >
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={getLessonIcon(lesson.lessonType)}
                      title={
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-700">
                            Bài {lIdx + 1}: {lesson.title}
                          </span>
                          {lesson.preview && (
                            <Tag
                              icon={<CheckCircleOutlined />}
                              color="success"
                              className="text-[10px] uppercase font-bold border-0"
                            >
                              Học thử
                            </Tag>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Panel>
          ))}
        </Collapse>
      )}

      <Modal
        title={sectionModal.editing ? "Sửa chương" : "Thêm chương mới"}
        open={sectionModal.open}
        onCancel={() => setSectionModal({ ...sectionModal, open: false })}
        onOk={formSection.submit}
      >
        <Form form={formSection} layout="vertical" onFinish={handleSaveSection}>
          <Form.Item
            name="title"
            label="Tên chương"
            rules={[{ required: true }]}
          >
            <Input placeholder="Ví dụ: Giới thiệu tổng quan" />
          </Form.Item>
          <Form.Item name="descriptionShort" label="Mô tả ngắn">
            <Input.TextArea placeholder="Mục tiêu của chương này..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={lessonModal.editing ? "Sửa bài học" : "Thêm bài học mới"}
        open={lessonModal.open}
        onCancel={() => setLessonModal({ ...lessonModal, open: false })}
        onOk={formLesson.submit}
      >
        <Form
          form={formLesson}
          layout="vertical"
          onFinish={handleSaveLesson}
          initialValues={{ lessonType: "VIDEO", preview: false }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề bài học"
            rules={[{ required: true }]}
          >
            <Input placeholder="Ví dụ: Cài đặt môi trường Development" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="lessonType" label="Loại nội dung">
              <Select>
                <Select.Option value="VIDEO">Video</Select.Option>
                <Select.Option value="QUIZ">Trắc nghiệm</Select.Option>
                <Select.Option value="TEXT">Bài viết</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="preview"
              label="Cho phép học thử?"
              valuePropName="checked"
            >
              <Switch checkedChildren="Có" unCheckedChildren="Không" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
export default CourseCurriculum;
