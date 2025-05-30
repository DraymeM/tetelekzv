import { useState, useEffect, Suspense } from "react";
import type { Answer } from "../../../api/types";
import React from "react";
import { multiQuestionSchema } from "../../../validator/questionSchema";

const AnswerInput = React.lazy(() => import("./AnswerInput"));
const QuestionInput = React.lazy(() => import("./QuestionInput"));
const FormContainer = React.lazy(() => import("./FormContainer"));
const SubmitButton = React.lazy(() => import("./SubmitButton"));

interface MultiQuestionFormProps {
  onSubmit: (data: { question: string; answers: Answer[] }) => void;
  isPending: boolean;
  initialQuestion?: string;
  initialAnswers?: Answer[];
  successMessage?: string | null;
  errorMessage?: string | null;
  submitLabel: string;
  formLabel: string;
}

const MultiQuestionForm = ({
  onSubmit,
  isPending,
  initialQuestion = "",
  initialAnswers = [
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
  successMessage,
  errorMessage,
  submitLabel,
  formLabel,
}: MultiQuestionFormProps) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);

  // Add arrayError for array-level errors
  const [fieldErrors, setFieldErrors] = useState<{
    question?: string;
    answers: (string | null)[];
    arrayError?: string;
  }>({
    question: undefined,
    answers: [null, null, null, null],
    arrayError: undefined,
  });

  const [touched, setTouched] = useState<{
    question: boolean;
    answers: boolean[];
  }>({ question: false, answers: [false, false, false, false] });

  // Track if user attempted submit at least once
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const result = multiQuestionSchema.safeParse({ question, answers });
    const newFieldErrors = {
      question: undefined as string | undefined,
      answers: [null, null, null, null] as (string | null)[],
      arrayError: undefined as string | undefined,
    };

    if (!result.success) {
      result.error.errors.forEach((err) => {
        if (err.path[0] === "question") {
          newFieldErrors.question = err.message;
        } else if (err.path[0] === "answers") {
          if (typeof err.path[1] === "number") {
            // error on specific answer
            newFieldErrors.answers[err.path[1]] = err.message;
          } else {
            // array-level error (like refine)
            newFieldErrors.arrayError = err.message;
          }
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
    const result = multiQuestionSchema.safeParse({ question, answers });
    setHasSubmitted(true);
    if (!result.success) {
      setTouched({ question: true, answers: [true, true, true, true] });
      return;
    }
    onSubmit({ question, answers });
  };

  return (
    <Suspense>
      <FormContainer
        error={errorMessage ?? null}
        success={successMessage ?? null}
        label={formLabel}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <QuestionInput
            question={question}
            setQuestion={setQuestion}
            fieldErrors={fieldErrors}
            touched={touched}
          />
          <div>
            <label className="block text-sm font-medium mb-2">Válaszok</label>
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
            {/* Array-level error shown here, outside individual inputs */}
            {hasSubmitted && fieldErrors.arrayError && (
              <p className="text-red-500 text-sm ml-11 animate-in fade-in duration-200">
                {fieldErrors.arrayError}
              </p>
            )}
          </div>
          <SubmitButton isPending={isPending} label={submitLabel} />
        </form>
      </FormContainer>
    </Suspense>
  );
};

export default MultiQuestionForm;
