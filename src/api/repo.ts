import apiClient from "./index";

export async function fetchTetelek() {
  const response = await apiClient.get("/tetel.json");
  return response.data;
}
