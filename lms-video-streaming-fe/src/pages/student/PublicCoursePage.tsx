import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout, Pagination, Skeleton, Empty, Typography, Button } from "antd";
import {
  FilterOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { publicService } from "../../services/public.service";
import type {
  CoursePublicResponse,
  CategoryPublicResponse,
} from "../../types/public.types";
import CourseCard from "../../components/CourseCard";

const { Title, Text } = Typography;
const { Sider, Content } = Layout;

const PublicCoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [courses, setCourses] = useState<CoursePublicResponse[]>([]);
  const [categories, setCategories] = useState<CategoryPublicResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCats, setLoadingCats] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const keyword = searchParams.get("q") || "";
  const categorySlug = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");

  useEffect(() => {
    const loadCats = async () => {
      setLoadingCats(true);
      try {
        const res = await publicService.getCategories();
        if (res.data) setCategories(res.data);
      } catch (e) {
        console.error("Lỗi khi tải danh mục:", e);
      } finally {
        setLoadingCats(false);
      }
    };
    loadCats();
  }, []);

  useEffect(() => {
    fetchCourses();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [keyword, categorySlug, page, size]);

  const fetchCourses = async () => {
    setLoading(true);

    try {
      const res = await publicService.getCourses({
        q: keyword || undefined,
        category: categorySlug || undefined,
        page: page,
        limit: size,
      });

      if (res.data) {
        setCourses(res.data.result);
        setPagination({
          current: res.data.currentPage + 1,
          pageSize: res.data.pageSize,
          total: res.data.totalElements,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách khóa học:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number, newSize: number) => {
    const newParams = new URLSearchParams(searchParams);

    newParams.set("page", newPage.toString());

    if (newSize !== size) {
      newParams.set("size", newSize.toString());
      newParams.set("page", "1");
    }

    setSearchParams(newParams);
  };

  const handleCategoryFilter = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categorySlug === slug) {
      newParams.delete("category");
    } else {
      newParams.set("category", slug);
    }
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-[90px] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            {keyword ? (
              <Title level={2} className="!mb-1 !text-gray-800">
                Kết quả tìm kiếm cho{" "}
                <span className="text-indigo-600">"{keyword}"</span>
              </Title>
            ) : categorySlug ? (
              <Title level={2} className="!mb-1 !text-gray-800">
                Danh mục:{" "}
                <span className="text-indigo-600">
                  {categories.find((c) => c.slug === categorySlug)?.name ||
                    categorySlug}
                </span>
              </Title>
            ) : (
              <Title level={2} className="!mb-1 !text-gray-800">
                Khám phá khóa học
              </Title>
            )}
            <Text className="text-gray-500 text-base">
              Hiển thị <strong>{pagination.total}</strong> kết quả phù hợp
            </Text>
          </div>
        </div>

        <Layout className="bg-transparent gap-8">
          <Sider
            width={260}
            className="bg-transparent hidden lg:block"
            theme="light"
          >
            <div className="pr-2 sticky top-[100px]">
              {(categorySlug || keyword) && (
                <Button
                  onClick={clearAllFilters}
                  block
                  className="mb-6 h-10 font-medium"
                  icon={<FilterOutlined />}
                  danger
                >
                  Xóa tất cả bộ lọc
                </Button>
              )}

              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="font-bold mb-4 text-gray-800 text-base flex items-center gap-2">
                  <AppstoreOutlined className="text-indigo-500" /> Chủ đề
                </h4>
                {loadingCats ? (
                  <Skeleton active paragraph={{ rows: 5 }} title={false} />
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className={`cursor-pointer text-sm py-2 px-3 rounded-lg transition-all flex justify-between items-center group
                          ${
                            categorySlug === cat.slug
                              ? "font-bold text-indigo-700 bg-indigo-50"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        onClick={() => handleCategoryFilter(cat.slug)}
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircleOutlined
                            className={`transition-all ${
                              categorySlug === cat.slug
                                ? "opacity-100 text-indigo-500 scale-100"
                                : "opacity-0 scale-50 w-0 -ml-2"
                            }`}
                          />
                          {cat.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Sider>

          <Content className="bg-transparent min-h-[500px]">
            {loading ? (
              <div className="space-y-5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    <Skeleton
                      active
                      avatar={{ shape: "square", size: 120 }}
                      paragraph={{ rows: 3 }}
                    />
                  </div>
                ))}
              </div>
            ) : courses.length > 0 ? (
              <div>
                <div className="flex flex-col">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>

                <div className="mt-10 flex justify-center">
                  <Pagination
                    current={pagination.current}
                    total={pagination.total}
                    pageSize={pagination.pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={true}
                    pageSizeOptions={["5", "10", "20", "50"]}
                    locale={{ items_per_page: "/ trang" }}
                    className="shadow-sm bg-white py-3 px-6 rounded-full border border-gray-100"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={null}
                />
                <Title level={4} className="mt-4 !text-gray-800">
                  Không tìm thấy khóa học
                </Title>
                <Text className="text-gray-500 max-w-md">
                  Rất tiếc, không có khóa học nào khớp với tiêu chí tìm kiếm của
                  bạn. Vui lòng thử lại với từ khóa hoặc danh mục khác.
                </Text>
                <Button
                  type="primary"
                  size="large"
                  onClick={clearAllFilters}
                  className="mt-6 px-8 rounded-full"
                >
                  Xem tất cả khóa học
                </Button>
              </div>
            )}
          </Content>
        </Layout>
      </div>
    </div>
  );
};

export default PublicCoursesPage;
