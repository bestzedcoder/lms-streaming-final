export interface Notification {
  type:
    | "TEACHER_REQUEST_APPROVED"
    | "VIDEO_PROCESSING_SUCCESS"
    | "VIDEO_PROCESSING_FAILED"
    | "VIDEO_VALIDATION_FAILED"
    | "VIDEO_APPROVED"
    | "VIDEO_REJECTED"
    | "RESOURCE_VALIDATION_FAILED"
    | "RESOURCE_APPROVED"
    | "RESOURCE_REJECTED"
    | "COURSE_APPROVED";
  title: string;
  content: string;
  createAt: string;
}
