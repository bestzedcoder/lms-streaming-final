import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Button,
  Radio,
  Checkbox,
  Collapse,
  List,
  Tag,
  Spin,
  message,
  Empty,
  Progress,
  Divider,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  PlayCircleFilled,
  FileTextFilled,
  QuestionCircleFilled,
  LeftOutlined,
  CheckCircleFilled,
  LockFilled,
  CaretRightOutlined,
} from "@ant-design/icons";
import type {
  CourseEnrollmentDetailsResponse,
  QuizLearningResponse,
} from "../../@types/student.types";
import { studentService } from "../../services/student.service";
import HlsVideoPlayer from "./HlsVideoPlayer";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const CourseLearningWorkspace: React.FC = () => {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const navigate = useNavigate();

  // --- States ---
  const [courseData, setCourseData] =
    useState<CourseEnrollmentDetailsResponse | null>(null);
  const [currentLessonType, setCurrentLessonType] = useState<string>("");
  const [contentUrl, setContentUrl] = useState<string>("");
  const [quizData, setQuizData] = useState<QuizLearningResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Quiz logic state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    correctAnswers: number;
    score: number;
  } | null>(null);

  // 1. Fetch cấu trúc khóa học
  useEffect(() => {
    const fetchCourseStructure = async () => {
      if (slug) {
        try {
          const res = await studentService.getCourseByStudent(slug);
          setCourseData(res.data);
        } catch (error) {
          message.error("Không thể tải cấu trúc khóa học");
        }
      }
    };
    fetchCourseStructure();
  }, [slug]);

  // 2. Fetch nội dung bài học khi chuyển bài
  useEffect(() => {
    if (slug && lessonId && courseData) {
      const lesson = courseData.sections
        .flatMap((s) => s.lessons)
        .find((l) => l.lessonId === lessonId);
      if (lesson && lesson.hasResource) {
        setCurrentLessonType(lesson.lessonType);
        fetchLessonContent(lesson.lessonType);
      }
    }
  }, [lessonId, courseData]);

  const fetchLessonContent = async (type: string) => {
    setLoading(true);
    try {
      if (type === "VIDEO") {
        const res = await studentService.learnVideo(slug!, lessonId!);
        setContentUrl(res.data);
      } else if (type === "TEXT") {
        const res = await studentService.learnLecture(slug!, lessonId!);
        setContentUrl(res.data);
      } else if (type === "QUIZ") {
        const res = await studentService.learnQuiz(slug!, lessonId!);
        setQuizData(res.data);
        setCurrentQuestionIndex(0);
      }
    } catch (error) {
      message.error("Lỗi khi tải nội dung bài học");
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSubmit = async () => {
    if (!quizData || !slug) return;

    setSubmitting(true);
    try {
      // Mapping dữ liệu từ userAnswers sang định dạng API yêu cầu
      const questionsSubmission = quizData.questions.map((q) => {
        const rawAnswer = userAnswers[q.questionId];
        let finalAnswers: string[] = [];

        if (Array.isArray(rawAnswer)) {
          // Trường hợp MULTIPLE_CHOICE: rawAnswer đã là mảng các ID
          finalAnswers = rawAnswer.map(String);
        } else if (rawAnswer !== undefined && rawAnswer !== null) {
          // Trường hợp SINGLE_CHOICE: rawAnswer là 1 ID đơn lẻ, bọc nó vào mảng
          finalAnswers = [String(rawAnswer)];
        }

        return {
          questionId: q.questionId,
          answers: finalAnswers, // Luôn luôn là mảng string
        };
      });

      const submissionData = {
        quizId: quizData.quizId,
        questions: questionsSubmission,
      };

      // Gọi API nộp bài
      const res = await studentService.submitQuiz(slug, submissionData);

      // Xử lý kết quả trả về (số câu đúng) và tính điểm thang 100
      const correctCount = res.data;
      const totalQuestions = quizData.questions.length;
      const calculatedScore =
        totalQuestions > 0
          ? Math.round((correctCount / totalQuestions) * 100)
          : 0;

      setQuizResult({
        correctAnswers: correctCount,
        score: calculatedScore,
      });

      message.success(
        `Hoàn thành! Bạn đúng ${correctCount}/${totalQuestions} câu. Điểm: ${calculatedScore}/100`,
      );
    } catch (error) {
      console.error("Quiz submission error:", error);
      message.error("Đã xảy ra lỗi khi gửi bài làm, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- RENDERERS ---

  const renderContentManager = () => {
    if (loading)
      return (
        <div className="h-full flex items-center justify-center bg-[#1c1d1f]">
          <Spin size="large" tip="Đang tải bài học..." />
        </div>
      );

    switch (currentLessonType) {
      case "VIDEO":
        return (
          <div className="h-full bg-black flex items-center justify-center shadow-inner">
            {contentUrl ? (
              <HlsVideoPlayer src={contentUrl} />
            ) : (
              <Empty description="Không có đường dẫn video" />
            )}
          </div>
        );
      case "TEXT":
        return (
          <div className="h-full w-full bg-white flex flex-col">
            <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
              <Text strong>Tài liệu bài học</Text>
              <Button size="small" href={contentUrl} target="_blank">
                Mở tab mới
              </Button>
            </div>
            <iframe
              src={contentUrl}
              className="flex-grow w-full border-none"
              title="Lecture"
            />
          </div>
        );
      case "QUIZ":
        if (!quizData) return null;

        // Hiển thị màn hình kết quả sau khi nộp bài
        if (quizResult) {
          return (
            <div className="h-full flex items-center justify-center bg-white p-6 animate-fade-in">
              <div className="max-w-md w-full text-center p-10 border border-gray-100 rounded-3xl shadow-xl">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircleFilled style={{ fontSize: "40px" }} />
                </div>
                <Title level={2} className="!mb-2">
                  Kết quả bài Quiz
                </Title>
                <Text type="secondary">
                  Chúc mừng bạn đã hoàn thành bài kiểm tra!
                </Text>

                <div className="bg-gray-50 rounded-2xl p-6 my-8 text-left border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <Text className="text-gray-500">Số câu đúng</Text>
                    <Tag
                      color="green"
                      className="m-0 px-3 py-0.5 rounded-lg font-bold"
                    >
                      {quizResult.correctAnswers} / {quizData.questions.length}
                    </Tag>
                  </div>
                  <Divider className="my-0" />
                  <div className="flex justify-between items-center mt-4">
                    <Text className="text-gray-500">Điểm số (Thang 100)</Text>
                    <Text strong className="text-2xl text-blue-600">
                      {quizResult.score}
                    </Text>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    type="primary"
                    size="large"
                    className="w-full rounded-xl h-12 font-bold bg-[#303df2] border-none shadow-md"
                    onClick={() => {
                      setQuizResult(null);
                      setCurrentQuestionIndex(0);
                      setUserAnswers({});
                    }}
                  >
                    Làm lại bài kiểm tra
                  </Button>
                  <Button
                    type="text"
                    className="text-gray-400"
                    onClick={() =>
                      navigate(`/student/courses/${slug}/learning`)
                    }
                  >
                    Quay lại danh sách bài học
                  </Button>
                </div>
              </div>
            </div>
          );
        }

        const currentQ = quizData.questions[currentQuestionIndex];
        const isLast = currentQuestionIndex === quizData.questions.length - 1;

        return (
          <div className="h-full overflow-y-auto bg-white py-12 px-6">
            <div className="max-w-3xl mx-auto border border-gray-100 rounded-3xl p-10 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <Tag
                    color="purple"
                    className="px-3 py-1 rounded-lg font-medium border-none bg-purple-50 text-purple-600"
                  >
                    {currentQ.type === "SINGLE_CHOICE"
                      ? "Chọn một đáp án"
                      : "Chọn nhiều đáp án"}
                  </Tag>
                  <Title level={4} className="!mt-4 !mb-0">
                    {currentQ.content}
                  </Title>
                </div>
                <div className="text-right">
                  <Text
                    type="secondary"
                    className="block text-xs uppercase tracking-widest mb-1"
                  >
                    Tiến trình
                  </Text>
                  <Text strong className="text-lg text-blue-600">
                    {currentQuestionIndex + 1} / {quizData.questions.length}
                  </Text>
                </div>
              </div>

              <Divider className="my-8" />

              <div className="space-y-4 mb-12">
                {currentQ.type === "SINGLE_CHOICE" ? (
                  <Radio.Group
                    className="w-full flex flex-col gap-4"
                    value={userAnswers[currentQ.questionId]}
                    onChange={(e) =>
                      setUserAnswers({
                        ...userAnswers,
                        [currentQ.questionId]: e.target.value,
                      })
                    }
                  >
                    {currentQ.answers.map((ans) => (
                      <Radio
                        key={ans.answerId}
                        value={ans.answerId}
                        className="learning-quiz-item p-5 border border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all m-0 shadow-sm"
                      >
                        <span className="ml-2 text-gray-700">{ans.answer}</span>
                      </Radio>
                    ))}
                  </Radio.Group>
                ) : (
                  <Checkbox.Group
                    className="w-full flex flex-col gap-4"
                    value={userAnswers[currentQ.questionId]}
                    onChange={(vals) =>
                      setUserAnswers({
                        ...userAnswers,
                        [currentQ.questionId]: vals,
                      })
                    }
                  >
                    {currentQ.answers.map((ans) => (
                      <Checkbox
                        key={ans.answerId}
                        value={ans.answerId}
                        className="learning-quiz-item p-5 border border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all m-0 shadow-sm"
                      >
                        <span className="ml-2 text-gray-700">{ans.answer}</span>
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                )}
              </div>

              <div className="flex justify-between pt-8 border-t border-gray-50">
                <Button
                  size="large"
                  disabled={currentQuestionIndex === 0}
                  className="rounded-xl px-8"
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                >
                  Câu trước
                </Button>

                {isLast ? (
                  <Button
                    type="primary"
                    size="large"
                    icon={<CheckCircleFilled />}
                    loading={submitting}
                    onClick={handleQuizSubmit}
                    className="bg-green-600 border-none px-12 rounded-xl h-12 font-bold shadow-lg shadow-green-100"
                  >
                    Nộp bài Quiz
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-12 rounded-xl h-12 font-bold bg-[#303df2] border-none shadow-lg shadow-blue-100"
                  >
                    Câu tiếp theo
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <Empty description="Chào mừng bạn! Hãy chọn bài học bên phải để bắt đầu." />
          </div>
        );
    }
  };

  return (
    <Layout className="h-screen bg-white overflow-hidden">
      {/* Header tối giản chuyên nghiệp */}
      <Header className="bg-[#1c1d1f] flex items-center justify-between px-4 h-14 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Button
            ghost
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate(`/student/courses/${slug}/learning`)}
            className="text-white hover:bg-gray-800"
          />
          <Divider type="vertical" className="bg-gray-700 h-6" />
          <Title
            level={5}
            className="!text-white !m-0 truncate max-w-lg font-normal"
          >
            {courseData?.title}
          </Title>
        </div>
        <div className="hidden md:block">
          <Progress
            percent={45}
            size="small"
            strokeColor="#56d8ff"
            trailColor="#3e4143"
            className="w-48 text-white"
            format={(p) => (
              <span className="text-white text-xs">{p}% hoàn thành</span>
            )}
          />
        </div>
      </Header>

      <Layout>
        <Content className="relative bg-[#1c1d1f]">
          {renderContentManager()}
        </Content>

        {/* Sidebar Sidebar được thiết kế lại */}
        <Sider
          width={400}
          theme="light"
          className="learning-sidebar border-l overflow-y-auto"
        >
          <div className="p-4 border-b bg-white flex justify-between items-center sticky top-0 z-10">
            <span className="font-bold text-base">Nội dung khóa học</span>
          </div>

          <Collapse
            ghost
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            defaultActiveKey={[courseData?.sections[0]?.title || ""]}
            className="bg-white"
          >
            {courseData?.sections.map((section, sIndex) => (
              <Panel
                key={section.title}
                header={
                  <div className="flex flex-col">
                    <Text strong className="text-gray-800">
                      Phần {sIndex + 1}: {section.title}
                    </Text>
                    <Text className="text-[11px] text-gray-500">
                      0/{section.lessons.length} bài học
                    </Text>
                  </div>
                }
                className="border-b"
              >
                <List
                  dataSource={section.lessons}
                  renderItem={(item, lIndex) => {
                    const isActive = lessonId === item.lessonId;
                    const isLocked = !item.hasResource;

                    return (
                      <List.Item
                        className={`
                          group px-4 py-3 border-none transition-all relative
                          ${isActive ? "bg-[#d1d7dc] border-l-4 border-blue-600" : "hover:bg-[#f7f9fa]"}
                          ${isLocked ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
                        `}
                        onClick={() =>
                          !isLocked &&
                          navigate(
                            `/student/courses/${slug}/learning/${item.lessonId}`,
                          )
                        }
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div
                            className={`mt-0.5 ${isActive ? "text-blue-600" : "text-gray-400"}`}
                          >
                            {isLocked ? (
                              <LockFilled />
                            ) : item.lessonType === "VIDEO" ? (
                              <PlayCircleFilled />
                            ) : item.lessonType === "QUIZ" ? (
                              <QuestionCircleFilled />
                            ) : (
                              <FileTextFilled />
                            )}
                          </div>
                          <div className="flex flex-col flex-grow">
                            <Text
                              className={`text-sm ${isActive ? "font-bold" : "font-normal"}`}
                            >
                              {lIndex + 1}. {item.title}
                            </Text>
                            <div className="flex items-center gap-2 mt-1">
                              <Tag className="m-0 text-[10px] py-0 px-1 border-none bg-gray-200">
                                {item.lessonType}
                              </Tag>
                            </div>
                          </div>
                        </div>
                      </List.Item>
                    );
                  }}
                />
              </Panel>
            ))}
          </Collapse>
        </Sider>
      </Layout>
    </Layout>
  );
};

export default CourseLearningWorkspace;
