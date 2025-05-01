import { useState, useEffect, Suspense } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import type { Answer, NewMultiQuestion } from "../api/types";
import { createMultiQuestion } from "../api/repo";
import FormContainer from "./common/Forms/FormContainer";
import QuestionInput from "./common/Forms/QuestionInput";
import AnswerInput from "./common/Forms/AnswerInput";
import SubmitButton from "./common/Forms/SubmitButton";
import Spinner from "./Spinner";

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
    mutationFn: (newQuestion: NewMultiQuestion) =>
      createMultiQuestion(newQuestion),
    onSuccess: () => {
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
      setSuccess(`Kérdés létrehozva!`);
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Nem sikerült a kérdés létrehozása"
      );
    },
  });

  useEffect(() => {
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
      setTouched({ question: true, answers: [true, true, true, true] });
      return;
    }

    mutation.mutate({ question, answers });
  };

  return (
    <Suspense fallback={<Spinner />}>
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
    </Suspense>
  );
};

export default MultiQuestionForm;
