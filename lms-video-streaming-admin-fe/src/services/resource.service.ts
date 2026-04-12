import type { ResponseData } from "../@types/common.type";
import type {
  AdminLecturePreview,
  AdminVideoPreview,
} from "../@types/resource.type";
import axiosClient from "../api/axiosClient";

export const resourceService = {
  getVideoPreviews: async (): Promise<ResponseData<AdminVideoPreview[]>> => {
    return axiosClient.get("admin/resource/preview/get-videos");
  },

  getLecturePreviews: async (): Promise<
    ResponseData<AdminLecturePreview[]>
  > => {
    return axiosClient.get("admin/resource/preview/get-lectures");
  },

  approveVideo: async (videoId: string): Promise<ResponseData> => {
    return axiosClient.post(`admin/resource/approval/video/${videoId}`);
  },

  rejectVideo: async (videoId: string): Promise<ResponseData> => {
    return axiosClient.post(`admin/resource/reject/video/${videoId}`);
  },

  approveLecture: async (lectureId: string): Promise<ResponseData> => {
    return axiosClient.post(`admin/resource/approval/lecture/${lectureId}`);
  },

  rejectLecture: async (lectureId: string): Promise<ResponseData> => {
    return axiosClient.post(`admin/resource/reject/lecture/${lectureId}`);
  },

  getVideoPresignedUrl: async (
    videoId: string,
  ): Promise<ResponseData<string>> => {
    return axiosClient.get(
      `admin/resource/preview/video/${videoId}/presigned-url`,
    );
  },

  getLecturePresignedUrl: async (
    lectureId: string,
  ): Promise<ResponseData<string>> => {
    return axiosClient.get(
      `admin/resource/preview/lecture/${lectureId}/presigned-url`,
    );
  },
};
