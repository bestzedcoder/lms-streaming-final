import { ReadOutlined, StarFilled, UserOutlined } from "@ant-design/icons";
import type { CoursePublicResponse } from "../types/public.types";
import { formatCurrency } from "../utils/format.utils";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }: { course: CoursePublicResponse }) => {
  const navigate = useNavigate();
  return (
    <div className="group flex flex-col sm:flex-row gap-4 border border-gray-200 rounded-xl p-3 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 bg-white mb-5">
      <div className="shrink-0 w-full sm:w-[280px] h-[160px] relative overflow-hidden rounded-lg">
        <img
          src={course.thumbnail || "https://placehold.co/600x400?text=No+Image"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-indigo-600 shadow-sm">
          {course.categorySlug}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between py-1 sm:pr-2">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-[17px] font-bold text-gray-800 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors flex-1">
              {course.title}
            </h3>
            <div className="text-right shrink-0 sm:hidden">
              <div className="font-bold text-gray-900 text-lg">
                {course.salePrice !== undefined &&
                course.price - course.salePrice === 0 ? (
                  <span className="text-green-600">Miễn phí</span>
                ) : course.salePrice ? (
                  formatCurrency(course.price - course.salePrice)
                ) : (
                  formatCurrency(course.price)
                )}
              </div>
            </div>
          </div>

          {course.descriptionShort && (
            <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-2 leading-relaxed pr-2">
              {course.descriptionShort}
            </p>
          )}

          <div className="text-sm text-gray-500 mt-1 mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-1.5">
              <UserOutlined className="text-gray-400" /> {course.instructorName}
            </span>
            <span className="flex items-center gap-1">
              <ReadOutlined className="text-gray-400" /> {course.countLesson}{" "}
              bài học
            </span>
            <span className="flex items-center gap-1">
              <StarFilled className="text-yellow-400" />{" "}
              {course.averageRating.toFixed(1)}
            </span>
          </div>

          <div className="mt-auto">
            <Button
              type="primary"
              size="large"
              className="bg-[#3b41e3] hover:bg-[#2b31c9] border-none text-white font-medium px-6 rounded-lg shadow-sm"
              onClick={() => navigate(`/student/courses/${course.slug}`)}
            >
              View Course
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end justify-start pl-6 pr-4 min-w-[160px] border-l border-gray-100 border-dashed">
        <div className="text-right">
          <div className="text-xl font-extrabold text-gray-900">
            {course.salePrice !== undefined &&
            course.price - course.salePrice === 0 ? (
              <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                Miễn phí
              </span>
            ) : course.salePrice ? (
              formatCurrency(course.price - course.salePrice)
            ) : (
              formatCurrency(course.price)
            )}
          </div>

          {course.salePrice && course.price - course.salePrice !== 0 ? (
            <div className="text-sm text-gray-400 line-through mt-1">
              {formatCurrency(course.price)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
