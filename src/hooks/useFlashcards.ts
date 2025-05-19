import { useState } from "react";
import type { Flashcard } from "../api/types";

let nextClientId = Date.now();

function makeFlashcard(f?: Flashcard): Flashcard {
  return f && f.id != null
    ? f
    : {
        id: ++nextClientId,
        question: f?.question ?? "",
        answer: f?.answer ?? "",
      };
}

export function useFlashcards(initialFlashcards?: Flashcard[]) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(
    initialFlashcards?.map(makeFlashcard) ?? []
  );

  const addFlashcard = () => {
    const fc = makeFlashcard();
    setFlashcards((f) => [...f, fc]);
  };

  const updateFlashcard = (id: number, field: keyof Flashcard, val: string) =>
    setFlashcards((f) =>
      f.map((x) => (x.id === id ? { ...x, [field]: val } : x))
    );

  const removeFlashcard = (id: number) =>
    setFlashcards((f) => f.filter((x) => x.id !== id));

  return {
    flashcards,
    addFlashcard,
    updateFlashcard,
    removeFlashcard,
  };
}
