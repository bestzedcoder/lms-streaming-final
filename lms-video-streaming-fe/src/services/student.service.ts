import axiosClient from "../config/axiosClient.config";
import type { ResponseData } from "../@types/common.types";
import type {
  AddItemRequest,
  CartResponse,
  CourseAuthDetailsResponse,
  InvoiceResponse,
  OrderResponse,
  PaymentCreatingRequest,
  RemoveItemRequest,
} from "../@types/student.types";

export const studentService = {
  getCourseDetails: async (
    slug: string,
  ): Promise<ResponseData<CourseAuthDetailsResponse>> => {
    return axiosClient.get(`/courses/${slug}/details`);
  },

  // Cart

  addCartItem: async (data: AddItemRequest): Promise<ResponseData> => {
    return axiosClient.post("/carts/add-item", data);
  },

  removeCartItem: async (data: RemoveItemRequest): Promise<ResponseData> => {
    return axiosClient.post("/carts/remove-item", data);
  },

  getCart: async (): Promise<ResponseData<CartResponse>> => {
    return axiosClient.get("/carts/my-cart");
  },

  getCountItem: async (): Promise<ResponseData> => {
    return axiosClient.get("/carts/count/item-cart");
  },

  clearCart: async (): Promise<ResponseData> => {
    return axiosClient.post("/carts/clear");
  },

  // Order

  getOrders: async (): Promise<ResponseData<OrderResponse[]>> => {
    return axiosClient.get("/orders");
  },

  getOrderDetails: async (code: string): Promise<ResponseData> => {
    return axiosClient.get(`/orders/details/${code}`);
  },

  payNow: async (slug: string): Promise<ResponseData<string>> => {
    return axiosClient.post(`/orders/pay-now/${slug}`);
  },

  createOrder: async (): Promise<ResponseData<string>> => {
    return axiosClient.post("/orders");
  },

  // Payment
  createPayment: async (
    data: PaymentCreatingRequest,
  ): Promise<ResponseData<string>> => {
    return axiosClient.post("/payment/create", data);
  },

  getInvoice: async (code: string): Promise<ResponseData<InvoiceResponse>> => {
    return axiosClient.get(`/payment/invoice/${code}`);
  },
};
