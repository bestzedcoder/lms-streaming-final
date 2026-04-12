import { useState, useRef } from "react";
import { Upload, Input, Button, Typography, message, Progress } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";
import { instructorService } from "../../../services/instructor.service";

const { Dragger } = Upload;
const { Text, Title } = Typography;
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

const VideoUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusText, setStatusText] = useState("");

  const abortControllerRef = useRef<AbortController | null>(null);
  const currentUploadInfo = useRef<{
    uploadId: string;
    fileKey: string;
  } | null>(null);

  const getVideoDuration = (f: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };
      video.src = URL.createObjectURL(f);
    });
  };

  const resetStates = () => {
    setFile(null);
    setTitle("");
    setUploadProgress(0);
    setStatusText("");
    currentUploadInfo.current = null;
  };

  const handleStartUpload = async () => {
    if (!file || !title)
      return message.warning("Vui lòng nhập tiêu đề và chọn file");

    setIsUploading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setStatusText("Đang phân tích video...");
      const duration = await getVideoDuration(file);

      setStatusText("Khởi tạo tiến trình...");
      const totalParts = Math.ceil(file.size / CHUNK_SIZE);

      // 1. Init Multipart
      const initRes = await instructorService.initMultipartVideo({
        fileName: file.name,
        totalParts,
      });

      const { uploadId, fileKey, presignedUrls } = initRes.data;
      currentUploadInfo.current = { uploadId, fileKey };
      const partETags = [];

      // 2. Upload từng phần
      for (let i = 0; i < totalParts; i++) {
        if (controller.signal.aborted) return;

        const chunk = file.slice(
          i * CHUNK_SIZE,
          Math.min((i + 1) * CHUNK_SIZE, file.size),
        );

        const res = await axios.put(presignedUrls[i], chunk, {
          signal: controller.signal,
          onUploadProgress: (e) => {
            const partPct = e.loaded / (e.total || 1);
            setUploadProgress(Math.round(((i + partPct) / totalParts) * 100));
          },
        });

        // Lấy ETag từ header (S3 trả về sau khi PUT thành công)
        const eTag = res.headers.etag.replace(/"/g, "");
        partETags.push({ partNumber: i + 1, eTag });
        setStatusText(`Đang tải mảnh ${i + 1}/${totalParts}...`);
      }

      // 3. Complete Multipart
      setStatusText("Đang xác nhận với server...");
      await instructorService.completeMultipartVideo({
        uploadId,
        fileKey,
        parts: partETags,
      });

      // 4. Tạo record Video trong Database
      setStatusText("Đang lưu thông tin video...");
      await instructorService.createVideo({
        fileKey,
        title,
        size: file.size,
        duration: duration,
      });

      message.success("Tải video thành công!");
      resetStates();
    } catch (err: any) {
      if (!axios.isCancel(err)) {
        message.error("Lỗi: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border">
      <Title level={4} className="text-center mb-6">
        Tải Video Bài Giảng
      </Title>

      <div className="mb-4">
        <Text strong>Tiêu đề video</Text>
        <Input
          size="large"
          placeholder="Nhập tiêu đề video..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isUploading}
          className="mt-2"
        />
      </div>

      {!file ? (
        <Dragger
          beforeUpload={(f) => {
            setFile(f);
            return false;
          }}
          showUploadList={false}
          accept="video/mp4,video/x-m4v,video/*"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p>Kéo thả hoặc click để chọn Video</p>
        </Dragger>
      ) : (
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <Text ellipsis style={{ maxWidth: "80%" }}>
              {file.name}
            </Text>
            {!isUploading && (
              <Button type="text" danger onClick={resetStates}>
                Xóa
              </Button>
            )}
          </div>

          {isUploading && (
            <>
              <div className="flex justify-between text-xs mb-1">
                <span>{statusText}</span>
                <Text type="secondary">{uploadProgress}%</Text>
              </div>
              <Progress
                percent={uploadProgress}
                status="active"
                strokeColor="#4f46e5"
              />
            </>
          )}
        </div>
      )}

      <Button
        type="primary"
        block
        size="large"
        onClick={handleStartUpload}
        loading={isUploading}
        disabled={!file || !title}
        className="mt-6 h-12"
      >
        {isUploading ? "Đang xử lý..." : "Bắt đầu tải lên"}
      </Button>
    </div>
  );
};

export default VideoUploader;
