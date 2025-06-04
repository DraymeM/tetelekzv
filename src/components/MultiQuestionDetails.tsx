import {
  useParams,
  useNavigate,
  useLocation,
  Outlet,
  Link,
} from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { FaArrowLeft, FaPen, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchMultiQuestionDetails, deleteMultiQuestion } from "../api/repo";
import Spinner from "./Spinner";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/common/PageTransition";
import OfflinePlaceholder from "./OfflinePlaceholder";
import React from "react";

const DeleteModal = React.lazy(() => import("./common/Forms/DeleteModal"));
const AnswerPicker = React.lazy(
  () => import("../components/common/AnswerPicker")
);

export default function MultiquestionDetails() {
  const { id: tetelId, qid } = useParams({
    from: "/tetelek/$id/questions/$qid",
  });
  const questionId = Number(qid);
  const location = useLocation();
  const isEditMode = location.pathname.includes("/edit");
  const { isAuthenticated, isSuperUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    data: question,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["multiQuestions", questionId],
    queryFn: () => fetchMultiQuestionDetails(questionId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!isAuthenticated) {
        toast.error("Ehhez be kell jelentkezned!");
        throw new Error("Nincs engedélyed");
      }
      if (!isSuperUser) {
        toast.error("Nincs jogosultság a művelethez!");
        throw new Error("Nincs jogosultság");
      }
      return deleteMultiQuestion(questionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tetelQuestions"] });
      queryClient.invalidateQueries({
        queryKey: ["multiQuestions", questionId],
      });
      toast.success("Sikeresen törölted a kérdést.");
      navigate({
        to: "/tetelek/$id/questions",
        params: { id: tetelId },
      });
    },
  });

  // 🛠️ Handle loading
  if (isLoading) return <Spinner />;

  // ❗ Handle error + offline
  if (error) {
    if (!navigator.onLine) {
      return <OfflinePlaceholder />;
    }
    return (
      <div className="p-10 mt-20 text-center text-red-500">
        Hiba történt a kérdés betöltése közben.
      </div>
    );
  }

  if (isEditMode) return <Outlet />;

  if (!tetelId || isNaN(Number(tetelId))) {
    return (
      <>
        <div className="p-10 mt-20 text-center text-red-500">
          Érvénytelen tétel ID
        </div>
      </>
    );
  }

  if (!question) {
    return (
      <>
        <div className="p-10 mt-20 text-center text-red-500">
          A kérdés nem található.
        </div>
      </>
    );
  }

  return (
    <>
      <PageTransition>
        <Suspense>
          <Link
            to="/tetelek/$id/questions"
            params={{ id: tetelId }}
            className="inline-flex items-center px-3 py-2 border border-border mt-20 ml-10 rounded-md text-sm font-medium hover:bg-muted"
          >
            <FaArrowLeft className="mr-2" />
            Vissza a kérdésekhez
          </Link>

          <div className="max-w-2xl mx-auto p-6 mt-6 bg-secondary rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-4">
              {question.question}
            </h2>
            <AnswerPicker answers={question.answers} onPick={() => {}} />
          </div>

          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onDelete={() => deleteMutation.mutate()}
            isDeleting={deleteMutation.isPending}
            itemName={question.question}
          />
        </Suspense>
      </PageTransition>

      {isAuthenticated && isSuperUser ? (
        <>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="fixed md:bottom-7 bottom-14 right-5 p-3 bg-rose-600 text-white rounded-full 
                 hover:bg-rose-700 hover:cursor-pointer transition-all transform hover:scale-105 flex items-center justify-center z-50"
            title="Töröld a kérdést"
          >
            <FaTrash size={20} />
          </button>

          <Link
            to="/tetelek/$id/questions/$qid/edit"
            params={{ id: tetelId, qid }}
            className="fixed md:bottom-22 bottom-28 right-5 p-3 bg-blue-600 text-white rounded-full 
                 hover:bg-blue-700 transition-all hover:cursor-pointer transform hover:scale-105 flex items-center justify-center z-50"
            title="Szerkeszd a kérdést"
          >
            <FaPen size={20} />
          </Link>
        </>
      ) : isAuthenticated ? (
        <Link
          to="/tetelek/$id/questions/$qid/edit"
          params={{ id: tetelId, qid }}
          className="fixed md:bottom-7 bottom-14 right-5 p-3 bg-blue-600 text-white rounded-full 
               hover:bg-blue-700 transition-all hover:cursor-pointer transform hover:scale-105 flex items-center justify-center z-50"
          title="Szerkeszd a kérdést"
        >
          <FaPen size={20} />
        </Link>
      ) : null}
    </>
  );
}
