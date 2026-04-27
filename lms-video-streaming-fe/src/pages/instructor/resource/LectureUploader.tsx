import { Input, message, Progress, Typography } from "antd";
import { useState } from "react";
import { instructorService } from "../../../services/instructor.service";
import axios from "axios";

const { Text } = Typography;

const LectureUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !title)
      return message.warning("Vui lòng nhập tiêu đề và chọn file!");

    setUploading(true);
    setProgress(0);

    try {
      const res = await instructorService.getPresignedUrl({
        fileName: file.name,
      });

      const { presignedUrl, fileKey } = res.data;

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (p) =>
          setProgress(Math.round((p.loaded * 100) / p.total!)),
      });

      await instructorService.createResource({
        fileKey: fileKey,
        title: title,
        size: file.size,
      });

      message.success("Tải tài liệu lên thành công!");
      setFile(null);
      setTitle("");
    } catch (error: any) {
      message.error(
        "Lỗi upload: " + (error.response?.data?.message || error.message),
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border">
      <h2 className="text-2xl font-bold mb-4">Tải lên tài liệu bài giảng</h2>

      <div className="mb-4">
        <Text strong>Tiêu đề tài liệu</Text>
        <Input
          placeholder="Ví dụ: Giáo trình buổi 1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2"
        />
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        <p className="text-xs text-gray-400">Chỉ chấp nhận file PDF hoặc TXT</p>
      </div>

      {uploading && (
        <div className="mt-4">
          <Progress percent={progress} size="small" />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || !file || !title}
        className={`w-full mt-6 py-3 rounded-lg font-semibold text-white transition-all ${
          uploading || !file || !title
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {uploading ? "Đang xử lý..." : "Bắt đầu Upload"}
      </button>
    </div>
  );
};

export default LectureUploader;
