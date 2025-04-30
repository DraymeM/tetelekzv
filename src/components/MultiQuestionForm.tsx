import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import type { IMultiQuestion } from "../api/repo";
import FormContainer from "./common/MultiChoiceCreator/FormContainer";
import QuestionInput from "./common/MultiChoiceCreator/QuestionInput";
import AnswerInput from "./common/MultiChoiceCreator/AnswerInput";
import SubmitButton from "./common/MultiChoiceCreator/SubmitButton";

// Zod schema for validation
const answerSchema = z.object({
  text: z.string().min(1, "A válasz szövege nem lehet üres"),
  isCorrect: z.boolean(),
});

const multiQuestionSchema = z.object({
  question: z.string().min(1, "A kérdés megadása kötelező"),
  answers: z
    .array(answerSchema)
    .length(4, "Pontosan négy válasz szükséges")
    .refine((answers) => answers.some((ans) => ans.isCorrect), {
      message: "Legalább egy válasznak helyesnek kell lennie",
    }),
});

interface Answer {
  text: string;
  isCorrect: boolean;
}

const MultiQuestionForm: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    question?: string;
    answers: (string | null)[];
  }>({ question: undefined, answers: [null, null, null, null] });
  const [touched, setTouched] = useState<{
    question: boolean;
    answers: boolean[];
  }>({ question: false, answers: [false, false, false, false] });
  const [, setSubmitAttempted] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newQuestion: Omit<IMultiQuestion, "id">) => {
      console.log(
        "Fetching /tetelekzv/BackEnd/create_multiquestion.php",
        newQuestion
      );
      const response = await axios.post<IMultiQuestion>(
        "/tetelekzv/BackEnd/create_multiquestion.php",
        newQuestion,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (newQuestion) => {
      queryClient.invalidateQueries({ queryKey: ["multiQuestions"] });
      setQuestion("");
      setAnswers([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
      setError(null);
      setFieldErrors({
        question: undefined,
        answers: [null, null, null, null],
      });
      setTouched({ question: false, answers: [false, false, false, false] });
      setSubmitAttempted(false);
      setSuccess(`Kérdés létrehozva, ID: ${newQuestion.id}`);
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (err: any) => {
      console.error("Mutation error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Nem sikerült a kérdés létrehozása"
      );
    },
  });

  // Real-time validation
  useEffect(() => {
    const validateFields = () => {
      const result = multiQuestionSchema.safeParse({ question, answers });
      const newFieldErrors = {
        question: undefined as string | undefined,
        answers: [null, null, null, null] as (string | null)[],
      };

      if (!result.success) {
        result.error.errors.forEach((err) => {
          if (err.path[0] === "question") {
            newFieldErrors.question = err.message;
          } else if (
            err.path[0] === "answers" &&
            typeof err.path[1] === "number"
          ) {
            newFieldErrors.answers[err.path[1]] = err.message;
          }
        });
      }

      setFieldErrors(newFieldErrors);
    };

    validateFields();
  }, [question, answers]);

  const updateAnswer = (
    index: number,
    field: keyof Answer,
    value: string | boolean
  ) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setAnswers(newAnswers);
    setTouched((prev) => ({
      ...prev,
      answers: prev.answers.map((t, i) => (i === index ? true : t)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitAttempted(true);

    const result = multiQuestionSchema.safeParse({ question, answers });
    if (!result.success) {
      setError(result.error.errors[0].message);
      // Mark all fields as touched to show errors
      setTouched({
        question: true,
        answers: [true, true, true, true],
      });
      return;
    }

    mutation.mutate({ question, answers });
  };

  return (
    <FormContainer
      error={error}
      success={success}
      label="Új Felelet Választós Kérdés"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <QuestionInput
          question={question}
          setQuestion={setQuestion}
          fieldErrors={fieldErrors}
          touched={touched}
        />
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Válaszok
          </label>
          {answers.map((answer, index) => (
            <AnswerInput
              key={index}
              answer={answer}
              index={index}
              updateAnswer={updateAnswer}
              fieldErrors={fieldErrors.answers[index]}
              touched={touched.answers[index]}
            />
          ))}
        </div>
        <SubmitButton
          isPending={mutation.isPending}
          label="Kérdés Létrehozása"
        />
      </form>
    </FormContainer>
  );
};

export default MultiQuestionForm;
