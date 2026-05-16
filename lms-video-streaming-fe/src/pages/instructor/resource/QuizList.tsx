import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Modal,
  Input,
  Drawer,
  Tag,
  Popconfirm,
  message,
  Select,
  Typography,
  Divider,
  Empty,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  CheckOutlined,
  BookOutlined,
  GlobalOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { instructorService } from "../../../services/instructor.service";
import type {
  QuizResponse,
  QuestionCategoryResponse,
  QuestionResponse,
  QuizUpdatingRequest,
} from "../../../@types/instructor.types";

const { Text } = Typography;
const { Option } = Select;

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
  const [categories, setCategories] = useState<QuestionCategoryResponse[]>([]);
  const [bankQuestions, setBankQuestions] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const [currentQuiz, setCurrentQuiz] = useState<QuizResponse | null>(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizType, setQuizType] = useState<"TEST" | "EXAM">("TEST");

  const [selectedCatId, setSelectedCatId] = useState<string>("");
  const [addQuestionLoading, setAddQuestionLoading] = useState(false);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await instructorService.getQuizzes();
      setQuizzes(res.data || []);
    } catch (error) {
      message.error("Lỗi tải danh sách bài kiểm tra");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await instructorService.getQuestionCategories();
      setCategories(res.data || []);
    } catch (error) {
      message.error("Lỗi tải danh mục câu hỏi");
    }
  };

  useEffect(() => {
    fetchQuizzes();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCatId) {
      const fetchQuestionsByCat = async () => {
        try {
          const res = await instructorService.getQuestions({
            q: selectedCatId,
          });
          setBankQuestions(res.data || []);
        } catch (error) {
          message.error("Lỗi tải câu hỏi từ ngân hàng");
        }
      };
      fetchQuestionsByCat();
    } else {
      setBankQuestions([]);
    }
  }, [selectedCatId]);

  const handleOpenQuizModal = (quiz?: QuizResponse) => {
    if (quiz) {
      setCurrentQuiz(quiz);
      setQuizTitle(quiz.title);
      setQuizType(quiz.type || "TEST");
    } else {
      setCurrentQuiz(null);
      setQuizTitle("");
      setQuizType("TEST");
    }
    setIsQuizModalOpen(true);
  };

  const handleSaveQuiz = async () => {
    if (!quizTitle.trim()) return message.warning("Vui lòng nhập tiêu đề");
    try {
      if (currentQuiz) {
        // Cập nhật bao gồm id, title và type (Bỏ status)
        const payload: QuizUpdatingRequest = {
          id: currentQuiz.id,
          title: quizTitle,
          type: quizType,
        };
        await instructorService.updateQuiz(payload);
        message.success("Đã cập nhật bài Đánh giá thành công");
      } else {
        // Tạo mới chỉ cần title
        await instructorService.createQuiz({ title: quizTitle });
        message.success("Đã tạo bài Đánh giá mới");
      }
      setIsQuizModalOpen(false);
      fetchQuizzes();
    } catch (error) {
      message.error("Lỗi khi lưu bài Đánh giá");
    }
  };

  // --- NÚT BẤM NHANH THAY ĐỔI STATUS TRỰC TIẾP ---
  const handleToggleStatus = async (quiz: QuizResponse) => {
    try {
      if (quiz.status === "PUBLISHED") {
        await instructorService.draftQuiz(quiz.id);
        message.success(`Đã chuyển "${quiz.title}" về Bản nháp`);
      } else {
        await instructorService.publishQuiz(quiz.id);
        message.success(`Đã phát hành công khai "${quiz.title}"`);
      }
      fetchQuizzes();
    } catch (error) {
      message.error("Lỗi khi thay đổi trạng thái bài thi");
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    try {
      await instructorService.deleteQuiz(id);
      message.success("Đã xóa bài Đánh giá");
      fetchQuizzes();
    } catch (error) {
      message.error("Lỗi khi xóa");
    }
  };

  const handleViewDetail = (quiz: QuizResponse) => {
    setCurrentQuiz(quiz);
    setIsDetailDrawerOpen(true);
  };

  const handleRemoveQuestionFromQuiz = async (questionId: string) => {
    if (!currentQuiz) return;
    try {
      await instructorService.removeQuizQuestion({
        quizId: currentQuiz.id,
        quizQuestionId: questionId,
      });
      message.success("Đã gỡ câu hỏi khỏi bài thi");
      const updatedQuizzes = quizzes.map((q) => {
        if (q.id === currentQuiz.id) {
          const newQuestions = q.questions.filter(
            (item) => item.id !== questionId,
          );
          const updated = {
            ...q,
            questions: newQuestions,
            totalQuestions: newQuestions.length,
          };
          setCurrentQuiz(updated);
          return updated;
        }
        return q;
      });
      setQuizzes(updatedQuizzes);
    } catch (error) {
      message.error("Lỗi khi gỡ câu hỏi");
    }
  };

  const handleAddQuestionToQuiz = async (questionId: string) => {
    if (!currentQuiz) return;
    setAddQuestionLoading(true);
    try {
      await instructorService.addQuizQuestion({
        quizId: currentQuiz.id,
        questionId,
      });
      message.success("Đã thêm câu hỏi vào bài Đánh giá");
      fetchQuizzes().then(() => {
        const updatedQuiz = quizzes.find((q) => q.id === currentQuiz.id);
        if (updatedQuiz) setCurrentQuiz(updatedQuiz);
      });
    } catch (error) {
      message.error("Câu hỏi đã tồn tại trong bài thi hoặc lỗi hệ thống");
    } finally {
      setAddQuestionLoading(false);
    }
  };

  const columns = [
    {
      title: "Tiêu đề bài kiểm tra",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <Text strong className="text-gray-800">
          {text}
        </Text>
      ),
    },
    {
      title: "Loại bài thi",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type: "TEST" | "EXAM") => {
        if (type === "EXAM") {
          return (
            <Tag color="purple" icon={<FileDoneOutlined />}>
              KẾT THÚC
            </Tag>
          );
        }
        return (
          <Tag color="cyan" icon={<ClockCircleOutlined />}>
            KIỂM TRA
          </Tag>
        );
      },
    },
    {
      title: "Số câu hỏi",
      dataIndex: "totalQuestions",
      key: "totalQuestions",
      align: "center" as const,
      width: 120,
      render: (count: number) => (
        <Tag color="blue" className="rounded-full px-3">
          {count} câu
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: string) => {
        if (status === "PUBLISHED") {
          return (
            <Tag color="success" className="font-medium">
              CÔNG KHAI
            </Tag>
          );
        }
        return (
          <Tag color="warning" className="font-medium">
            BẢN NHÁP
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right" as const,
      width: 380,
      render: (_: any, record: QuizResponse) => (
        <Space size="small">
          {/* NÚT ĐỔI TRẠNG THÁI */}
          <Popconfirm
            title={
              record.status === "PUBLISHED"
                ? "Hủy công khai bài thi này?"
                : "Phát hành bài thi này?"
            }
            description={
              record.status === "PUBLISHED"
                ? "Bài thi sẽ chuyển về dạng Nháp."
                : "Học viên sẽ có thể làm bài thi này."
            }
            onConfirm={() => handleToggleStatus(record)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button
              type="text"
              icon={
                record.status === "PUBLISHED" ? (
                  <EyeInvisibleOutlined />
                ) : (
                  <GlobalOutlined />
                )
              }
              className={
                record.status === "PUBLISHED"
                  ? "text-gray-500 hover:bg-gray-100"
                  : "text-green-600 hover:bg-green-50"
              }
            >
              {record.status === "PUBLISHED" ? "Ẩn bài" : "Phát hành"}
            </Button>
          </Popconfirm>

          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            className="text-blue-600 font-medium hover:bg-blue-50"
          >
            Chi tiết
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenQuizModal(record)}
            className="text-orange-500 hover:bg-orange-50"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa bài thi?"
            description="Tất cả dữ liệu liên quan bài thi này sẽ biến mất."
            onConfirm={() => handleDeleteQuiz(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className="hover:bg-red-50"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <Card
        className="rounded-2xl shadow-sm border-gray-100"
        title={
          <Space className="py-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <UnorderedListOutlined />
            </div>
            <span className="text-lg font-bold text-gray-800">
              Quản lý bài kiểm tra & Đánh giá
            </span>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="rounded-lg shadow-md hover:shadow-lg transition-shadow"
            onClick={() => handleOpenQuizModal()}
          >
            Tạo bài Đánh giá mới
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={quizzes}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={
          <Space>
            {currentQuiz ? (
              <EditOutlined className="text-orange-500 text-xl" />
            ) : (
              <PlusOutlined className="text-blue-500 text-xl" />
            )}
            <span className="text-xl font-bold">
              {currentQuiz ? "Chỉnh sửa bài Đánh giá" : "Tạo bài Đánh giá mới"}
            </span>
          </Space>
        }
        open={isQuizModalOpen}
        onOk={handleSaveQuiz}
        onCancel={() => setIsQuizModalOpen(false)}
        okText="Lưu thông tin"
        cancelText="Hủy"
        destroyOnClose
        centered
        width={450}
      >
        <div className="pt-6 pb-2">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tiêu đề bài kiểm tra <span className="text-red-500">*</span>
            </label>
            <Input
              size="large"
              placeholder="VD: Kiểm tra cuối kỳ Hệ quản trị CSDL"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="rounded-lg"
            />
          </div>

          {currentQuiz && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phân loại <span className="text-red-500">*</span>
              </label>
              <Select
                className="w-full"
                size="large"
                value={quizType}
                onChange={(val) => setQuizType(val)}
              >
                <Option value="TEST">
                  <Space>
                    <ClockCircleOutlined className="text-cyan-600" />
                    Kiểm tra
                  </Space>
                </Option>
                <Option value="EXAM">
                  <Space>
                    <FileDoneOutlined className="text-purple-600" />
                    Kết thúc
                  </Space>
                </Option>
              </Select>
            </div>
          )}

          {!currentQuiz && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <Text type="secondary" className="text-xs">
                💡 Lưu ý: Bài kiểm tra mới sẽ được lưu ở dạng <b>Bản Nháp</b> và
                loại <b>TEST</b> mặc định. Hãy dùng nút <b>"Phát hành"</b> hoặc
                chọn <b>"Sửa"</b> ở bên ngoài bảng sau khi bạn đã thiết lập
                xong.
              </Text>
            </div>
          )}
        </div>
      </Modal>

      {/* DRAWER CHI TIẾT CÂU HỎI */}
      <Drawer
        title={
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2 text-blue-700 pr-4">
              <BookOutlined className="text-xl" />
              <span
                className="font-bold text-lg line-clamp-1"
                title={currentQuiz?.title}
              >
                {currentQuiz?.title}
              </span>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddQuestionModalOpen(true)}
              className="rounded-lg shadow-sm"
            >
              Thêm câu hỏi
            </Button>
          </div>
        }
        placement="right"
        width={650}
        onClose={() => setIsDetailDrawerOpen(false)}
        open={isDetailDrawerOpen}
        destroyOnClose
        styles={{ body: { backgroundColor: "#f8fafc", padding: "20px" } }}
      >
        {!currentQuiz?.questions || currentQuiz.questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full mt-10">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-500 font-medium">
                  Chưa có câu hỏi nào trong bài thi này
                </span>
              }
            />
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setIsAddQuestionModalOpen(true)}
              className="mt-4 text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100"
            >
              Thêm câu hỏi ngay
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pb-10">
            {currentQuiz.questions.map((item, index) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2 items-center">
                    <div className="bg-blue-600 text-white font-bold text-sm px-3 py-1 rounded-lg shadow-sm">
                      Câu {index + 1}
                    </div>
                    <Tag
                      color={item.type === "SINGLE_CHOICE" ? "cyan" : "purple"}
                      className="rounded-md m-0 font-medium border-none"
                    >
                      {item.type === "SINGLE_CHOICE"
                        ? "1 đáp án"
                        : "Nhiều đáp án"}
                    </Tag>
                  </div>
                  <Popconfirm
                    title="Gỡ câu hỏi?"
                    description="Xóa câu hỏi này khỏi bài thi?"
                    onConfirm={() => handleRemoveQuestionFromQuiz(item.id)}
                    okText="Gỡ"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                    placement="left"
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      className="hover:bg-red-50 rounded-lg h-8 w-8 p-0"
                    />
                  </Popconfirm>
                </div>

                <div className="text-gray-800 font-semibold text-base mb-4 leading-relaxed">
                  {item.content}
                </div>

                <div className="space-y-2.5">
                  {item.answers.map((ans, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-xl border ${
                        ans.correct
                          ? "bg-green-50 border-green-200 text-green-800"
                          : "bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.type === "SINGLE_CHOICE" ? (
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              ans.correct
                                ? "border-green-500 bg-green-500"
                                : "border-gray-300"
                            }`}
                          >
                            {ans.correct && (
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                          </div>
                        ) : (
                          <div
                            className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${
                              ans.correct
                                ? "border-green-500 bg-green-500"
                                : "border-gray-300"
                            }`}
                          >
                            {ans.correct && (
                              <CheckOutlined className="text-white text-[10px] font-bold" />
                            )}
                          </div>
                        )}
                      </div>

                      <span
                        className={`flex-1 text-sm ${
                          ans.correct ? "font-semibold" : "font-medium"
                        }`}
                      >
                        {ans.answer}
                      </span>

                      {ans.correct && (
                        <div className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                          Đúng
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Drawer>

      {/* MODAL THÊM CÂU HỎI TỪ NGÂN HÀNG */}
      <Modal
        title={
          <Space>
            <QuestionCircleOutlined className="text-blue-500" />
            <span className="text-lg font-bold">Thêm câu hỏi từ ngân hàng</span>
          </Space>
        }
        open={isAddQuestionModalOpen}
        onCancel={() => setIsAddQuestionModalOpen(false)}
        footer={null}
        width={850}
        centered
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <Text strong className="text-blue-700">
              Bước 1: Chọn danh mục câu hỏi
            </Text>
            <Select
              className="w-full mt-2"
              placeholder="Chọn danh mục..."
              size="large"
              value={selectedCatId || undefined}
              onChange={(val) => setSelectedCatId(val)}
              options={categories.map((c) => ({
                label: `${c.name} (${c.totalQuestions} câu)`,
                value: c.id,
              }))}
            />
          </div>
          <Divider orientation="horizontal" className="m-0">
            <Tag color="orange">Bước 2: Chọn câu hỏi để thêm</Tag>
          </Divider>
          <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {!selectedCatId ? (
              <div className="text-center py-16">
                <Empty description="Vui lòng chọn danh mục ở trên" />
              </div>
            ) : bankQuestions.length === 0 ? (
              <Empty description="Danh mục này hiện chưa có câu hỏi nào." />
            ) : (
              <div className="space-y-4">
                {bankQuestions.map((item) => (
                  <Card
                    key={item.id}
                    size="small"
                    className="hover:border-blue-400 transition-all shadow-sm"
                    title={
                      <Space>
                        <Tag
                          color={
                            item.type === "SINGLE_CHOICE" ? "blue" : "purple"
                          }
                        >
                          {item.type === "SINGLE_CHOICE"
                            ? "Một đáp án"
                            : "Nhiều đáp án"}
                        </Tag>
                        <Text strong className="text-gray-700">
                          Nội dung câu hỏi:
                        </Text>
                      </Space>
                    }
                    extra={
                      <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        loading={addQuestionLoading}
                        onClick={() => handleAddQuestionToQuiz(item.id)}
                      >
                        Thêm vào Quiz
                      </Button>
                    }
                  >
                    <div className="mb-3 px-2 py-1 bg-gray-50 rounded italic text-gray-800">
                      "{item.content}"
                    </div>
                    <div className="pl-4 space-y-1.5 border-l-2 border-gray-100">
                      {item.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-2 p-1.5 rounded-md ${
                            opt.correct
                              ? "bg-green-50 border border-green-100"
                              : ""
                          }`}
                        >
                          {item.type === "SINGLE_CHOICE" ? (
                            <div
                              className={`w-3 h-3 rounded-full border ${
                                opt.correct
                                  ? "bg-green-500 border-green-600"
                                  : "border-gray-300"
                              }`}
                            />
                          ) : (
                            <div
                              className={`w-3 h-3 border ${
                                opt.correct
                                  ? "bg-green-500 border-green-600"
                                  : "border-gray-300"
                              }`}
                            />
                          )}
                          <span
                            className={
                              opt.correct
                                ? "text-green-700 font-semibold"
                                : "text-gray-600 text-sm"
                            }
                          >
                            {opt.answer}
                          </span>
                          {opt.correct && (
                            <Tag
                              color="success"
                              className="ml-auto text-[10px]"
                            >
                              Đáp án đúng
                            </Tag>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuizList;
