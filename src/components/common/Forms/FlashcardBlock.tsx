import React from "react";
import { FaTimes } from "react-icons/fa";
import InputField from "./InputField";

export interface Flashcard {
  question: string;
  answer: string;
}

export interface FlashcardBlockProps {
  flashcard: Flashcard;
  onUpdate: (field: keyof Flashcard, value: string) => void;
  onRemove: () => void;
  errors?: Partial<Record<keyof Flashcard, string>>;
}

const FlashcardBlock: React.FC<FlashcardBlockProps> = ({
  flashcard,
  onUpdate,
  onRemove,
  errors = {},
}) => (
  <div id="flashcardblock" className="space-y-2 relative group">
    <button
      id="flashcardblockx"
      type="button"
      onClick={onRemove}
      className="absolute -top-3 -right-3 text-red-500 bg-secondary rounded-full p-1 hover:bg-red-500/20 hover:cursor-pointer"
    >
      <FaTimes className="w-5 h-5" />
    </button>
    <hr className="border-t-2 border-border w-full my-2" />
    <InputField
      id="kerdescard"
      label="Kérdés"
      value={flashcard.question}
      onChange={(e) => onUpdate("question", e.target.value)}
      error={errors.question}
    />
    <InputField
      id="valaszcard"
      label="Válasz"
      value={flashcard.answer}
      onChange={(e) => onUpdate("answer", e.target.value)}
      error={errors.answer}
    />
  </div>
);

export default FlashcardBlock;
