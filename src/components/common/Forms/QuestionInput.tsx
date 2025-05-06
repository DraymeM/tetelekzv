interface QuestionInputProps {
  question: string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
  fieldErrors: { question?: string };
  touched: { question: boolean };
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  question,
  setQuestion,
  fieldErrors,
  touched,
}) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-2">
      Kérdés
    </label>
    <input
      type="text"
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      className={`w-full p-3 border rounded-lg bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition ${
        touched.question && fieldErrors.question
          ? "border-red-500"
          : "border-gray-700"
      } animate-in fade-in duration-300`}
      placeholder="Add meg a kérdést"
    />
    {touched.question && fieldErrors.question && (
      <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-200">
        {fieldErrors.question}
      </p>
    )}
  </div>
);

export default QuestionInput;
