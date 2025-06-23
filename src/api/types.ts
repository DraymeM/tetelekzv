export interface Tetel {
  id: number;
  name: string;
}
export interface Subsection {
  id?: number;
  section_id?: number;
  title: string;
  description: string;
}

export interface Section {
  id?: number;
  tetel_id?: number;
  content: string;
  subsections: Subsection[];
}

export interface Flashcard {
  id?: number;
  tetel_id?: number;
  question: string;
  answer: string;
}

export interface TetelFormData {
  name: string;
  osszegzes: string;
  sections: Section[];
  flashcards: Flashcard[];
}

export interface Osszegzes {
  id: number;
  content: string;
}

export interface TetelDetailsResponse {
  tetel: Tetel;
  osszegzes: Osszegzes | null;
  sections: Section[];
  questions: Flashcard[] | null;
}

export interface IMultiQuestion {
  id: number;
  question: string;
  answers: {
    text: string;
    isCorrect: boolean;
  }[];
}
export interface IQuestion {
  id: number;
  question: string;
  tetel_id?: number;
}
export type NewMultiQuestion = Omit<IMultiQuestion, "id">;

export interface Answer {
  text: string;
  isCorrect: boolean;
}

export type RouterContext = {
  isAuthenticated: boolean | false;
  isSuperUser: boolean;
};

export interface GroupFormData {
  name: string;
  public: boolean;
}

export interface GroupData {
  gid: number;
  name: string;
  public: boolean;
  joined: boolean;
  member_count: number;
}
