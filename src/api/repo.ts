import apiClient from "./index";
import type {
  Tetel,
  TetelDetailsResponse,
  TetelFormData,
  NewMultiQuestion,
  IMultiQuestion,
  IQuestion,
  Flashcard,
  GroupData,
  GroupFormData,
} from "./types";

/*--------------------------------------------------------------Groups---------------------------------------------------------------------*/
export const checkGroupAccess = async (groupId: number) => {
  try {
    const resp = await apiClient.get("/auth/check-group-access.php", {
      params: { group_id: groupId },
    });
    return {
      isPublic: resp.data.isPublic || false,
      isMember: resp.data.isMember || false,
      canCreate: resp.data.canCreate || false,
      canUpdate: resp.data.canUpdate || false,
      canDelete: resp.data.canDelete || false,
    };
  } catch (e) {
    console.error("Group access check error", e);
    return {
      isPublic: false,
      isMember: false,
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    };
  }
};

export async function createGroup(data: GroupFormData): Promise<void> {
  const res = await apiClient.post("/group/post/create_group.php", data);
  if (res.status !== 200) {
    throw new Error("Failed to create group");
  }
}

export async function fetchgroups({
  page = 1,
  limit = 35,
}: {
  page?: number;
  limit?: number;
}): Promise<{ data: GroupData[]; total: number }> {
  const res = await apiClient.get("/group/get/get_group_list.php", {
    params: { page, limit },
  });

  if (!res.data || !Array.isArray(res.data.data)) {
    throw new Error(
      "Unexpected response from backend: " + JSON.stringify(res.data)
    );
  }

  return res.data;
}

export async function fetchGroupDetail(
  id: number
): Promise<{ id: number; name: string; public: boolean }> {
  const res = await apiClient.get(`/group/get/get_group_detail.php`, {
    params: { id },
  });

  if (!res.data || !res.data.name) {
    throw new Error("Invalid group response");
  }

  return res.data;
}

export interface GroupMember {
  username: string;
  can_create: number;
  can_update: number;
  can_delete: number;
  joined_at: string;
}

export async function fetchGroupMembers(id: number): Promise<GroupMember[]> {
  const res = await apiClient.get(`/group/get/get_group_members.php`, {
    params: { id },
  });

  if (!res.data || !Array.isArray(res.data)) {
    throw new Error("Invalid group members response");
  }

  return res.data;
}

/*--------------------------------------------------------------Tetelek---------------------------------------------------------------------*/

export async function fetchTetelek({
  page = 1,
  limit = 35,
}: {
  page?: number;
  limit?: number;
}): Promise<{ data: Tetel[]; total: number }> {
  const res = await apiClient.get("/tetel/get/get_tetel_list.php", {
    params: { page, limit },
  });

  if (!res.data || !Array.isArray(res.data.data)) {
    throw new Error(
      "Unexpected response from backend: " + JSON.stringify(res.data)
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
/*----------------------------------------------------------------Kérdések--------------------------------------------------------------- */
export async function createMultiQuestion(
  data: NewMultiQuestion,
  tetelId: number
): Promise<IMultiQuestion> {
  const res = await apiClient.post<IMultiQuestion>(
    `/multiquestion/post/create_multiquestion.php?tetelid=${tetelId}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}
export async function updateMultiQuestion(
  id: number,
  updated: NewMultiQuestion
): Promise<{ success: boolean }> {
  if (isNaN(id)) {
    console.warn("❌ updateMultiQuestion called with invalid id:", id);
    return { success: false }; // Guard it!
  }

  const res = await apiClient.post<{ success: boolean }>(
    `/multiquestion/post/update_multiquestion.php?id=${id}`,
    updated,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
}
export async function deleteMultiQuestion(id: number): Promise<void> {
  // send DELETE with JSON body { id }
  const res = await apiClient.delete<{ success: boolean }>(
    `/multiquestion/post/delete_multiquestion.php`,
    {
      data: { id },
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.data.success) {
    throw new Error("A kérdés törlése nem sikerült.");
  }
}

export async function fetchQuestions({
  page = 1,
  limit = 35,
}): Promise<{ data: IQuestion[]; total: number }> {
  const res = await apiClient.get(
    "/multiquestion/get/get_multiquestion_list.php",
    {
      params: { page, limit },
    }
  );

  if (!res.data || !Array.isArray(res.data.data)) {
    throw new Error("Unexpected response from backend");
  }

  return res.data;
}

export async function fetchQuestionsByTetelId({
  tetelId,
  page = 1,
  limit = 35,
}: {
  tetelId: number;
  page?: number;
  limit?: number;
}): Promise<{ data: IQuestion[]; total: number }> {
  const res = await apiClient.get(
    "/multiquestion/get/get_multiquestions_by_tetel.php",
    {
      params: { tetel_id: tetelId, page, limit },
    }
  );

  if (!res.data || !Array.isArray(res.data.data)) {
    throw new Error("Unexpected response from backend");
  }

  return res.data;
}

export async function fetchMultiQuestionDetails(
  id: number
): Promise<IMultiQuestion> {
  const res = await apiClient.get<IMultiQuestion>(
    `/multiquestion/get/get_multiquestion_details.php?id=${id}`
  );
  if (!res.data || typeof res.data !== "object") {
    throw new Error(
      "Expected a multiquestion object, received: " + JSON.stringify(res.data)
    );
  }
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

export async function fetchFlashcardCount(): Promise<{ total: number }> {
  const res = await apiClient.get<{ total: number }>(
    "/tetel/get/get_total_flashcards.php"
  );
  return res.data;
}

/*-------------------------------------------------------------------AUTH---------------------------------------------------------------*/

export async function register(
  username: string,
  email: string,
  password: string
) {
  const res = await apiClient.post("/auth/register.php", {
    username,
    email,
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

export async function updatePassword(
  currentPassword: string,
  newPassword: string,
  confirmation: string
) {
  const res = await apiClient.post("/auth/update_password.php", {
    current_password: currentPassword,
    password: newPassword,
    password_confirmation: confirmation,
  });
  return res.data;
}
