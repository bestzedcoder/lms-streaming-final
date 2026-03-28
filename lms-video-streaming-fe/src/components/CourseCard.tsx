import { ReadOutlined, StarFilled, UserOutlined } from "@ant-design/icons";
import type { CoursePublicResponse } from "../@types/public.types";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }: { course: CoursePublicResponse }) => {
  const navigate = useNavigate();

  return (
    <div className="group flex flex-col sm:flex-row gap-5 border border-gray-200 rounded-xl p-3 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 bg-white mb-5">
      {/* Cột ảnh Thumbnail */}
      <div className="shrink-0 w-full sm:w-[280px] h-[160px] relative overflow-hidden rounded-lg">
        <img
          src={course.thumbnail || "https://placehold.co/600x400?text=No+Image"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-indigo-600 shadow-sm uppercase">
          {course.categorySlug}
        </div>
      </div>

      {/* Cột Nội dung */}
      <div className="flex-1 flex flex-col py-1">
        <div className="flex-1">
          <h3
            className="text-lg font-bold text-gray-800 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors cursor-pointer"
            onClick={() => navigate(`/student/courses/${course.slug}`)}
          >
            {course.title}
          </h3>

          {course.descriptionShort && (
            <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-3 leading-relaxed">
              {course.descriptionShort}
            </p>
          )}

          <div className="text-sm text-gray-500 mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-medium">
            <span className="flex items-center gap-1.5">
              <UserOutlined className="text-gray-400 text-base" />
              {course.nickname}
            </span>
            <span className="flex items-center gap-1.5">
              <ReadOutlined className="text-gray-400 text-base" />
              {course.totalLessons} bài học
            </span>
            <span className="flex items-center gap-1.5">
              <StarFilled className="text-yellow-400 text-base" />
              {course.averageRating ? course.averageRating.toFixed(1) : "0.0"}
            </span>
          </div>
        </div>

        {/* Nút hành động đưa xuống góc phải */}
        <div className="mt-auto sm:self-end flex items-center">
          <Button
            type="primary"
            size="large"
            className="bg-[#3b41e3] hover:bg-[#2b31c9] border-none text-white font-medium px-8 rounded-lg shadow-sm w-full sm:w-auto"
            onClick={() => navigate(`/student/courses/${course.slug}`)}
          >
            Xem thông tin chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
