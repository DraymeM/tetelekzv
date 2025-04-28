import axios from "axios";

const apiClient = axios.create({
  baseURL: "/tetelekzv", // Points to PHP scripts in production
  headers: {
    "Content-Type": "application/json",
  },
});

export const phpClient = axios.create({
  baseURL: window.location.origin + "/tetelekzv/BackEnd",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
