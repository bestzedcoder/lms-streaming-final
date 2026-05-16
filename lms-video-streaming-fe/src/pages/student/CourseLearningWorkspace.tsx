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
  ClockCircleOutlined,
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

// Hằng số thời gian làm bài (10 phút = 600 giây)
const QUIZ_DURATION_SECONDS = 600;

const CourseLearningWorkspace: React.FC = () => {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const navigate = useNavigate();

  // --- States Dữ liệu ---
  const [courseData, setCourseData] =
    useState<CourseEnrollmentDetailsResponse | null>(null);
  const [currentLessonType, setCurrentLessonType] = useState<string>("");
  const [contentUrl, setContentUrl] = useState<string>("");
  const [quizData, setQuizData] = useState<QuizLearningResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // --- States Quiz ---
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    correctAnswers: number;
    score: number;
  } | null>(null);

  // Fetch dữ liệu cấu trúc khóa học
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

  useEffect(() => {
    if (slug && lessonId && courseData) {
      const lesson = courseData.sections
        .flatMap((s) => s.lessons)
        .find((l) => l.lessonId === lessonId);
      if (lesson && lesson.hasResource) {
        setCurrentLessonType(lesson.lessonType);
        fetchLessonContent(lesson.lessonType);

        setQuizStarted(false);
        setTimeLeft(QUIZ_DURATION_SECONDS);
        setQuizResult(null);
        setUserAnswers({});
        setCurrentQuestionIndex(0);
      }
    }
  }, [lessonId, courseData]);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>;

    if (quizStarted && !quizResult && !submitting && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timerId);
  }, [quizStarted, quizResult, submitting, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && quizStarted && !quizResult && !submitting) {
      message.warning("Đã hết thời gian làm bài! Hệ thống tự động nộp bài.");
      handleQuizSubmit();
    }
  }, [timeLeft, quizStarted, quizResult, submitting]);

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
      const questionsSubmission = quizData.questions.map((q) => {
        const rawAnswer = userAnswers[q.questionId];
        let finalAnswers: string[] = [];

        if (Array.isArray(rawAnswer)) {
          finalAnswers = rawAnswer.map(String);
        } else if (rawAnswer !== undefined && rawAnswer !== null) {
          finalAnswers = [String(rawAnswer)];
        }

        return {
          questionId: q.questionId,
          answers: finalAnswers,
        };
      });

      const submissionData = {
        quizId: quizData.quizId,
        version: quizData.version,
        questions: questionsSubmission,
      };

      const res = await studentService.submitQuiz(slug, submissionData);

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

      message.success(`Hoàn thành! Điểm của bạn: ${calculatedScore}/100`);
    } catch (error) {
      console.error("Quiz submission error:", error);
      message.error("Đã xảy ra lỗi khi gửi bài làm, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper format giây thành MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

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

        // 1. MÀN HÌNH CHỜ (TRƯỚC KHI LÀM BÀI)
        if (!quizStarted) {
          return (
            <div className="h-full flex items-center justify-center bg-white p-6 animate-fade-in">
              <div className="max-w-md w-full text-center p-10 border border-gray-100 rounded-3xl shadow-xl">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <QuestionCircleFilled style={{ fontSize: "36px" }} />
                </div>
                <Title level={2} className="!mb-2 text-gray-800">
                  {courseData?.sections
                    .flatMap((s) => s.lessons)
                    .find((l) => l.lessonId === lessonId)?.title ||
                    "Bài kiểm tra"}
                </Title>
                <Text type="secondary" className="block mb-6">
                  Vui lòng chuẩn bị sẵn sàng trước khi bắt đầu. Bạn sẽ không thể
                  tạm dừng đồng hồ sau khi đã bấm nút.
                </Text>

                <div className="flex justify-center gap-12 my-8 text-gray-600">
                  <div className="flex flex-col items-center">
                    <Text strong className="text-2xl text-blue-600">
                      {quizData.questions.length}
                    </Text>
                    <Text className="text-xs font-bold uppercase tracking-wider mt-1 text-gray-400">
                      Câu hỏi
                    </Text>
                  </div>
                  <div className="w-px bg-gray-200"></div>
                  <div className="flex flex-col items-center">
                    <Text strong className="text-2xl text-blue-600">
                      10
                    </Text>
                    <Text className="text-xs font-bold uppercase tracking-wider mt-1 text-gray-400">
                      Phút
                    </Text>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  className="w-full rounded-xl h-12 font-bold bg-[#303df2] border-none shadow-lg shadow-blue-100"
                  onClick={() => setQuizStarted(true)}
                >
                  Bắt đầu làm bài
                </Button>
              </div>
            </div>
          );
        }

        // 2. MÀN HÌNH KẾT QUẢ (SAU KHI NỘP BÀI)
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
                      // Reset Timer & Start State
                      setQuizStarted(false);
                      setTimeLeft(QUIZ_DURATION_SECONDS);
                    }}
                  >
                    Làm lại bài kiểm tra
                  </Button>
                  <Button
                    type="text"
                    className="text-gray-400 font-medium hover:text-gray-600"
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

        // 3. MÀN HÌNH LÀM BÀI (CÓ ĐỒNG HỒ ĐẾM NGƯỢC)
        const currentQ = quizData.questions[currentQuestionIndex];
        const isLast = currentQuestionIndex === quizData.questions.length - 1;

        return (
          <div className="h-full overflow-y-auto bg-white py-12 px-6">
            <div className="max-w-3xl mx-auto border border-gray-100 rounded-3xl p-10 shadow-sm relative">
              {/* Tiêu đề câu hỏi & Đồng hồ */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex-1 pr-6">
                  <Tag
                    color="purple"
                    className="px-3 py-1 rounded-lg font-medium border-none bg-purple-50 text-purple-600 mb-3"
                  >
                    {currentQ.type === "SINGLE_CHOICE"
                      ? "Chọn một đáp án"
                      : "Chọn nhiều đáp án"}
                  </Tag>
                  <Title
                    level={4}
                    className="!m-0 leading-relaxed text-gray-800"
                  >
                    {currentQ.content}
                  </Title>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end">
                  {/* TIMER */}
                  <div
                    className={`flex items-center gap-1.5 text-lg font-bold bg-gray-50 px-4 py-2 rounded-xl border ${timeLeft < 60 ? "text-red-500 border-red-200 bg-red-50 animate-pulse" : "text-blue-600 border-blue-100"}`}
                  >
                    <ClockCircleOutlined /> {formatTime(timeLeft)}
                  </div>
                  <Text
                    type="secondary"
                    className="block text-xs uppercase tracking-widest mt-3 font-semibold"
                  >
                    Tiến trình {currentQuestionIndex + 1} /{" "}
                    {quizData.questions.length}
                  </Text>
                </div>
              </div>

              <Divider className="my-6 border-gray-100" />

              {/* Phần Option Đáp Án */}
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
                        className="learning-quiz-item p-5 border border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/50 transition-all m-0 shadow-sm"
                      >
                        <span className="ml-2 text-gray-700 text-base">
                          {ans.answer}
                        </span>
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
                        className="learning-quiz-item p-5 border border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/50 transition-all m-0 shadow-sm"
                      >
                        <span className="ml-2 text-gray-700 text-base">
                          {ans.answer}
                        </span>
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                )}
              </div>

              {/* Nút Điều Hướng */}
              <div className="flex justify-between pt-6 border-t border-gray-50">
                <Button
                  size="large"
                  disabled={currentQuestionIndex === 0}
                  className="rounded-xl px-8 hover:bg-gray-50"
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
                    className="bg-green-600 hover:bg-green-500 border-none px-12 rounded-xl h-12 font-bold shadow-lg shadow-green-100"
                  >
                    Nộp bài
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-12 rounded-xl h-12 font-bold bg-[#303df2] hover:bg-blue-600 border-none shadow-lg shadow-blue-100"
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

        {/* SIDEBAR - NÂNG CẤP UI ĐẸP MẮT */}
        <Sider
          width={400}
          theme="light"
          className="learning-sidebar border-l border-gray-200 overflow-y-auto bg-gray-50"
        >
          <div className="p-5 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
            <span className="font-bold text-lg text-gray-800">
              Nội dung khóa học
            </span>
          </div>

          <Collapse
            ghost
            expandIcon={({ isActive }) => (
              <CaretRightOutlined
                rotate={isActive ? 90 : 0}
                className="text-gray-400 text-xs"
              />
            )}
            defaultActiveKey={[courseData?.sections[0]?.title || ""]}
            className="bg-gray-50"
          >
            {courseData?.sections.map((section, sIndex) => (
              <Panel
                key={section.title}
                header={
                  <div className="flex flex-col py-1">
                    <Text strong className="text-gray-800 text-sm mb-0.5">
                      Phần {sIndex + 1}: {section.title}
                    </Text>
                    <Text className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                      0/{section.lessons.length} Bài học
                    </Text>
                  </div>
                }
                className="border-b border-gray-200 bg-white shadow-sm mb-2"
              >
                <List
                  dataSource={section.lessons}
                  className="bg-white"
                  renderItem={(item, lIndex) => {
                    const isActive = lessonId === item.lessonId;
                    const isLocked = !item.hasResource;

                    return (
                      <List.Item
                        className={`
                          group px-6 py-4 border-b border-gray-50 transition-all relative
                          ${isActive ? "bg-blue-50/40" : "hover:bg-gray-50"}
                          ${isLocked ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
                        `}
                        onClick={() =>
                          !isLocked &&
                          navigate(
                            `/student/courses/${slug}/learning/${item.lessonId}`,
                          )
                        }
                      >
                        {/* Thanh highlight bên trái nếu Active */}
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                        )}

                        <div className="flex items-start gap-4 w-full">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isActive
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                            }`}
                          >
                            {isLocked ? (
                              <LockFilled className="text-xs" />
                            ) : item.lessonType === "VIDEO" ? (
                              <PlayCircleFilled className="text-sm" />
                            ) : item.lessonType === "QUIZ" ? (
                              <QuestionCircleFilled className="text-sm" />
                            ) : (
                              <FileTextFilled className="text-sm" />
                            )}
                          </div>

                          <div className="flex flex-col flex-grow">
                            <Text
                              className={`text-sm leading-snug transition-colors ${
                                isActive
                                  ? "font-bold text-blue-700"
                                  : "font-medium text-gray-700 group-hover:text-blue-600"
                              }`}
                            >
                              {lIndex + 1}. {item.title}
                            </Text>
                            <div className="mt-1.5">
                              <Tag
                                className={`m-0 text-[10px] py-0 px-2 font-semibold border-none uppercase tracking-wider ${
                                  isActive
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
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
