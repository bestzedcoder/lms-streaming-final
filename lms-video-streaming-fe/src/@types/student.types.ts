import type { CoursePublicDetailsResponse } from "./public.types";

export interface CourseAuthDetailsResponse {
  course: CoursePublicDetailsResponse;
  status: "ACTIVE" | "BANNED";
  hasAccess: boolean;
}
