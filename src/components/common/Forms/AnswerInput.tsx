import { Switch } from "@headlessui/react";
import { Suspense } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

interface AnswerInputProps {
  answer: { text: string; isCorrect: boolean };
  index: number;
  updateAnswer: (
    index: number,
    field: keyof { text: string; isCorrect: boolean },
    value: string | boolean
  ) => void;
  fieldErrors: string | null;
  touched: boolean;
}

const AnswerInput: React.FC<AnswerInputProps> = ({
  answer,
  index,
  updateAnswer,
  fieldErrors,
  touched,
}) => (
  <Suspense>
    <div className="flex flex-col space-y-1 mb-3">
      <div className="flex items-center space-x-3">
        <span className="text-secondary-foreground w-8 font-medium">
          {String.fromCharCode(65 + index)}.
        </span>
        <input
          type="text"
          value={answer.text}
          onChange={(e) => updateAnswer(index, "text", e.target.value)}
          className={`flex-1 p-3 border rounded-lg bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition ${
            touched && fieldErrors ? "border-red-500" : "border-border"
          } animate-in fade-in duration-300`}
          placeholder={`Válasz ${index + 1}`}
        />
        <Switch
          checked={answer.isCorrect}
          onChange={(checked) => updateAnswer(index, "isCorrect", checked)}
          className={`${answer.isCorrect ? "bg-primary" : "bg-muted"} relative inline-flex h-6 w-11 items-center hover:cursor-pointer rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary animate-in fade-in duration-300`}
        >
          <span
            className={`${answer.isCorrect ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
          />
        </Switch>
        <span className="text-muted-foreground text-lg">
          {answer.isCorrect ? (
            <FaCheck className="text-green-500" />
          ) : (
            <FaTimes className="text-red-500" />
          )}
        </span>
      </div>
      {touched && fieldErrors && (
        <p className="text-red-500 text-sm ml-11 animate-in fade-in duration-200">
          {fieldErrors}
        </p>
      )}
    </div>
  </Suspense>
);

export default AnswerInput;
