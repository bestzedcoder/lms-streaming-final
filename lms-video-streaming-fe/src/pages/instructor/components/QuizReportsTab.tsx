import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Typography,
  Card,
  message,
  Dropdown,
  Spin,
  type MenuProps,
} from "antd";
import {
  FileExcelOutlined,
  DownOutlined,
  DownloadOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import type { InstructorQuizStatisticsResponse } from "../../../@types/instructor.types";
import { instructorService } from "../../../services/instructor.service";

const { Text } = Typography;

interface QuizReportsTabProps {
  courseId: string;
}

const QuizReportsTab: React.FC<QuizReportsTabProps> = ({ courseId }) => {
  const [loading, setLoading] = useState(false);
  const [quizStats, setQuizStats] = useState<
    InstructorQuizStatisticsResponse[]
  >([]);
  const [exportLoading, setExportLoading] = useState<Record<string, boolean>>(
    {},
  );
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const res = await instructorService.getQuizStatistics(courseId);
        setQuizStats(res.data || []);
      } catch (error) {
        message.error("Lỗi tải danh sách thống kê bài đánh giá");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchQuizzes();
  }, [courseId]);

  const handleExportExcel = async (
    quizId: string,
    quizTitle: string,
    version: number,
  ) => {
    const versionNumber = version;

    const versionText =
      versionNumber === 0 ? "Tất cả phiên bản" : `Phiên bản ${versionNumber}`;

    try {
      setExportLoading((prev) => ({
        ...prev,
        [quizId]: true,
      }));

      message.loading({
        content: `Đang xuất Excel - ${versionText}...`,
        key: "export",
      });

      const blob = await instructorService.exportData({
        quizId,
        versionNumber,
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download =
        versionNumber === 0
          ? `${quizTitle}-all-versions.xlsx`
          : `${quizTitle}-v${versionNumber}.xlsx`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      message.success({
        content: `Xuất dữ liệu thành công`,
        key: "export",
      });
    } catch (error) {
      message.error({
        content: "Xuất dữ liệu thất bại",
        key: "export",
      });
    } finally {
      setExportLoading((prev) => ({
        ...prev,
        [quizId]: false,
      }));
    }
  };

  const getDropdownMenu = (
    quizId: string,
    quizTitle: string,
    versions: number[],
  ): MenuProps => {
    const menuItems: MenuProps["items"] = [
      {
        key: "all",
        label: (
          <span className="font-semibold text-blue-600">
            Tải tất cả dữ liệu
          </span>
        ),
        icon: <FolderOpenOutlined className="text-blue-500" />,
        onClick: () => handleExportExcel(quizId, quizTitle, 0),
      },
      { type: "divider" },
    ];

    versions.forEach((v) => {
      menuItems.push({
        key: `v${v}`,
        label: `Báo cáo Phiên bản ${v}`,
        icon: <FileExcelOutlined className="text-emerald-500" />,
        onClick: () => handleExportExcel(quizId, quizTitle, v),
      });
    });

    return { items: menuItems };
  };

  const quizColumns = [
    {
      title: "Tên bài đánh giá",
      dataIndex: ["quiz", "title"],
      key: "title",
      render: (text: string) => (
        <Text strong className="text-gray-700 text-sm">
          {text}
        </Text>
      ),
    },
    {
      title: "Phân loại",
      dataIndex: ["quiz", "type"],
      key: "type",
      width: 140,
      render: (type: "TEST" | "EXAM") => (
        <Tag
          color={type === "EXAM" ? "purple" : "cyan"}
          className="font-medium border-none rounded-md uppercase tracking-wide text-[10px] px-2 py-0.5 m-0"
        >
          {type === "EXAM" ? "THI KẾT THÚC" : "KIỂM TRA"}
        </Tag>
      ),
    },
    {
      title: "Lượt làm bài",
      dataIndex: ["quiz", "totalSubmissions"],
      key: "totalSubmissions",
      align: "center" as const,
      width: 130,
      render: (count: number) => (
        <Tag
          color="blue"
          className="rounded-full px-3 m-0 font-medium border-blue-100 bg-blue-50 text-blue-600"
        >
          {count} lượt
        </Tag>
      ),
    },
    {
      title: "Điểm trung bình",
      dataIndex: ["quiz", "averageScore"],
      key: "averageScore",
      align: "center" as const,
      width: 150,
      render: (score: number) => (
        <Text strong className="text-blue-600 text-base">
          {score}{" "}
          <span className="text-gray-400 font-normal text-sm">/ 10</span>
        </Text>
      ),
    },
    {
      title: "Báo cáo số liệu",
      key: "export",
      align: "right" as const,
      width: 200,
      render: (_: any, record: any) => {
        const { quizId, title } = record.quiz;
        const versions = record.versions || [];
        const isExporting = exportLoading[quizId];

        if (versions.length === 0) {
          return (
            <Button disabled className="rounded-lg">
              Chưa có dữ liệu
            </Button>
          );
        }

        return (
          <Dropdown
            menu={getDropdownMenu(quizId, title, versions)}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="primary"
              className="bg-emerald-600 hover:bg-emerald-500 border-none rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
              icon={isExporting ? undefined : <DownloadOutlined />}
              loading={isExporting}
            >
              Xuất dữ liệu{" "}
              <DownOutlined className="text-[10px] ml-1 opacity-80" />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden animate-fade-in h-full">
      <div className="mb-5 flex justify-between items-center bg-gray-50/80 p-4 rounded-xl border border-gray-100">
        <Text type="secondary" className="text-sm">
          💡 Bài thi có thể được cập nhật nhiều lần. Nhấn vào nút{" "}
          <b>"Xuất dữ liệu"</b> để chọn phiên bản (Version) bạn muốn tải về,
          hoặc tải nén toàn bộ thành file ZIP.
        </Text>
      </div>

      <Spin spinning={loading} tip="Đang tải dữ liệu báo cáo...">
        <Table
          dataSource={quizStats}
          columns={quizColumns}
          rowKey={(record) => record.quiz.quizId}
          pagination={false}
          className="custom-export-table"
        />
      </Spin>
    </Card>
  );
};

export default QuizReportsTab;
