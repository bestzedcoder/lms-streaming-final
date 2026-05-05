import React, { useEffect, useState } from "react";
import {
  List,
  Input,
  Button,
  Rate,
  Avatar,
  Typography,
  message,
  Spin,
  Divider,
  Empty,
} from "antd";
import { UserOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";
import { studentService } from "../../../services/student.service";
import type {
  ReviewRequest,
  ReviewResponse,
} from "../../../@types/student.types";

const { Title, Text } = Typography;

type Props = {
  slug: string;
};

// Map Enum từ Backend sang Number cho Ant Design Rate
const rateMap: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};
const reverseRateMap: Record<
  number,
  "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE"
> = {
  1: "ONE",
  2: "TWO",
  3: "THREE",
  4: "FOUR",
  5: "FIVE",
};

const CourseDiscussionTab: React.FC<Props> = ({ slug }) => {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [myReview, setMyReview] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [rateValue, setRateValue] = useState<number>(5);
  const [content, setContent] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allRes, myRes] = await Promise.all([
        studentService.getReviews(slug),
        studentService.getReviewByStudent(slug).catch(() => ({ data: null })), // Tránh crash nếu 404
      ]);

      setReviews(allRes.data || []);

      if (myRes.data) {
        setMyReview(myRes.data);
        setRateValue(rateMap[myRes.data.rate]);
        setContent(myRes.data.content);
      }
    } catch (error) {
      message.error("Không thể tải dữ liệu đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const handleSubmit = async () => {
    if (!content.trim())
      return message.warning("Vui lòng nhập nội dung đánh giá");

    setSubmitting(true);
    const payload: ReviewRequest = {
      rate: reverseRateMap[rateValue],
      content: content,
    };

    try {
      if (myReview) {
        await studentService.updateReview(payload, slug);
        message.success("Cập nhật đánh giá thành công");
      } else {
        await studentService.createReview(payload, slug);
        message.success("Gửi đánh giá thành công");
      }
      fetchData(); // Refresh danh sách
    } catch (error) {
      message.error("Gửi đánh giá thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 animate-fade-in">
      <Spin spinning={loading}>
        {/* Phần viết/sửa đánh giá của bản thân */}
        <div className="mb-10 p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
          <Title level={4} className="!mb-4">
            {myReview ? (
              <>
                <EditOutlined /> Chỉnh sửa đánh giá của bạn
              </>
            ) : (
              "Viết đánh giá của bạn"
            )}
          </Title>

          <div className="mb-4">
            <Text type="secondary" className="block mb-2">
              Bạn cảm thấy khóa học này thế nào?
            </Text>
            <Rate
              value={rateValue}
              onChange={setRateValue}
              className="text-2xl"
            />
          </div>

          <Input.TextArea
            rows={4}
            placeholder="Chia sẻ cảm nghĩ chi tiết về khóa học để giúp đỡ các học viên khác..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="rounded-xl p-4 border-gray-200 focus:border-blue-400"
          />

          <div className="mt-4 flex justify-end">
            <Button
              type="primary"
              size="large"
              icon={myReview ? <EditOutlined /> : <SendOutlined />}
              loading={submitting}
              onClick={handleSubmit}
              className={`rounded-lg px-8 h-11 font-semibold ${myReview ? "bg-orange-500 border-none hover:bg-orange-600" : "bg-[#303df2] border-none"}`}
            >
              {myReview ? "Cập nhật đánh giá" : "Gửi đánh giá ngay"}
            </Button>
          </div>
        </div>

        <Divider />

        {/* Danh sách bình luận */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <Title level={4} className="!m-0 text-gray-800">
              Đánh giá của khóa học ({reviews.length})
            </Title>
          </div>

          {reviews.length === 0 ? (
            <Empty description="Chưa có đánh giá nào cho khóa học này" />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={reviews}
              renderItem={(item) => (
                <List.Item className="border-b last:border-none py-6 transition-all hover:bg-gray-50/50 px-4 rounded-xl">
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={48}
                        icon={<UserOutlined />}
                        className="bg-blue-100 text-blue-600 shadow-sm"
                      />
                    }
                    title={
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <Text strong className="text-base">
                          {item.fullName}
                        </Text>
                        <Rate
                          disabled
                          defaultValue={rateMap[item.rate]}
                          className="text-xs scale-90 origin-left"
                        />
                        <Text
                          type="secondary"
                          className="text-[11px] sm:ml-auto"
                        >
                          {new Date(item.time).toLocaleDateString("vi-VN")}
                        </Text>
                      </div>
                    }
                    description={
                      <div className="mt-2 text-gray-600 leading-relaxed text-sm">
                        {item.content}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </Spin>
    </div>
  );
};

export default CourseDiscussionTab;
