import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Modal,
  Input,
  Drawer,
  List,
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
} from "@ant-design/icons";
import { instructorService } from "../../../services/instructor.service";
import type {
  QuizResponse,
  QuestionCategoryResponse,
  QuestionResponse,
} from "../../../@types/instructor.types";

const { Text } = Typography;

const QuizList: React.FC = () => {
  // --- STATES DỮ LIỆU ---
  const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
  const [categories, setCategories] = useState<QuestionCategoryResponse[]>([]);
  const [bankQuestions, setBankQuestions] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // --- STATES ĐIỀU KHIỂN UI ---
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [quizStatus, setQuizStatus] = useState<"PUBLISHED" | "DRAFT">("DRAFT");

  // --- STATES LÀM VIỆC ---
  const [currentQuiz, setCurrentQuiz] = useState<QuizResponse | null>(null);
  const [quizTitle, setQuizTitle] = useState("");
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
      setQuizStatus((quiz as any).status || "DRAFT");
    } else {
      setCurrentQuiz(null);
      setQuizTitle("");
      setQuizStatus("DRAFT");
    }
    setIsQuizModalOpen(true);
  };

  const handleSaveQuiz = async () => {
    if (!quizTitle.trim()) return message.warning("Vui lòng nhập tiêu đề");
    try {
      if (currentQuiz) {
        await instructorService.updateQuiz({
          id: currentQuiz.id,
          title: quizTitle,
          status: quizStatus,
        });
        message.success("Đã cập nhật bài Quiz thành công");
      } else {
        await instructorService.createQuiz({ title: quizTitle });
        message.success("Đã tạo bài Quiz mới");
      }
      setIsQuizModalOpen(false);
      fetchQuizzes();
    } catch (error) {
      message.error("Lỗi khi lưu bài Quiz");
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    try {
      await instructorService.deleteQuiz(id);
      message.success("Đã xóa bài Quiz");
      fetchQuizzes();
    } catch (error) {
      message.error("Lỗi khi xóa bài Quiz");
    }
  };

  // --- XỬ LÝ CHI TIẾT CÂU HỎI (DETAIL DRAWER) ---
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
          setCurrentQuiz(updated); // Update drawer
          return updated;
        }
        return q;
      });
      setQuizzes(updatedQuizzes);
    } catch (error) {
      message.error("Lỗi khi gỡ câu hỏi");
    }
  };

  // --- XỬ LÝ THÊM CÂU HỎI (ADD MODAL) ---
  const handleAddQuestionToQuiz = async (questionId: string) => {
    if (!currentQuiz) return;
    setAddQuestionLoading(true);
    try {
      await instructorService.addQuizQuestion({
        quizId: currentQuiz.id,
        questionId,
      });
      message.success("Đã thêm câu hỏi vào bài Quiz");
      // Sau khi thêm, tải lại danh sách Quiz để đồng bộ Drawer
      fetchQuizzes().then(() => {
        // Cập nhật currentQuiz cho Drawer từ mảng mới fetch về
        const updatedQuiz = quizzes.find((q) => q.id === currentQuiz.id);
        if (updatedQuiz) setCurrentQuiz(updatedQuiz);
      });
    } catch (error) {
      message.error("Câu hỏi đã tồn tại trong bài thi hoặc lỗi hệ thống");
    } finally {
      setAddQuestionLoading(false);
    }
  };

  // Cấu hình bảng Quiz
  const columns = [
    {
      title: "Tiêu đề bài kiểm tra",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Số câu hỏi",
      dataIndex: "totalQuestions",
      key: "totalQuestions",
      align: "center" as const,
      render: (count: number) => <Tag color="blue">{count} câu</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => {
        const statusConfig: any = {
          PUBLISHED: { color: "green", text: "Công khai" },
          DRAFT: { color: "orange", text: "Bản nháp" },
        };
        const config = statusConfig[status] || { color: "blue", text: status };
        return (
          <Tag color={config.color} className="font-medium">
            {config.text.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right" as const,
      render: (_: any, record: QuizResponse) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            className="text-blue-600 font-medium"
          >
            Chi tiết
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenQuizModal(record)}
            className="text-orange-500"
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
            <Button type="text" danger icon={<DeleteOutlined />}>
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
        title={
          <Space>
            <UnorderedListOutlined />
            <span>Quản lý bài kiểm tra</span>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenQuizModal()}
          >
            Tạo bài Quiz mới
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

      {/* MODAL TẠO/SỬA QUIZ */}
      <Modal
        title={
          <Space>
            {currentQuiz ? (
              <EditOutlined className="text-orange-500" />
            ) : (
              <PlusOutlined className="text-blue-500" />
            )}
            <span className="text-lg font-bold">
              {currentQuiz ? "Cập nhật bài Quiz" : "Tạo bài Quiz mới"}
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
      >
        <div className="space-y-5 pt-4">
          {/* Phần nhập Tiêu đề */}
          <div>
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

          {/* Phần chọn Trạng thái (Chỉ hiển thị khi Sửa) */}
          {currentQuiz && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Trạng thái phát hành
              </label>
              <Select
                className="w-full"
                size="large"
                value={quizStatus}
                onChange={(val) => setQuizStatus(val)}
              >
                <Option value="DRAFT">
                  <Space>
                    <Tag color="warning" className="m-0">
                      DRAFT
                    </Tag>
                    <span className="text-gray-500 text-xs">
                      - Chỉ giảng viên nhìn thấy
                    </span>
                  </Space>
                </Option>
                <Option value="PUBLISHED">
                  <Space>
                    <Tag color="success" className="m-0">
                      PUBLISHED
                    </Tag>
                    <span className="text-gray-500 text-xs">
                      - Công khai cho học viên làm bài
                    </span>
                  </Space>
                </Option>
              </Select>
            </div>
          )}

          {/* Note nhỏ cho người dùng */}
          {!currentQuiz && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <Text type="secondary" className="text-xs">
                💡 Lưu ý: Bài Quiz mới tạo sẽ được để ở trạng thái <b>DRAFT</b>{" "}
                mặc định. Bạn có thể thay đổi trạng thái sau khi đã thêm đủ câu
                hỏi.
              </Text>
            </div>
          )}
        </div>
      </Modal>

      {/* DRAWER CHI TIẾT CÂU HỎI (XUẤT HIỆN BÊN PHẢI) */}
      <Drawer
        title={
          <div className="flex justify-between items-center w-full pr-4">
            <span>Chi tiết: {currentQuiz?.title}</span>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setIsAddQuestionModalOpen(true)}
            >
              Thêm câu hỏi
            </Button>
          </div>
        }
        placement="right"
        width={600}
        onClose={() => setIsDetailDrawerOpen(false)}
        open={isDetailDrawerOpen}
        destroyOnClose
      >
        {!currentQuiz?.questions || currentQuiz.questions.length === 0 ? (
          <Empty description="Chưa có câu hỏi nào trong bài thi này" />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={currentQuiz.questions}
            renderItem={(item, index) => (
              <List.Item
                className="hover:bg-gray-50 transition-all p-4 rounded-lg mb-2 border"
                extra={
                  <Popconfirm
                    title="Gỡ câu hỏi?"
                    onConfirm={() => handleRemoveQuestionFromQuiz(item.id)}
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                }
              >
                <div className="mb-2">
                  <Tag color="cyan">Câu {index + 1}</Tag>
                  <Tag
                    color={item.type === "SINGLE_CHOICE" ? "blue" : "purple"}
                  >
                    {item.type === "SINGLE_CHOICE"
                      ? "1 đáp án"
                      : "Nhiều đáp án"}
                  </Tag>
                </div>
                <Text strong>{item.content}</Text>
                <div className="mt-2 pl-4">
                  {item.answers.map((ans, i) => (
                    <div
                      key={i}
                      className={
                        ans.correct
                          ? "text-green-600 font-medium"
                          : "text-gray-500 text-sm"
                      }
                    >
                      {ans.correct ? "● " : "○ "} {ans.answer}
                    </div>
                  ))}
                </div>
              </List.Item>
            )}
          />
        )}
      </Drawer>

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
        width={850} // Tăng chiều rộng để hiển thị đáp án thoải mái hơn
        centered
      >
        <div className="space-y-4">
          {/* 1. Chọn Category */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <Text strong className="text-blue-700">
              Bước 1: Chọn danh mục câu hỏi
            </Text>
            <Select
              className="w-full mt-2"
              placeholder="Chọn danh mục (VD: Java Core, Spring Boot...)"
              size="large"
              value={selectedCatId || undefined}
              onChange={(val) => setSelectedCatId(val)}
              options={categories.map((c) => ({
                label: `${c.name} (${c.totalQuestions} câu)`,
                value: c.id,
              }))}
            />
          </div>

          <Divider orientation="left" className="m-0">
            <Tag color="orange">Bước 2: Chọn câu hỏi để thêm</Tag>
          </Divider>

          {/* 2. Danh sách kết quả có nội dung chi tiết */}
          <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {!selectedCatId ? (
              <div className="text-center py-16">
                <Empty description="Vui lòng chọn danh mục ở trên để hiển thị ngân hàng câu hỏi" />
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
                    {/* Nội dung câu hỏi */}
                    <div className="mb-3 px-2 py-1 bg-gray-50 rounded italic text-gray-800">
                      "{item.content}"
                    </div>

                    {/* Danh sách đáp án của câu hỏi trong ngân hàng */}
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
                          {/* Icon hiển thị đúng/sai */}
                          {item.type === "SINGLE_CHOICE" ? (
                            <div
                              className={`w-3 h-3 rounded-full border ${opt.correct ? "bg-green-500 border-green-600" : "border-gray-300"}`}
                            />
                          ) : (
                            <div
                              className={`w-3 h-3 border ${opt.correct ? "bg-green-500 border-green-600" : "border-gray-300"}`}
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
