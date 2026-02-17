import {
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  Upload,
  Image,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { instructorService } from "../services/instructor.service";
import { publicService } from "../services/public.service";
import { notify } from "../utils/notification.utils";
import { formatNumber } from "../utils/format.utils";
import type { InstructorCourseResponse } from "../types/instructor.types";

interface Props {
  course: InstructorCourseResponse;
  onRefresh: () => void;
}

const CourseBasicInfo = ({ course, onRefresh }: Props) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    publicService.getCategories().then((res) => {
      if (res.data) setCategories(res.data);
    });
  }, []);

  const parseRequirementsToArray = (htmlString?: string) => {
    if (!htmlString) return [""]; 
    const matches = htmlString.match(/<li[^>]*>(.*?)<\/li>/g);
    if (matches) {
      return matches.map((item) => item.replace(/<\/?li>/g, ""));
    }
    return htmlString.split("\n");
  };

  const convertArrayToHtml = (arr: string[]) => {
    const validItems = arr.filter((item) => item && item.trim() !== "");
    if (validItems.length === 0) return "";
    return `<ul>${validItems.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const image = fileList.length > 0 ? fileList[0].originFileObj : null;
      const requirementsHtml = convertArrayToHtml(values.requirementsList);
      await instructorService.updateCourse(
        {
          ...values,
          id: course.id,
          requirements: requirementsHtml,
        },
        image,
      );
      notify.success("Thành công", "Đã lưu thông tin khóa học");
      onRefresh();
    } catch (error) {
      notify.error("Lỗi", "Không thể lưu thông tin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...course,
        categorySlug: course?.category?.slug,
        descriptionShort: course.descriptionShort,
        requirementsList: parseRequirementsToArray(course.requirements),
      }}
      className="max-w-4xl"
    >
      <Form.Item
        name="title"
        label="Tên khóa học"
        rules={[{ required: true, min: 10 }]}
      >
        <Input size="large" placeholder="Nhập tên khóa học hấp dẫn..." />
      </Form.Item>

      <Form.Item
        name="descriptionShort"
        label={
          <div className="flex items-center gap-2">
            <span>Mô tả ngắn</span>
            <Tooltip title="Hiển thị trên thẻ khóa học (Card) ở trang danh sách. Nên viết ngắn gọn, súc tích.">
              <InfoCircleOutlined className="text-gray-400" />
            </Tooltip>
          </div>
        }
        rules={[{ required: true, message: "Vui lòng nhập mô tả ngắn" }]}
      >
        <Input.TextArea
          rows={3}
          showCount
          maxLength={250}
          placeholder="Tóm tắt nội dung khóa học trong 2-3 câu..."
        />
      </Form.Item>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="price"
            label="Giá gốc (VNĐ)"
            rules={[{ required: true }]}
          >
            <InputNumber
              className="w-full"
              min={0}
              size="large"
              formatter={(value) => formatNumber(value)}
              parser={(value) => value?.replace(/\./g, "") as unknown as number}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="salePrice" label="Giá khuyến mãi (VNĐ)">
            <InputNumber
              className="w-full"
              min={0}
              size="large"
              formatter={(value) => formatNumber(value)}
              parser={(value) => value?.replace(/\./g, "") as unknown as number}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="level" label="Trình độ" rules={[{ required: true }]}>
            <Select size="large">
              <Select.Option value="BEGINNER">Cơ bản (Beginner)</Select.Option>
              <Select.Option value="INTERMEDIATE">
                Trung cấp (Intermediate)
              </Select.Option>
              <Select.Option value="ADVANCED">
                Nâng cao (Advanced)
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="categorySlug"
            label="Danh mục"
            rules={[{ required: true }]}
          >
            <Select size="large" placeholder="Chọn danh mục" showSearch>
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.slug}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
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
                        message: "Vui lòng nhập yêu cầu hoặc xóa dòng này",
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
        label="Mô tả chi tiết"
        rules={[
          { required: true, message: "Vui lòng nhập mô tả chi tiết" },
          { min: 20, message: "Mô tả nên dài ít nhất 20 ký tự" },
        ]}
      >
        <Input.TextArea
          rows={8}
          placeholder="Mô tả chi tiết nội dung khóa học, học viên sẽ học được gì..."
        />
      </Form.Item>

      <Form.Item label="Ảnh bìa khóa học">
        <div className="flex items-start gap-6">
          <div className="shrink-0">
            {course.thumbnail ? (
              <Image
                src={course.thumbnail}
                width={200}
                className="rounded-lg shadow-sm"
              />
            ) : (
              <div className="w-[200px] h-[112px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                Chưa có ảnh
              </div>
            )}
          </div>
          <div className="flex-1">
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
            <p className="text-gray-400 text-xs mt-2">
              Kích thước chuẩn: 1280x720 (16:9). File hỗ trợ: JPG, PNG.
            </p>
          </div>
        </div>
      </Form.Item>

      <Form.Item className="mt-8">
        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          size="large"
          loading={loading}
          className="px-8"
        >
          Lưu thay đổi
        </Button>
      </Form.Item>
    </Form>
  );
};
export default CourseBasicInfo;
