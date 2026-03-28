import type { CoursePublicDetailsResponse } from "./public.types";

export interface CourseAuthDetailsResponse {
  course: CoursePublicDetailsResponse;
  status: "ACTIVE" | "BANNED";
  hasAccess: boolean;
}

// request

export interface InstructorRequest {
  message?: string;
}

// registration

export interface RegistrationCreatingRequest {
  slug: string;
  message?: string;
}
