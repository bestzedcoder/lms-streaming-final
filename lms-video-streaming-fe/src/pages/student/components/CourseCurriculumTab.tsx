import React, { useEffect, useState } from "react";
import {
  Collapse,
  List,
  Tag,
  Typography,
  Spin,
  Empty,
  message,
  Button,
} from "antd";
import {
  PlayCircleOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  LockOutlined,
  InfoCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import type { CourseEnrollmentDetailsResponse } from "../../../@types/student.types";
import { studentService } from "../../../services/student.service";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;
const { Panel } = Collapse;

type Props = {
  slug: string | undefined;
};

const CourseCurriculumTab: React.FC<Props> = ({ slug }) => {
  const [data, setData] = useState<CourseEnrollmentDetailsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;

    const fetchCurriculum = async () => {
      setLoading(true);
      try {
        const res = await studentService.getCourseByStudent(slug);
        setData(res.data);
      } catch (error) {
        message.error("Không thể tải nội dung chương trình học");
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculum();
  }, [slug]);

  const handleStartCourse = () => {
    if (!data) return;
    for (const section of data.sections) {
      const firstLesson = section.lessons.find((l) => l.hasResource);
      if (firstLesson) {
        navigate(`/student/courses/${slug}/learning/${firstLesson.lessonId}`);
        return;
      }
    }
    message.warning("Khóa học hiện chưa có bài học nào sẵn sàng.");
  };

  if (!slug)
    return (
      <Empty
        description="Không tìm thấy mã định danh khóa học"
        className="py-20"
      />
    );
  if (loading)
    return (
      <div className="py-20 text-center">
        <Spin size="large" tip="Đang tải nội dung bài học..." />
      </div>
    );
  if (!data || !data.sections.length)
    return (
      <Empty
        description="Khóa học này chưa có nội dung bài học"
        className="py-20"
      />
    );

  return (
    <div className="max-w-4xl mx-auto py-4 animate-fade-in">
      {/* Header mới: Title + Button Start Course */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <Title level={2} className="!mb-1 text-gray-800">
            {data.title}
          </Title>
          <Text type="secondary" className="text-base">
            Tổng số chương: <Text strong>{data.sections.length}</Text> • Vui
            lòng hoàn thành các bài học có nội dung để tiếp tục.
          </Text>
        </div>

        <Button
          type="primary"
          size="large"
          className="h-12 px-8 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold shadow-lg hover:shadow-blue-200 transition-all border-none"
          style={{ background: "#303df2" }}
          onClick={handleStartCourse}
        >
          Start Course <ArrowRightOutlined />
        </Button>
      </div>

      <Collapse
        defaultActiveKey={[data.sections[0]?.title]}
        expandIconPosition="end"
        ghost
        className="learning-curriculum-collapse bg-transparent"
      >
        {/* Intro Panel */}
        <Panel
          header={
            <div className="flex items-center py-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mr-4 text-blue-600 border border-blue-100 shadow-sm">
                <InfoCircleOutlined style={{ fontSize: "18px" }} />
              </div>
              <div>
                <Text strong className="text-lg block text-blue-700">
                  Giới thiệu khóa học
                </Text>
                <Text
                  type="secondary"
                  className="text-xs uppercase tracking-wider"
                >
                  Thông tin tổng quan
                </Text>
              </div>
            </div>
          }
          key="intro"
          className="mb-5 border border-blue-100 rounded-2xl bg-blue-50/20 overflow-hidden shadow-sm"
        >
          <div className="px-6 py-4 bg-white rounded-b-2xl border-t border-blue-50">
            <div
              className="text-gray-600 leading-relaxed text-sm"
              dangerouslySetInnerHTML={{
                __html: data.description ?? "Chưa có mô tả cho khóa học này.",
              }}
            />
          </div>
        </Panel>

        {/* Sections List */}
        {data.sections.map((section, sIndex) => (
          <Panel
            header={
              <div className="flex items-center py-1">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-xs font-bold text-gray-500 border border-gray-200">
                  {sIndex + 1}
                </div>
                <Text strong className="text-base text-gray-800">
                  {section.title}
                </Text>
                <Text
                  type="secondary"
                  className="ml-auto mr-4 text-xs font-normal"
                >
                  {section.lessons.length} bài học
                </Text>
              </div>
            }
            key={section.title}
            className="mb-4 border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden"
          >
            <List
              dataSource={section.lessons}
              renderItem={(lesson, lIndex) => {
                const isClickable = lesson.hasResource;

                const getIcon = () => {
                  if (lesson.lessonType === "VIDEO")
                    return (
                      <PlayCircleOutlined className="text-blue-500 text-lg" />
                    );
                  if (lesson.lessonType === "QUIZ")
                    return (
                      <QuestionCircleOutlined className="text-purple-500 text-lg" />
                    );
                  return (
                    <FileTextOutlined className="text-orange-500 text-lg" />
                  );
                };

                return (
                  <List.Item
                    className={`px-6 py-4 transition-all border-none flex items-center gap-4 ${
                      isClickable
                        ? "hover:bg-blue-50 cursor-pointer group"
                        : "opacity-50 cursor-not-allowed bg-gray-50/30"
                    }`}
                    onClick={() => {
                      if (isClickable) {
                        navigate(
                          `/student/courses/${slug}/learning/${lesson.lessonId}`,
                        );
                      } else {
                        message.warning("Bài học này chưa có nội dung.");
                      }
                    }}
                  >
                    <div className="flex-shrink-0">
                      {isClickable ? (
                        getIcon()
                      ) : (
                        <LockOutlined className="text-gray-400 text-lg" />
                      )}
                    </div>

                    <div className="flex-grow">
                      <Text
                        className={`text-sm ${isClickable ? "text-gray-700 group-hover:text-blue-600 font-medium" : "text-gray-400"}`}
                      >
                        {lIndex + 1}. {lesson.title}
                      </Text>
                    </div>

                    <div className="flex-shrink-0">
                      {isClickable ? (
                        <Tag
                          color="blue"
                          className="rounded-full px-3 text-[10px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Học ngay
                        </Tag>
                      ) : (
                        <Tag className="rounded-full px-3 text-[10px] uppercase font-bold border-none bg-gray-200">
                          Chờ cập nhật
                        </Tag>
                      )}
                    </div>
                  </List.Item>
                );
              }}
              className="bg-white"
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default CourseCurriculumTab;
