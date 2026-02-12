import { useState } from "react";
import { Upload, Button, Typography, Avatar } from "antd";
import {
  UploadOutlined,
  CloudUploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { RcFile } from "antd/es/upload/interface";
import { useAuthStore } from "../../store/useAuthStore.store";
import { profileService } from "../../services/profile.service";
import { notify } from "../../utils/notification.utils";

const { Title, Paragraph } = Typography;

const EditPhotoPage = () => {
  const { user, updateUser } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(user?.avatarUrl);

  const handleUpload = async (file: RcFile) => {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setUploading(true);
    try {
      const res = await profileService.uploadAvatar(file);
      if (res.data) {
        updateUser({ avatarUrl: res.data });
        notify.success("Thành công", "Ảnh đại diện mới nhìn rất tuyệt!");
      }
    } catch (e) {
      setPreview(user?.avatarUrl);
    } finally {
      setUploading(false);
    }
    return false;
  };

  return (
    <div>
      <div className="mb-8 border-b pb-4">
        <Title level={3}>Ảnh đại diện</Title>
        <Paragraph type="secondary">
          Thêm ảnh để giảng viên nhận ra bạn trong lớp học.
        </Paragraph>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar
              size={200}
              src={preview}
              icon={<UserOutlined />}
              className="bg-gray-100 border shadow-sm"
            />
            {uploading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-full">
                <CloudUploadOutlined spin className="text-4xl text-primary" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-6">
            <h4 className="font-bold text-blue-800 mb-2">Yêu cầu ảnh:</h4>
            <ul className="list-disc pl-4 text-blue-700 text-sm space-y-1">
              <li>Định dạng: JPG, PNG, GIF</li>
              <li>Kích thước tối thiểu: 200x200 pixels</li>
              <li>Dung lượng tối đa: 5MB</li>
            </ul>
          </div>

          <Upload
            showUploadList={false}
            beforeUpload={handleUpload}
            accept="image/*"
          >
            <Button
              size="large"
              icon={<UploadOutlined />}
              className="w-full h-12 font-medium"
            >
              Tải ảnh lên từ máy tính
            </Button>
          </Upload>
        </div>
      </div>
    </div>
  );
};

export default EditPhotoPage;
