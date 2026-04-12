export interface AdminVideoPreview {
  videoId: string;
  title: string;
  status: "PENDING" | "READY" | "FAILURE" | "PENDING_REVIEW" | "DELETED";
  owner: string;
}

export interface AdminLecturePreview {
  lectureId: string;
  title: string;
  status: "APPROVED" | "PENDING_REVIEW" | "DELETED";
  owner: string;
}
