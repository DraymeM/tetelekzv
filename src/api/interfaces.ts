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
