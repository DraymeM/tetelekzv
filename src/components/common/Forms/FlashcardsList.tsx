import React from "react";
import { FaPlus } from "react-icons/fa";
import FlashcardBlock from "./FlashcardBlock";
import type { Flashcard } from "../../../api/types";
import PageTransition from "../PageTransition";
import { HiChevronDown } from "react-icons/hi";
interface FlashcardsListProps {
  flashcards: Flashcard[];
  openFlashcards: Record<number, boolean>;
  setOpenFlashcards: (value: Record<number, boolean>) => void;
  addFlashcard: () => void;
  removeFlashcard: (id: number) => void;
  updateFlashcard: (id: number, field: keyof Flashcard, val: string) => void;
  fieldErrors: Record<string, string>;
  showFlashcardErrors: boolean;
}

const FlashcardsList: React.FC<FlashcardsListProps> = ({
  flashcards,
  openFlashcards,
  setOpenFlashcards,
  addFlashcard,
  removeFlashcard,
  updateFlashcard,
  fieldErrors,
  showFlashcardErrors,
}) => (
  <div className="space-y-4 mt-6">
    {flashcards.map((fc, i) => {
      const isOpen = openFlashcards[fc.id!];
      const errs: Record<string, string> = {};
      Object.entries(fieldErrors).forEach(([k, m]) => {
        if (k.startsWith(`flashcards.${i}.`)) {
          errs[k.replace(`flashcards.${i}.`, "")] = m;
        }
      });
      return (
        <div key={fc.id}>
          <button
            type="button"
            className="w-full flex justify-between p-4 bg-secondary rounded-md hover:cursor-pointer"
            onClick={() =>
              setOpenFlashcards({ ...openFlashcards, [fc.id!]: !isOpen })
            }
          >
            <span className="font-medium">Flashcard #{i + 1}</span>
            <HiChevronDown
              className={`transform transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
              size={30}
            />
          </button>
          <PageTransition show={isOpen}>
            <div className="p-4 border border-secondary rounded-b-md">
              <FlashcardBlock
                flashcard={fc}
                onUpdate={(f, v) => updateFlashcard(fc.id!, f, v)}
                onRemove={() => removeFlashcard(fc.id!)}
                errors={showFlashcardErrors ? errs : {}}
              />
            </div>
          </PageTransition>
        </div>
      );
    })}
    <div className="flex items-center space-x-2 text-emerald-600">
      <button
        type="button"
        onClick={addFlashcard}
        className="flex items-center justify-center p-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 hover:cursor-pointer"
      >
        <FaPlus size={15} />
      </button>
      <span>Új flashcard</span>
    </div>
  </div>
);

export default FlashcardsList;
