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
  const res = await apiClient.get<Tetel[]>("/get_tetel_list.php");
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
    `/get_tetel_details.php?id=${tetelId}`
  );
  if (!res.data || typeof res.data !== "object") {
    throw new Error(
      "Expected a tetel details object, received: " + JSON.stringify(res.data)
    );
  }
  return res.data;
}

export async function deleteTetel(tetelId: number): Promise<void> {
  await apiClient.delete("/delete_tetel.php", {
    data: { id: tetelId },
  });
}

export async function updateTetel(
  tetelId: number,
  formData: TetelFormData
): Promise<void> {
  const res = await apiClient.post(`/update_tetel.php?id=${tetelId}`, formData);
  if (res.status !== 200) {
    throw new Error("Failed to update tetel");
  }
}

export async function createTetel(formData: TetelFormData): Promise<void> {
  const res = await apiClient.post("/create_tetel.php", formData);
  if (res.status !== 200) {
    throw new Error("Failed to create tetel");
  }
}

export async function createMultiQuestion(
  data: NewMultiQuestion
): Promise<IMultiQuestion> {
  const res = await apiClient.post<IMultiQuestion>(
    "/create_multiquestion.php",
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
  const res = await apiClient.get<IMultiQuestion>("/get_multiquestion.php");
  return res.data;
}
export async function fetchRandomFlashcard(): Promise<Flashcard> {
  const res = await apiClient.get<Flashcard>("/get_random_flashcard.php");
  return res.data;
}
