import axios from "axios";

const apiClient = axios.create({
  baseURL: "/tetelekzv",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
