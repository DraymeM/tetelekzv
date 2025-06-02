import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import AnswerPicker from "../AnswerPicker";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface QuestionCardProps {
  question: string | undefined;
  answers: Answer[];
  onPick: (isCorrect: boolean) => void;
}

export default function QuestionCard({
  question,
  answers,
  onPick,
}: QuestionCardProps) {
  return (
    <Transition
      as={Fragment}
      show={!!question}
      enter="transition ease-out duration-500 transform"
      enterFrom="opacity-0 translate-x-4"
      enterTo="opacity-100 translate-x-0"
      leave="transition ease-in duration-300 transform"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 translate-x-4"
    >
      <div className="flex flex-col items-center gap-6 w-full mb-5 max-w-2xl">
        <div className="p-6 rounded-lg bg-secondary text-foreground w-full overflow-auto max-h-[80vh] shadow-md">
          <h3 className="text-xl font-semibold mb-5">{question}</h3>
          <AnswerPicker answers={answers} onPick={onPick} />
        </div>
      </div>
    </Transition>
  );
}
