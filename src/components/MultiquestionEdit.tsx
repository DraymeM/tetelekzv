import { Suspense, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchMultiQuestionDetails, updateMultiQuestion } from "../api/repo";
import type { Answer } from "../api/types";
import Spinner from "./Spinner";
import Navbar from "./Navbar";
import React from "react";
const MultiQuestionForm = React.lazy(
  () => import("./common/Forms/MultiQuestionForm")
);

const MultiQuestionEdit = () => {
  const { id } = useParams({ strict: false });
  const questionId = Number(id);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [isBlocking, setIsBlocking] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["multiQuestions", questionId],
    queryFn: () => fetchMultiQuestionDetails(questionId),
    enabled: !isNaN(questionId),
  });

  const mutation = useMutation({
    mutationFn: (updated: { question: string; answers: Answer[] }) =>
      updateMultiQuestion(questionId, updated),
    onMutate: () => setIsBlocking(true),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["multiQuestion", questionId] });
      qc.invalidateQueries({ queryKey: ["multiQuestions"] });
      toast.success("Kérdés frissítve!");
      setTimeout(() => navigate({ to: `/mquestions/${questionId}` }), 2000);
    },
    onError: () => {
      toast.error("Nem sikerült frissíteni a kérdést.");
      setIsBlocking(false);
    },
  });

  if (isLoading) return <Spinner />;

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
      <Suspense>
        <div className="max-w-4xl mx-auto mt-10">
          <MultiQuestionForm
            onSubmit={mutation.mutate}
            isPending={mutation.isPending}
            initialQuestion={data?.question}
            initialAnswers={data?.answers}
            submitLabel="Mentés"
            formLabel="Kérdés szerkesztése"
            successMessage={
              mutation.isSuccess ? "Kérdés sikeresen frissítve!" : null
            }
          />
        </div>
      </Suspense>
    </>
  );
};

export default MultiQuestionEdit;
