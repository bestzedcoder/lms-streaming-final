import { Form, Select, Input, Button, Alert } from "antd";

type Props = {
  slug: string;
};

const CourseReportTab: React.FC<Props> = ({ slug }) => (
  <div className="max-w-2xl">
    <Alert
      message="Báo cáo khóa học"
      description="Nếu bạn thấy khóa học này vi phạm tiêu chuẩn cộng đồng hoặc bản quyền, hãy cho chúng tôi biết."
      type="warning"
      showIcon
      className="mb-6"
    />
    <Form layout="vertical">
      <Form.Item label="Lý do báo cáo" required>
        <Select placeholder="Chọn lý do">
          <Select.Option value="copyright">Vi phạm bản quyền</Select.Option>
          <Select.Option value="content">Nội dung không phù hợp</Select.Option>
          <Select.Option value="spam">Spam/Lừa đảo</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Chi tiết bổ sung">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Button type="primary" danger>
        Gửi báo cáo vi phạm
      </Button>
    </Form>
  </div>
);

export default CourseReportTab;
