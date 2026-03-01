import type { CoursePublicDetailsResponse } from "./public.types";

export interface CourseAuthDetailsResponse {
  course: CoursePublicDetailsResponse;
  hasAccess: boolean;
}

// Cart

export interface AddItemRequest {
  courseSlug: string;
}

export interface RemoveItemRequest {
  cartItemId: string;
}

export interface CartResponse {
  id: string;
  items: CartItemResponse[];
}

export interface CartItemResponse {
  id: string;
  title: string;
  thumbnail?: string;
  price: number;
  salePrice?: number;
  instructorName: string;
}

// Order

export interface OrderResponse {
  code: string;
  totalAmount: string;
  quantity: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  orderDate: string;
  expiresAt: string;
  completedAt?: string;
}

export interface OrderDetailsResponse extends OrderResponse {
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  id: string;
  price: number;
  title: string;
  thumbnail?: string;
  descriptionShort?: string;
}

// Payment

export interface PaymentCreatingRequest {
  code: string;
  method: "MOMO" | "VNPAY";
}

export interface InvoiceResponse {
  transactionNo: string;
  method: "MOMO" | "VNPAY";
}
