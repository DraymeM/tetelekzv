import { useState, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { fetchMultiQuestionDetails, updateMultiQuestion } from "../api/repo";
import type { Answer, NewMultiQuestion } from "../api/types";
import FormContainer from "./common/Forms/FormContainer";
import QuestionInput from "./common/Forms/QuestionInput";
import AnswerInput from "./common/Forms/AnswerInput";
import SubmitButton from "./common/Forms/SubmitButton";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

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

export default function MultiQuestionEdit() {
  const { id } = useParams({ strict: false });
  const questionId = Number(id);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [fieldErrors, setFieldErrors] = useState({
    question: undefined as string | undefined,
    answers: [null, null, null, null] as (string | null)[],
  });
  const [touched, setTouched] = useState({
    question: false,
    answers: [false, false, false, false],
  });
  const [isBlocking, setIsBlocking] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1) Load existing data
  const {
    data,
    isLoading,
    error: loadError,
  } = useQuery({
    queryKey: ["multiQuestions", questionId],
    queryFn: () => fetchMultiQuestionDetails(questionId),
    enabled: !isNaN(questionId),
  });

  useEffect(() => {
    if (data) {
      setQuestion(data.question);
      setAnswers(data.answers);
    }
  }, [data]);
  const mutation = useMutation({
    mutationFn: (updated: NewMultiQuestion) =>
      updateMultiQuestion(questionId, updated),
    onMutate: () => {
      setIsBlocking(true);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["multiQuestion", questionId] });
      qc.invalidateQueries({ queryKey: ["multiQuestions"] });
      setSuccessMsg("Kérdés sikeresen frissítve!");
      toast.success("Kérdés frissítve!");
      setTimeout(() => {
        setSuccessMsg(null);
        setIsBlocking(false);
        navigate({ to: `/mquestions/${questionId}` });
      }, 2000);
    },
    onError: () => {
      toast.error("Nem sikerült frissíteni a kérdést.");
      setIsBlocking(false);
    },
  });

  useEffect(() => {
    const result = multiQuestionSchema.safeParse({ question, answers });
    const errs = {
      question: undefined as string | undefined,
      answers: [null, null, null, null] as (string | null)[],
    };
    if (!result.success) {
      for (const err of result.error.errors) {
        if (err.path[0] === "question") errs.question = err.message;
        else if (err.path[0] === "answers" && typeof err.path[1] === "number")
          errs.answers[err.path[1]] = err.message;
      }
    }
    setFieldErrors(errs);
  }, [question, answers]);

  const updateAnswer = (
    i: number,
    field: keyof Answer,
    val: string | boolean
  ) => {
    const arr = [...answers];
    // @ts-ignore
    arr[i][field] = val;
    setAnswers(arr);
    setTouched((t) => ({
      ...t,
      answers: t.answers.map((x, j) => (i === j ? true : x)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = multiQuestionSchema.safeParse({ question, answers }).success;
    if (!ok) {
      setTouched({ question: true, answers: [true, true, true, true] });
      return;
    }
    mutation.mutate({ question, answers });
  };

  if (isLoading)
    return (
      <div className="p-10 text-center text-gray-300">
        <Spinner />
      </div>
    );
  if (loadError) return <div>Hiba a betöltésnél.</div>;

  return (
    <>
      <Navbar />
      {isBlocking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(25, 25, 30, 0.3)" }}
        >
          <Spinner />
        </div>
      )}

      <div className="max-w-4xl mx-auto mt-10">
        <FormContainer
          error={null}
          success={successMsg}
          label="Kérdés szerkesztése"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <QuestionInput
              question={question}
              setQuestion={setQuestion}
              fieldErrors={fieldErrors}
              touched={touched}
            />
            <div>
              <label className="block mb-2 font-medium">Válaszok</label>
              {answers.map((a, i) => (
                <AnswerInput
                  key={i}
                  answer={a}
                  index={i}
                  updateAnswer={updateAnswer}
                  fieldErrors={fieldErrors.answers[i]}
                  touched={touched.answers[i]}
                />
              ))}
            </div>
            <SubmitButton isPending={mutation.isPending} label="Mentés" />
          </form>
        </FormContainer>
      </div>
    </>
  );
}
