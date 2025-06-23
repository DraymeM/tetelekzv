import React, { Suspense, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Switch } from "@headlessui/react";
import { toast } from "react-toastify";
import { createGroup } from "@/api/repo";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import OfflinePlaceholder from "@/components/OfflinePlaceholder";
import FormContainer from "@/components/common/Forms/FormContainer";
import Spinner from "@/components/Spinner";
import InputField from "@/components/common/Forms/InputField";
import SubmitButton from "@/components/common/Forms/SubmitButton";
import { groupSchema } from "@/validator/groupSchema";

const GroupCreate: React.FC = () => {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isBlocking, setIsBlocking] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();

  const mutation = useMutation({
    mutationFn: () => createGroup({ name, public: isPublic }),
    onMutate: () => {
      setIsBlocking(true);
    },
    onSuccess: () => {
      const message = "Sikeres mentés!";
      setSuccess(message);
      toast.success(message);
      queryClient.refetchQueries({ queryKey: ["groups"] });
      setTimeout(() => {
        navigate({ to: "/groups", replace: true });
        setIsBlocking(false);
        setSuccess(null);
      }, 1000);
    },
    onError: (e: any) => {
      const message = e.response?.data?.error || "Hiba";
      setError(message);
      toast.error(message);
      setIsBlocking(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const result = groupSchema.safeParse({ name, public: isPublic });
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || "Hibás adat";
      setError(firstError);
      toast.error(firstError);
      return;
    }

    mutation.mutate();
  };

  if (!isOnline) {
    return <OfflinePlaceholder />;
  }

  return (
    <Suspense>
      <div className="max-w-4xl mx-auto overflow-y-auto my-40 min-h-full ">
        <FormContainer label="Új Csoport" error={error} success={success}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {isBlocking && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ backgroundColor: "rgba(25, 25, 30, 0.3)" }}
              >
                <Spinner />
              </div>
            )}
            <InputField
              label="Csoport Neve"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-foreground">
                Nyilvános
              </label>
              <Switch
                checked={isPublic}
                onChange={setIsPublic}
                className={`${
                  isPublic ? "bg-primary" : "bg-muted"
                } relative inline-flex h-6 w-11 items-center hover:cursor-pointer rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary`}
              >
                <span
                  className={`${
                    isPublic ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
            </div>

            <SubmitButton
              isPending={mutation.isPending}
              label="Csoport Létrehozása"
            />
          </form>
        </FormContainer>
      </div>
    </Suspense>
  );
};

export default GroupCreate;
