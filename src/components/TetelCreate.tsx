import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import TetelForm from "./common/Forms/TetelForm";
import type { TetelFormData } from "../api/types";
import { createTetel } from "../api/repo";

const TetelCreate: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: TetelFormData) => createTetel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tetelek"] });
      setSuccess("Sikeres mentés!");
      setTimeout(() => {
        setSuccess(null);
        navigate({ to: "/tetelek" });
      }, 3000);
    },
    onError: (e: any) => setError(e.response?.data?.error || "Hiba"),
  });

  const handleSubmit = (data: TetelFormData) => {
    setError(null);
    mutation.mutate(data);
  };

  return (
    <TetelForm
      onSubmit={handleSubmit}
      isPending={mutation.isPending}
      error={error}
      success={success}
      label="Új Tétel"
      submitLabel="Tétel Létrehozása"
    />
  );
};

export default TetelCreate;
