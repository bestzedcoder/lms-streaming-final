import type { CoursePublicDetailsResponse } from "./public.types";

export interface CourseAuthDetailsResponse {
  course: CoursePublicDetailsResponse;
  hasAccess: boolean;
}
