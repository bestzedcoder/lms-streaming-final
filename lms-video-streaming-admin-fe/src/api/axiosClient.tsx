import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosClient.interceptors.response.use(
  (response): any => {
    return {
      data: response.data.data,
      message: response.data.message,
    };
  },
  (error) => {
    const errorData = error.response?.data;
    const errorMessage = errorData?.message || "Có lỗi xảy ra";
    return Promise.reject({ message: errorMessage });
  },
);

export default axiosClient;
