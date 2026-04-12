import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  Modal,
  Input,
  Radio,
  Checkbox,
  Card,
  Space,
  Tag,
  Popconfirm,
  message,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type {
  OptionCreatingRequest,
  QuestionCategoryResponse,
  QuestionResponse,
} from "../../../@types/instructor.types";
import { instructorService } from "../../../services/instructor.service";

const { TextArea } = Input;

interface OptionFormState {
  uiId: string;
  answer: string;
  correct: boolean;
}

const QuestionBank: React.FC = () => {
  const [categories, setCategories] = useState<QuestionCategoryResponse[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<string>("");

  const [modalCategoryId, setModalCategoryId] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [type, setType] = useState<"SINGLE_CHOICE" | "MULTIPLE_CHOICE">(
    "SINGLE_CHOICE",
  );
  const [options, setOptions] = useState<OptionFormState[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await instructorService.getQuestionCategories();
      setCategories(res.data || []);
    } catch (error) {
      message.error("Lỗi lấy danh sách danh mục!");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchQuestions = async () => {
    if (!selectedCategoryId) {
      setQuestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await instructorService.getQuestions({
        q: selectedCategoryId,
      });
      setQuestions(res.data || []);
    } catch (error) {
      message.error("Lỗi lấy danh sách câu hỏi!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategoryId]);

  const handleOpenModal = (question?: QuestionResponse) => {
    if (question) {
      setEditingId(question.id);
      setModalCategoryId(selectedCategoryId);
      setContent(question.content);
      setType(question.type);

      const mappedOptions: OptionFormState[] = question.options.map(
        (opt, index) => ({
          uiId: `ui-${Date.now()}-${index}`,
          answer: opt.answer,
          correct: opt.correct,
        }),
      );
      setOptions(mappedOptions);

      const pureOptions = mappedOptions.map(({ answer, correct }) => ({
        answer,
        correct,
      }));
      setOriginalData(
        JSON.stringify({
          content: question.content,
          type: question.type,
          options: pureOptions,
        }),
      );
    } else {
      setEditingId(null);
      setModalCategoryId(selectedCategoryId);
      setContent("");
      setType("SINGLE_CHOICE");
      setOptions([]);
      setOriginalData("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleOptionChange = (
    uiId: string,
    field: "answer" | "correct",
    value: string | boolean,
  ) => {
    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.uiId !== uiId) {
          if (
            field === "correct" &&
            value === true &&
            type === "SINGLE_CHOICE"
          ) {
            return { ...opt, correct: false };
          }
          return opt;
        }
        return { ...opt, [field]: value };
      }),
    );
  };

  const addOption = () => {
    setOptions([
      ...options,
      { uiId: `ui-${Date.now()}-${Math.random()}`, answer: "", correct: false },
    ]);
  };

  const removeOption = (uiId: string) => {
    setOptions(options.filter((opt) => opt.uiId !== uiId));
  };

  const handleChangeType = (e: any) => {
    const newType = e.target.value;
    setType(newType);
    if (newType === "SINGLE_CHOICE") {
      setOptions(options.map((opt) => ({ ...opt, correct: false })));
    }
  };

  const handleSubmit = async () => {
    if (!modalCategoryId) return message.warning("Vui lòng chọn danh mục.");
    if (!content.trim())
      return message.warning("Vui lòng nhập nội dung câu hỏi.");
    if (options.length === 0)
      return message.warning("Phải tạo ít nhất 1 đáp án.");
    if (options.some((opt) => !opt.answer.trim()))
      return message.warning("Nội dung các đáp án không được để trống.");
    if (!options.some((opt) => opt.correct))
      return message.warning("Phải chọn ít nhất 1 đáp án đúng.");

    const payloadOptions: OptionCreatingRequest[] = options.map(
      ({ answer, correct }) => ({ answer, correct }),
    );

    try {
      if (editingId) {
        const currentDataString = JSON.stringify({
          content,
          type,
          options: payloadOptions,
        });
        if (currentDataString === originalData) {
          handleCloseModal();
          return;
        }
        await instructorService.updateQuestion({
          id: editingId,
          content,
          type,
          options: payloadOptions,
        });
        message.success("Cập nhật câu hỏi thành công!");
        fetchQuestions();
      } else {
        await instructorService.createQuestion({
          categoryId: modalCategoryId,
          content,
          type,
          options: payloadOptions,
        });
        message.success("Tạo câu hỏi thành công!");
        setSelectedCategoryId("");
      }
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu dữ liệu!");
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await instructorService.deleteQuestion(id);
      message.success("Đã xóa câu hỏi!");
      fetchQuestions();
      fetchCategories();
    } catch (error) {
      message.error("Lỗi khi xóa câu hỏi!");
    }
  };

  const currentCategoryName =
    categories.find((c) => c.id === modalCategoryId)?.name || "Chưa xác định";

  return (
    <div className="bg-white p-6 rounded-lg">
      {/* FILTER & ADD BUTTON */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b pb-4">
        <Space align="center">
          <span className="font-medium text-gray-700">Chọn danh mục:</span>
          <Select
            showSearch
            placeholder="-- Vui lòng chọn danh mục --"
            optionFilterProp="children"
            style={{ width: 280 }}
            value={selectedCategoryId || undefined}
            onChange={(value) => setSelectedCategoryId(value)}
            options={categories.map((c) => ({
              value: c.id,
              label: `${c.name} (${c.totalQuestions} câu)`,
            }))}
          />
        </Space>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          Thêm câu hỏi
        </Button>
      </div>

      {/* QUESTION LIST */}
      <div className="space-y-4">
        {!selectedCategoryId ? (
          <Empty description="Hãy chọn một danh mục ở trên để tải danh sách câu hỏi." />
        ) : isLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : questions.length === 0 ? (
          <Empty description="Danh mục này chưa có câu hỏi nào." />
        ) : (
          questions.map((q) => (
            <Card
              key={q.id}
              size="small"
              className="shadow-sm hover:shadow-md transition-shadow"
              title={
                <Tag color={q.type === "SINGLE_CHOICE" ? "blue" : "green"}>
                  {q.type === "SINGLE_CHOICE" ? "Một đáp án" : "Nhiều đáp án"}
                </Tag>
              }
              extra={
                <Space>
                  <Button
                    type="text"
                    className="text-blue-600"
                    icon={<EditOutlined />}
                    onClick={() => handleOpenModal(q)}
                  >
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Xóa câu hỏi"
                    description="Bạn có chắc chắn muốn xóa câu hỏi này không?"
                    onConfirm={() => handleDeleteQuestion(q.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                  >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                      Xóa
                    </Button>
                  </Popconfirm>
                </Space>
              }
            >
              <div className="mb-4">
                <span className="font-semibold text-gray-800">Câu hỏi: </span>
                <span className="text-gray-900">{q.content}</span>
              </div>

              {/* Hiển thị đáp án trực quan bằng Radio/Checkbox disabled */}
              <Space direction="vertical" className="w-full pl-4">
                {q.options.map((opt, i) => (
                  <div key={i} className="flex items-center">
                    {q.type === "SINGLE_CHOICE" ? (
                      <Radio checked={opt.correct} disabled>
                        <span
                          className={
                            opt.correct
                              ? "text-green-600 font-medium"
                              : "text-gray-600"
                          }
                        >
                          {opt.answer}
                        </span>
                      </Radio>
                    ) : (
                      <Checkbox checked={opt.correct} disabled>
                        <span
                          className={
                            opt.correct
                              ? "text-green-600 font-medium"
                              : "text-gray-600"
                          }
                        >
                          {opt.answer}
                        </span>
                      </Checkbox>
                    )}
                  </div>
                ))}
              </Space>
            </Card>
          ))
        )}
      </div>

      {/* MODAL THÊM/SỬA */}
      <Modal
        title={editingId ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        okText={editingId ? "Lưu thay đổi" : "Tạo câu hỏi"}
        cancelText="Hủy"
        width={700}
        destroyOnClose
      >
        <div className="space-y-5 pt-4">
          {/* Category Selection */}
          <div>
            <div className="mb-2 font-medium text-gray-700">
              Danh mục câu hỏi <span className="text-red-500">*</span>
            </div>
            {editingId ? (
              <Input disabled value={currentCategoryName} />
            ) : (
              <Select
                showSearch
                placeholder="-- Chọn danh mục --"
                optionFilterProp="children"
                style={{ width: "100%" }}
                value={modalCategoryId || undefined}
                onChange={(value) => setModalCategoryId(value)}
                options={categories.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
              />
            )}
          </div>

          {/* Content */}
          <div>
            <div className="mb-2 font-medium text-gray-700">
              Nội dung câu hỏi <span className="text-red-500">*</span>
            </div>
            <TextArea
              rows={3}
              placeholder="Nhập nội dung câu hỏi..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Type Selection */}
          <div>
            <div className="mb-2 font-medium text-gray-700">Loại câu hỏi</div>
            <Radio.Group onChange={handleChangeType} value={type}>
              <Radio value="SINGLE_CHOICE">Một đáp án</Radio>
              <Radio value="MULTIPLE_CHOICE">Nhiều đáp án</Radio>
            </Radio.Group>
          </div>

          {/* Options */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium text-gray-700">Các đáp án</div>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={addOption}
                size="small"
              >
                Thêm đáp án
              </Button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {options.length === 0 && (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Chưa có đáp án nào"
                />
              )}
              {options.map((opt, index) => (
                <div
                  key={opt.uiId}
                  className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <div className="pt-1">
                    {type === "SINGLE_CHOICE" ? (
                      <Radio
                        checked={opt.correct}
                        onChange={(e) =>
                          handleOptionChange(
                            opt.uiId,
                            "correct",
                            e.target.checked,
                          )
                        }
                      />
                    ) : (
                      <Checkbox
                        checked={opt.correct}
                        onChange={(e) =>
                          handleOptionChange(
                            opt.uiId,
                            "correct",
                            e.target.checked,
                          )
                        }
                      />
                    )}
                  </div>
                  <Input
                    placeholder={`Nhập đáp án ${index + 1}...`}
                    value={opt.answer}
                    onChange={(e) =>
                      handleOptionChange(opt.uiId, "answer", e.target.value)
                    }
                  />
                  <Button
                    type="text"
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => removeOption(opt.uiId)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuestionBank;
