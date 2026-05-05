import { useState } from "react";
import CategoryManager from "./resource/CategoryManager";
import QuestionBank from "./resource/QuestionBank";
import QuizList from "./resource/QuizList";

const QuizManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("CATEGORY");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý Ngân hàng Quiz
          </h1>
        </div>

        <div className="flex p-1 space-x-1 bg-gray-200 rounded-xl w-max mb-6">
          <button
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out ${
              activeTab === "CATEGORY"
                ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-900/5"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("CATEGORY")}
          >
            📂 Danh mục
          </button>

          <button
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out ${
              activeTab === "QUESTION"
                ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-900/5"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("QUESTION")}
          >
            📝 Ngân hàng câu hỏi
          </button>

          <button
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out ${
              activeTab === "QUIZ"
                ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-900/5"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("QUIZ")}
          >
            🏆 Quản lý bài kiểm tra
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
          {activeTab === "CATEGORY" && <CategoryManager />}
          {activeTab === "QUESTION" && <QuestionBank />}
          {activeTab === "QUIZ" && <QuizList />}
        </div>
      </div>
    </div>
  );
};

export default QuizManagementPage;
