import React, { Suspense, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTetelDetails, updateTetel } from "../api/repo";
import type { TetelFormData } from "../api/types";
import Spinner from "./Spinner";
import Navbar from "./Navbar";
import PageTransition from "../components/common/PageTransition";
const TetelForm = React.lazy(() => import("./common/Forms/TetelForm"));

const TetelEdit: React.FC = () => {
  const { id } = useParams({ strict: false });
  const tetelId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isBlocking, setIsBlocking] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["tetelDetail", tetelId],
    queryFn: () => fetchTetelDetails(tetelId),
    enabled: !isNaN(tetelId),
  });

  const mutation = useMutation({
    mutationFn: (formData: TetelFormData) => updateTetel(tetelId, formData),
    onMutate: () => {
      setIsBlocking(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tetelDetail", tetelId] });
      setSuccess("Sikeres frissítés!");
      setTimeout(() => {
        setSuccess(null);
        navigate({ to: `/tetelek/${tetelId}` });
        setIsBlocking(false);
      }, 2000);
    },
    onError: (e: any) => {
      setError(e.response?.data?.error || "Hiba a frissítés közben.");
      setIsBlocking(false);
    },
  });

  const handleSubmit = (data: TetelFormData) => {
    setError(null);
    mutation.mutate({
      ...data,
      sections: data.sections.map((sec) => ({
        ...sec,
        subsections: sec.subsections.map((sub) => ({
          ...sub,
          id: sub.id && sub.id < 0 ? undefined : sub.id,
        })),
      })),
      flashcards: data.flashcards.map((fc) => ({
        ...fc,
        id: fc.id && fc.id < 0 ? undefined : fc.id,
      })),
    });
  };

  if (isLoading)
    return (
      <div className="p-10 text-center text-gray-300">
        <Spinner />
      </div>
    );

  const initialData: TetelFormData = {
    name: data?.tetel.name || "",
    osszegzes: data?.osszegzes?.content || "",
    sections: data?.sections.map((sec: any) => ({
      ...sec,
      subsections: sec.subsections || [],
    })) || [{ content: "", subsections: [] }],
    flashcards: data?.questions || [],
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <Suspense>
          <div className="relative">
            {isBlocking && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ backgroundColor: "rgba(25, 25, 30, 0.3)" }}
              >
                <Spinner />
              </div>
            )}

            <TetelForm
              initialData={initialData}
              onSubmit={handleSubmit}
              isPending={mutation.isPending}
              error={error}
              success={success}
              label="Tétel szerkesztése"
              submitLabel="Tétel mentése"
            />
          </div>
        </Suspense>
      </PageTransition>
    </>
  );
};

export default TetelEdit;
