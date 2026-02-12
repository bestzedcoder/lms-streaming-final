import { Button, Card, Tag, Timeline, Avatar, Tooltip } from "antd";
import {
  RocketOutlined,
  ReadOutlined,
  SafetyCertificateOutlined,
  GithubOutlined,
  LinkedinOutlined,
  FacebookOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.store";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: <ReadOutlined className="text-3xl text-blue-500" />,
      title: "Kho học liệu khổng lồ",
      desc: "Truy cập hàng trăm khóa học từ CNTT, Cơ khí đến Kinh tế.",
    },
    {
      icon: <SafetyCertificateOutlined className="text-3xl text-green-500" />,
      title: "Chứng chỉ uy tín",
      desc: "Nhận chứng chỉ hoàn thành khóa học được công nhận bởi HUST.",
    },
    {
      icon: <RocketOutlined className="text-3xl text-red-500" />,
      title: "Học tập linh hoạt",
      desc: "Học mọi lúc, mọi nơi trên mọi thiết bị (PC, Tablet, Mobile).",
    },
  ];

  const steps = [
    {
      title: "Đăng ký tài khoản",
      desc: "Tạo tài khoản sinh viên chỉ trong 1 phút.",
    },
    { title: "Chọn khóa học", desc: "Tìm kiếm và đăng ký môn học yêu thích." },
    { title: "Học tập & Làm bài", desc: "Xem video, làm Quiz và bài tập lớn." },
    {
      title: "Nhận chứng chỉ",
      desc: "Hoàn thành khóa học và nhận chứng nhận.",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 lg:py-32">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <Tag
              color="cyan"
              className="mb-4 px-3 py-1 rounded-full text-sm font-semibold border-none bg-blue-500/30 text-cyan-200"
            >
              #1 Nền tảng E-Learning tại Bách Khoa
            </Tag>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              Chinh phục tri thức <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Kiến tạo tương lai
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-lg leading-relaxed">
              Hệ thống quản lý học tập trực tuyến dành riêng cho sinh viên HUST.
              Trải nghiệm môi trường học tập hiện đại, tương tác và hiệu quả.
            </p>

            <div className="flex gap-4">
              <Button
                type="primary"
                size="large"
                className="h-14 px-8 text-lg font-bold rounded-full bg-cyan-500 hover:bg-cyan-400 border-none shadow-lg shadow-cyan-500/30 flex items-center gap-2"
                onClick={() =>
                  navigate(isAuthenticated ? "/my-courses" : "/register")
                }
              >
                {isAuthenticated ? "Vào học ngay" : "Bắt đầu miễn phí"}
                <ArrowRightOutlined />
              </Button>
              <Button
                ghost
                size="large"
                className="h-14 px-8 text-lg font-bold rounded-full hover:text-cyan-400 hover:border-cyan-400"
                onClick={() =>
                  document
                    .getElementById("about-dev")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Tìm hiểu thêm
              </Button>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center md:justify-end animate-float">
            <img
              src="/lms.png"
              alt="Online Learning"
              className="max-w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative -mt-16 z-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border border-gray-100">
          {[
            { num: "100+", label: "Khóa học chất lượng" },
            { num: "50+", label: "Giảng viên uy tín" },
            { num: "10.000+", label: "Sinh viên tham gia" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="border-b md:border-b-0 md:border-r last:border-none border-gray-100 pb-4 md:pb-0"
            >
              <h3 className="text-4xl font-extrabold text-blue-600 mb-1">
                {item.num}
              </h3>
              <p className="text-gray-500 font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Tại sao chọn HUST LMS?
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="hover:shadow-xl transition-shadow border-none h-full text-center py-6"
              >
                <div className="mb-4 bg-blue-50 w-20 h-20 mx-auto rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-500">{feature.desc}</p>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <img
                  src="/image1.avif"
                  alt="Steps"
                  className="w-full rounded-xl"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                  4 Bước để bắt đầu
                </h2>
                <Timeline
                  items={steps.map((step, idx) => ({
                    color: "blue",
                    children: (
                      <div className="pb-4">
                        <h4 className="font-bold text-lg text-gray-800">
                          {step.title}
                        </h4>
                        <p className="text-gray-500">{step.desc}</p>
                      </div>
                    ),
                    dot: (
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs border border-blue-200">
                        {idx + 1}
                      </div>
                    ),
                  }))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="about-dev" className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">
            Đội ngũ phát triển
          </h2>

          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

              <div className="relative bg-white ring-1 ring-gray-900/5 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <Avatar
                    size={120}
                    src="https://avatars.githubusercontent.com/u/1?v=4"
                    className="border-4 border-white shadow-lg"
                  />
                  <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>

                <div className="text-center md:text-left flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    Quách Hải Linh
                  </h3>
                  <p className="text-blue-600 font-medium mb-4">
                    Fullstack Developer
                  </p>
                  <p className="text-gray-500 mb-6 text-sm">
                    "Sinh viên K67 - Đại học Bách Khoa Hà Nội. Đam mê xây dựng
                    các hệ thống phần mềm có tính thực tế cao và trải nghiệm
                    người dùng tối ưu."
                  </p>

                  <div className="flex justify-center md:justify-start gap-4">
                    <Tooltip title="Github">
                      <Button
                        shape="circle"
                        icon={<GithubOutlined />}
                        href="https://github.com"
                        target="_blank"
                      />
                    </Tooltip>
                    <Tooltip title="LinkedIn">
                      <Button
                        shape="circle"
                        icon={<LinkedinOutlined />}
                        className="text-blue-700 border-blue-700"
                        href="https://linkedin.com"
                        target="_blank"
                      />
                    </Tooltip>
                    <Tooltip title="Facebook">
                      <Button
                        shape="circle"
                        icon={<FacebookOutlined />}
                        className="text-blue-600 border-blue-600"
                        href="https://facebook.com"
                        target="_blank"
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack Badges */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {[
                "Spring Boot",
                "ReactJS",
                "Ant Design",
                "PostgreSQL",
                "Docker",
                "Redis",
              ].map((tech) => (
                <Tag
                  key={tech}
                  color="default"
                  className="px-4 py-1 rounded-full text-gray-600 border border-gray-300"
                >
                  {tech}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
