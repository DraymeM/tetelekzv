import apiClient from "./index";
import type {
  Tetel,
  TetelDetailsResponse,
  TetelFormData,
  NewMultiQuestion,
  IMultiQuestion,
  Flashcard,
} from "./types";

export async function fetchTetelek(): Promise<Tetel[]> {
  const res = await apiClient.get<Tetel[]>("/tetel/get/get_tetel_list.php");
  if (!Array.isArray(res.data)) {
    throw new Error(
      "Expected an array of tetelek, received: " + JSON.stringify(res.data)
    );
  }
  return res.data;
}

export async function fetchTetelDetails(
  tetelId: number
): Promise<TetelDetailsResponse> {
  const res = await apiClient.get<TetelDetailsResponse>(
    `/tetel/get/get_tetel_details.php?id=${tetelId}`
  );
  if (!res.data || typeof res.data !== "object") {
    throw new Error(
      "Expected a tetel details object, received: " + JSON.stringify(res.data)
    );
  }
  return res.data;
}

export async function deleteTetel(tetelId: number): Promise<void> {
  await apiClient.delete("/tetel/post/delete_tetel.php", {
    data: { id: tetelId },
  });
}

export async function updateTetel(
  tetelId: number,
  formData: TetelFormData
): Promise<void> {
  const res = await apiClient.post(
    `/tetel/post/update_tetel.php?id=${tetelId}`,
    formData
  );
  if (res.status !== 200) {
    throw new Error("Failed to update tetel");
  }
}

export async function createTetel(formData: TetelFormData): Promise<void> {
  const res = await apiClient.post("/tetel/post/create_tetel.php", formData);
  if (res.status !== 200) {
    throw new Error("Failed to create tetel");
  }
}

export async function createMultiQuestion(
  data: NewMultiQuestion
): Promise<IMultiQuestion> {
  const res = await apiClient.post<IMultiQuestion>(
    "/multiquestion/post/create_multiquestion.php",
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}
export async function fetchRandomMultiQuestion(): Promise<IMultiQuestion> {
  const res = await apiClient.get<IMultiQuestion>(
    "/multiquestion/get/get_multiquestion.php"
  );
  return res.data;
}
export async function fetchRandomFlashcard(): Promise<Flashcard> {
  const res = await apiClient.get<Flashcard>(
    "/tetel/get/get_random_flashcard.php"
  );
  return res.data;
}

/*---------------------------AUTH--------------------------------------*/

export async function register(username: string, password: string) {
  const res = await apiClient.post("/auth/register.php", {
    username,
    password,
  });
  return res.data;
}

export async function login(username: string, password: string) {
  const res = await apiClient.post("/auth/login.php", { username, password });
  return res.data;
}
export async function logout() {
  const res = await apiClient.post("/auth/logout.php");
  return res.data;
}

export async function updatePassword(currentPassword: string, newPassword: string, confirmation: string) {
  const res = await apiClient.post("/auth/update-password.php", {
    current_password: currentPassword,
    password: newPassword,
    password_confirmation: confirmation
  });
  return res.data;
}

