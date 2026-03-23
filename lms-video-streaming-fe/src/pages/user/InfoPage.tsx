import { useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  Tag,
  Card,
  List,
  Button,
  Skeleton,
  Empty,
} from "antd";
import {
  EditOutlined,
  CheckCircleFilled,
  BookOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/useAuthStore.store";
import { useNavigate } from "react-router-dom";
import { profileService } from "../../services/profile.service";
import type { UserCourseResponse } from "../../@types/user.types";

const { Title, Paragraph, Text } = Typography;

const InfoPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<UserCourseResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        const res = await profileService.getCourseMe();
        if (res.data) {
          setCourses(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <div>
          <Title level={2}>Hồ sơ công khai</Title>
          <Paragraph type="secondary">
            Thông tin hiển thị cho giảng viên và học viên khác.
          </Paragraph>
        </div>
        <Button
          icon={<EditOutlined />}
          onClick={() => navigate("/user/edit-profile")}
        >
          Sửa
        </Button>
      </div>

      <div className="border rounded-xl p-8 bg-gray-50 text-center mb-8 shadow-sm">
        <Avatar
          size={100}
          src={user?.avatarUrl}
          icon={<BookOutlined />}
          className="mb-4 border-4 border-white shadow-md bg-blue-500"
        >
          {user?.fullName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Title level={3} style={{ marginBottom: 5 }}>
          {user?.fullName}
        </Title>
        <div className="flex justify-center gap-2 mb-4">
          <Tag color="blue" className="uppercase font-bold">
            {user?.role}
          </Tag>
          {user?.updateProfile && (
            <Tag color="success" icon={<CheckCircleFilled />}>
              Đã xác minh
            </Tag>
          )}
        </div>
        <p className="text-gray-500 max-w-lg mx-auto italic">
          "Học tập không bao giờ là quá muộn. Hãy đam mê và theo đuổi sự nghiệp
          lập trình."
        </p>
      </div>

      <Title level={4}>
        Khóa học đã tham gia{" "}
        <span className="text-gray-400 text-sm font-normal">
          ({courses.length})
        </span>
      </Title>

      {loading ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, lg: 2 }}
          dataSource={[1, 2, 3, 4]}
          renderItem={() => (
            <List.Item>
              <Card>
                <Skeleton loading={true} avatar active>
                  <Card.Meta
                    title="Card title"
                    description="This is the description"
                  />
                </Skeleton>
              </Card>
            </List.Item>
          )}
        />
      ) : courses.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, lg: 2 }}
          dataSource={courses}
          renderItem={(item) => (
            <List.Item className="h-full pb-4">
              <Card
                hoverable
                className="rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md h-full"
                bodyStyle={{ padding: 16, height: "100%" }}
                onClick={() => navigate(`/student/courses/${item.slug}`)}
              >
                <div className="flex gap-4 items-start h-full">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={
                        item.thumbnail ||
                        "https://placehold.co/150?text=No+Image"
                      }
                      className="w-full h-full rounded-lg object-cover border border-gray-100"
                      alt={item.title}
                    />
                  </div>

                  <div className="flex flex-col flex-1 h-full min-h-[6rem]">
                    <div>
                      <h4 className="font-bold text-gray-800 m-0 text-base line-clamp-2 mb-1">
                        {item.title}
                      </h4>
                      <Text type="secondary" className="text-sm line-clamp-1">
                        {item.descriptionShort}
                      </Text>
                    </div>
                    <div className="mt-auto pt-3 flex items-end justify-between">
                      <Tag
                        color="processing"
                        className="m-0 text-xs px-2 py-0.5 rounded"
                      >
                        Đã sở hữu
                      </Tag>
                      <Tag color={item.status === "ACTIVE" ? "green" : "red"}>
                        {item.status}
                      </Tag>
                    </div>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty
          description="Bạn chưa đăng ký khóa học nào."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button
            type="primary"
            onClick={() => navigate("/student/courses/search")}
          >
            Khám phá ngay
          </Button>
        </Empty>
      )}
    </div>
  );
};

export default InfoPage;
