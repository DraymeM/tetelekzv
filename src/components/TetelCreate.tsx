import React, { useState, Suspense } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { TetelFormData } from "../api/types";
import { createTetel } from "../api/repo";
import Spinner from "./Spinner";
const TetelForm = React.lazy(() => import("./common/Forms/TetelForm"));

const TetelCreate: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isBlocking, setIsBlocking] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: TetelFormData) => createTetel(data),
    onMutate: () => {
      setIsBlocking(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tetelek"] });
      setSuccess("Sikeres mentés!");

      setTimeout(() => {
        setSuccess(null);
        navigate({ to: "/tetelek" });

        setIsBlocking(false);
      }, 3000);
    },
    onError: (e: any) => {
      setError(e.response?.data?.error || "Hiba");

      setIsBlocking(false);
    },
  });

  const handleSubmit = (data: TetelFormData) => {
    setError(null);
    mutation.mutate(data);
  };

  return (
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
          onSubmit={handleSubmit}
          isPending={mutation.isPending}
          error={error}
          success={success}
          label="Új Tétel"
          submitLabel="Tétel Létrehozása"
        />
      </div>
    </Suspense>
  );
};

export default TetelCreate;
