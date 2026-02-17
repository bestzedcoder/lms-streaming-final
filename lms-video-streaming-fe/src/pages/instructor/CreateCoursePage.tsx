import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Typography,
  Card,
  Space,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  RocketOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { instructorService } from "../../services/instructor.service";
import { publicService } from "../../services/public.service";
import { notify } from "../../utils/notification.utils";
import type { CategoryPublicResponse } from "../../types/public.types";

const { Title, Text } = Typography;
const { Option } = Select;

const CreateCoursePage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryPublicResponse[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await publicService.getCategories();
        if (res.data) setCategories(res.data);
      } catch (error) {
        console.error("Lỗi lấy danh mục", error);
      }
    };
    fetchCategories();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
      .replace(/[đĐ]/g, "d")
      .replace(/([^0-9a-z-\s])/g, "") // Bỏ ký tự đặc biệt
      .replace(/(\s+)/g, "-") // Thay khoảng trắng bằng gạch ngang
      .replace(/-+/g, "-") // Xóa gạch ngang trùng
      .replace(/^-+|-+$/g, ""); // Xóa gạch ngang đầu cuối

    form.setFieldsValue({ slug });
  };

  const handleImageChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const url = URL.createObjectURL(newFileList[0].originFileObj);
      setPreviewImage(url);
    } else {
      setPreviewImage(null);
    }
  };

  const convertArrayToHtml = (arr: string[]) => {
    const validItems = arr.filter((item) => item && item.trim() !== "");
    if (validItems.length === 0) return "";
    return `<ul>${validItems.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;
      const requirementsHtml = convertArrayToHtml(values.requirementsList);
      await instructorService.createCourse(
        {
          title: values.title,
          slug: values.slug,
          description: values.description,
          descriptionShort: values.descriptionShort,
          level: values.level,
          categorySlug: values.categorySlug,
          requirements: requirementsHtml,
        },
        imageFile,
      );

      notify.success("Khởi tạo thành công", "Khóa học mới đã được tạo!");
      navigate(`/instructor/courses`);
    } catch (error: any) {
      notify.error(
        "Thất bại",
        error.response?.data?.message || "Không thể tạo khóa học",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto py-6">
      <Button
        icon={<ArrowLeftOutlined />}
        type="text"
        className="mb-4 hover:bg-gray-100 text-gray-500"
        onClick={() => navigate("/instructor/courses")}
      >
        Quay lại danh sách
      </Button>

      <div className="mb-8">
        <Title level={2} className="!mb-2 !mt-0">
          Tạo khóa học mới
        </Title>
        <Text type="secondary" className="text-base">
          Bước đầu tiên để chia sẻ kiến thức. Hãy điền các thông tin cơ bản
          nhất.
        </Text>
      </div>

      <Card bordered={false} className="shadow-lg rounded-xl overflow-hidden">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
          initialValues={{ level: "BEGINNER" }}
        >
          <Row gutter={32}>
            <Col span={24} lg={16}>
              <Form.Item
                name="title"
                label={<span className="font-semibold">Tên khóa học</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập tên khóa học" },
                  { min: 10, message: "Tên khóa học nên dài hơn 10 ký tự" },
                ]}
              >
                <Input
                  placeholder="Ví dụ: Lập trình ReactJS Pro..."
                  onChange={handleTitleChange}
                  count={{ show: true, max: 120 }}
                />
              </Form.Item>

              <Form.Item
                name="slug"
                label={<span className="font-semibold">Đường dẫn (Slug)</span>}
                rules={[
                  { required: true, message: "Slug không được để trống" },
                ]}
              >
                <Input prefix="/" placeholder="lap-trinh-reactjs-pro" />
              </Form.Item>

              <Form.Item
                name="descriptionShort"
                label={
                  <Space>
                    <span className="font-semibold">Mô tả ngắn</span>
                    <Tooltip title="Hiển thị trên Card khóa học ở trang danh sách. Nên viết ngắn gọn, súc tích (khoảng 2-3 câu).">
                      <InfoCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  </Space>
                }
                rules={[
                  { max: 250, message: "Mô tả ngắn không quá 250 ký tự" },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Tóm tắt nội dung khóa học trong 1 đoạn ngắn..."
                  showCount
                  maxLength={250}
                />
              </Form.Item>

              <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">
                  Yêu cầu / Kiến thức đầu vào
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    (Nhập từng yêu cầu một)
                  </span>
                </label>

                <Form.List name="requirementsList">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className="flex items-center gap-2 mb-3">
                          <UnorderedListOutlined className="text-gray-400" />
                          <Form.Item
                            {...restField}
                            name={[name]}
                            className="flex-1 mb-0"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Vui lòng nhập yêu cầu hoặc xóa dòng này",
                              },
                            ]}
                          >
                            <Input placeholder="Ví dụ: Máy tính kết nối Internet" />
                          </Form.Item>
                          {fields.length > 1 && (
                            <MinusCircleOutlined
                              className="text-red-500 cursor-pointer hover:text-red-700 text-lg"
                              onClick={() => remove(name)}
                            />
                          )}
                        </div>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                          className="mt-1"
                        >
                          Thêm yêu cầu
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>

              <Form.Item
                name="description"
                label={<span className="font-semibold">Mô tả chi tiết</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả chi tiết" },
                  { min: 20, message: "Mô tả nên dài ít nhất 20 ký tự" },
                ]}
              >
                <Input.TextArea
                  rows={8}
                  placeholder="Giới thiệu chi tiết về khóa học: Mục tiêu, đối tượng, kết quả đạt được..."
                />
              </Form.Item>
            </Col>

            <Col span={24} lg={8}>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 h-full">
                <h4 className="font-bold text-gray-700 mb-4">Phân loại</h4>

                <Form.Item
                  name="categorySlug"
                  label="Danh mục"
                  rules={[
                    { required: true, message: "Vui lòng chọn danh mục" },
                  ]}
                >
                  <Select
                    placeholder="-- Chọn lĩnh vực --"
                    showSearch
                    optionFilterProp="children"
                  >
                    {categories.map((cat) => (
                      <Option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="level"
                  label="Trình độ"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="BEGINNER">Cơ bản (Beginner)</Option>
                    <Option value="INTERMEDIATE">
                      Trung cấp (Intermediate)
                    </Option>
                    <Option value="ADVANCED">Nâng cao (Advanced)</Option>
                  </Select>
                </Form.Item>

                <div className="mt-6">
                  <h4 className="font-bold text-gray-700 mb-2">
                    Ảnh bìa (Thumbnail)
                  </h4>
                  <Form.Item name="image">
                    <Upload
                      listType="picture-card"
                      maxCount={1}
                      beforeUpload={() => false}
                      onChange={handleImageChange}
                      accept="image/png, image/jpeg, image/jpg"
                      showUploadList={false}
                      className="w-full"
                    >
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="thumbnail"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <UploadOutlined className="text-2xl mb-2" />
                          <div className="text-xs">Nhấn để tải ảnh</div>
                        </div>
                      )}
                    </Upload>
                    <Text
                      type="secondary"
                      className="text-xs block mt-2 text-center"
                    >
                      Kích thước: 1280x720 (16:9).
                      <br />
                      Max: 5MB.
                    </Text>
                  </Form.Item>
                </div>
              </div>
            </Col>
          </Row>

          <div className="flex justify-end pt-6 border-t mt-6">
            <Space size="middle">
              <Button
                size="large"
                onClick={() => navigate("/instructor/courses")}
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                icon={<RocketOutlined />}
                className="bg-indigo-600 hover:bg-indigo-500 shadow-md min-w-[180px]"
              >
                Tạo khóa học
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateCoursePage;
