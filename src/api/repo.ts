import apiClient from "./index";
import phpClient from "./index";
export interface ITetel {
  id: number;
  name: string;
  osszegzes_id: number;
  sections: number[];
  kerdesek: number[];
}
export interface IQuestion {
  id: number;
  question: string;
  answer: string;
}
export interface IOsszegzes {
  id: number;
  content: string;
}

export interface ISection {
  id: number;
  tetel_id: number;
  content: string;
  subsection_id: number[];
}

export interface ISubsection {
  id: number;
  title: string;
  description: string;
}
export interface IMultiQuestion {
  id: number;
  question: string;
  answers: {
    text: string;
    isCorrect: boolean;
  }[];
}

export async function fetchTetelek(): Promise<ITetel[]> {
  const { data } = await apiClient.get<ITetel[]>("/tetel.json");
  return data;
}

export async function fetchOsszegzesAll(): Promise<IOsszegzes[]> {
  const { data } = await apiClient.get<IOsszegzes[]>("/osszegzes.json");
  return data;
}

export async function fetchSectionsAll(): Promise<ISection[]> {
  const { data } = await apiClient.get<ISection[]>("/section.json");
  return data;
}

export async function fetchSubsectionsAll(): Promise<ISubsection[]> {
  const { data } = await apiClient.get<ISubsection[]>("/subsection.json");
  return data;
}
export async function fetchQuestionsAll(): Promise<IQuestion[]> {
  const { data } = await apiClient.get<IQuestion[]>("/kerdesek.json");
  return data;
}

/**
 * Returns the complete detail bundle for one tétel.
 */
export async function fetchTetelDetail(id: number) {
  const [tetelek, osszList, sectionList, subsectionList, questionList] =
    await Promise.all([
      fetchTetelek(),
      fetchOsszegzesAll(),
      fetchSectionsAll(),
      fetchSubsectionsAll(),
      fetchQuestionsAll(),
    ]);

  const tetel = tetelek.find((t) => t.id === id);
  if (!tetel) {
    throw new Error(`Tétel with id=${id} not found`);
  }

  const osszegzes = osszList.find((o) => o.id === tetel.osszegzes_id) ?? null;

  const sections = sectionList
    .filter((s) => s.tetel_id === tetel.id)
    .map((s) => ({
      ...s,
      subsections: subsectionList.filter((sub) =>
        s.subsection_id.includes(sub.id)
      ),
    }));

  const questions = questionList.filter((q) => tetel.kerdesek.includes(q.id));

  return { tetel, osszegzes, sections, questions };
}

export async function createMultiQuestion(
  question: Omit<IMultiQuestion, "id">
): Promise<IMultiQuestion> {
  console.log("Fetching /tetelekzv/BackEnd/create_multiquestion.php", question);
  const { data } = await phpClient.post<IMultiQuestion>(
    "/create_multiquestion.php",
    question
  );
  return data;
}
