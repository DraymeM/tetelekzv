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
import Navbar from "./Navbar";
import Spinner from "./Spinner";
import { useAuth } from "../context/AuthContext";
import DeleteModal from "./common/Forms/DeleteModal";
import React from "react";
import PageTransition from "../components/common/PageTransition";
const AnswerPicker = React.lazy(
  () => import("../components/common/AnswerPicker")
);

export default function MultiquestionDetails() {
  const { id } = useParams({ strict: false });
  const questionId = Number(id);
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
      queryClient.invalidateQueries({ queryKey: ["multiQuestions"] });
      toast.success("Sikeresen törölted a kérdést.");
      navigate({ to: "/mquestions" });
    },
    onError: () => {},
  });

  if (isEditMode) return <Outlet />;
  if (isLoading) return <Spinner />;
  if (error || !question)
    return (
      <div className="p-10 text-center text-red-500">
        Hiba történt a kérdés betöltése közben.
      </div>
    );

  return (
    <>
      <Navbar />
      <PageTransition>
        <Suspense>
          <Link
            to="/mquestions"
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
      {isAuthenticated && (
        <>
          {/* Edit Button */}
          <Link
            to="/mquestions/$id/edit"
            params={{ id: questionId.toString() }}
            className="fixed bottom-22 right-7 p-3 bg-blue-600 text-white rounded-full 
                       hover:bg-blue-700 transition-all hover:cursor-pointer transform hover:scale-105 flex items-center justify-center z-50"
            title="Szerkeszd a kérdést"
          >
            <FaPen size={20} />
          </Link>

          {/* Delete Button */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="fixed bottom-7 right-7 p-3 bg-rose-600 text-white rounded-full 
                       hover:bg-rose-700 hover:cursor-pointer transition-all transform hover:scale-105 flex items-center justify-center z-50"
            title="Töröld a kérdést"
          >
            <FaTrash size={20} />
          </button>
        </>
      )}
    </>
  );
}
