import { Suspense, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { createMultiQuestion } from "../api/repo";
import type { Answer, NewMultiQuestion } from "../api/types";
import Spinner from "./Spinner";
import React from "react";
import OfflinePlaceholder from "./OfflinePlaceholder";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import PageTransition from "../components/common/PageTransition";

const MultiQuestionForm = React.lazy(
  () => import("./common/Forms/MultiQuestionForm")
);

const MultiQuestionCreate: React.FC = () => {
  const { id } = useParams({ strict: false });
  const tetelId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isBlocking, setIsBlocking] = useState(false);
  const isOnline = useOnlineStatus();

  const mutation = useMutation({
    mutationFn: (newQuestion: { question: string; answers: Answer[] }) =>
      createMultiQuestion(
        {
          question: newQuestion.question,
          answers: newQuestion.answers.map((ans) => ({
            text: ans.text,
            isCorrect: ans.isCorrect,
          })),
        } as NewMultiQuestion,
        tetelId
      ),
    onMutate: () => setIsBlocking(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tetelQuestions", tetelId] });
      toast.success("Kérdés létrehozva!");
      setTimeout(() => {
        navigate({
          to: "/tetelek/$id/questions",
          params: { id: id ?? "" },
        });
        setIsBlocking(false);
      }, 200);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || "Nem sikerült a kérdés létrehozása!";
      toast.error(errorMessage);
      console.error("Error creating question:", errorMessage, error);
      setIsBlocking(false);
    },
  });

  if (!isOnline) {
    return <OfflinePlaceholder />;
  }

  if (!id || isNaN(tetelId) || tetelId <= 0) {
    return (
      <>
        <div className="text-center mt-10 text-red-500">
          Érvénytelen tétel ID
        </div>
      </>
    );
  }

  return (
    <>
      <PageTransition>
        {isBlocking && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(25, 25, 30, 0.3)" }}
          >
            <Spinner />
          </div>
        )}
        <Suspense>
          <div className="max-w-4xl mx-auto items-center mt-10">
            <MultiQuestionForm
              onSubmit={mutation.mutate}
              isPending={mutation.isPending}
              submitLabel="Kérdés Létrehozása"
              formLabel="Új Felelet Választós Kérdés"
              successMessage={mutation.isSuccess ? "Kérdés létrehozva!" : null}
              errorMessage={
                mutation.error ? "Nem sikerült a kérdés létrehozása" : null
              }
            />
          </div>
        </Suspense>
      </PageTransition>
    </>
  );
};

export default MultiQuestionCreate;
