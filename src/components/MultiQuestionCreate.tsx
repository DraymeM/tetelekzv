import { Suspense, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { createMultiQuestion } from "../api/repo";
import type { Answer } from "../api/types";
import Spinner from "./Spinner";
import Navbar from "./Navbar";
import React from "react";
import PageTransition from "../components/common/PageTransition";
const MultiQuestionForm = React.lazy(
  () => import("./common/Forms/MultiQuestionForm")
);

const MultiQuestionCreate: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isBlocking, setIsBlocking] = useState(false);

  const mutation = useMutation({
    mutationFn: (newQuestion: { question: string; answers: Answer[] }) =>
      createMultiQuestion(newQuestion),
    onMutate: () => setIsBlocking(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["multiQuestions"] });
      toast.success("Kérdés létrehozva!");
      setTimeout(() => {
        navigate({ to: "/mquestions" });
        setIsBlocking(false);
      }, 2000);
    },
    onError: () => {
      toast.error("Nem sikerült a kérdés létrehozása!");
      setIsBlocking(false);
    },
  });

  return (
    <>
      <Navbar />
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
