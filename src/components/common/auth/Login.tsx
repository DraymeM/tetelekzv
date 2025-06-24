import React, { Fragment, Suspense, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { z } from "zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import OfflinePlaceholder from "../../OfflinePlaceholder";
import { useOnlineStatus } from "../../../hooks/useOnlineStatus";
import PageTransition from "../PageTransition";

const FormContainer = React.lazy(() => import("../Forms/FormContainer"));
const InputField = React.lazy(() => import("../Forms/InputField"));
const SubmitButton = React.lazy(() => import("../Forms/SubmitButton"));

const Login: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [open] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const loginSchema = z.object({
    username: z.string().min(1, "Kötelező mező"),
    password: z.string().min(1, "Kötelező mező"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setTouched({ username: true, password: true });

    const validation = loginSchema.safeParse({ username, password });

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        errors[issue.path[0]] = issue.message;
      });
      setFieldErrors(errors);
      setIsPending(false);
      return;
    }

    try {
      await login(username, password);
      toast.success("Sikeres bejelentkezés!");
      navigate({ to: "/" });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Bejelentkezési hiba";
      const displayMessage =
        errorMessage === "Invalid credentials"
          ? "Hibás felhasználónév vagy jelszó"
          : errorMessage;
      toast.error(displayMessage);
    } finally {
      setIsPending(false);
      setPassword("");
      setFieldErrors({});
      setTouched({});
    }
  };

  if (!isOnline) return <OfflinePlaceholder />;

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        {/* BACKDROP */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-40"
          leave="ease-in duration-200"
          leaveFrom="opacity-40"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-background" />
        </Transition.Child>

        {/* CENTERED PANEL */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl text-left align-middle transition-all">
                <Suspense>
                  <PageTransition>
                    <FormContainer
                      error={null}
                      success={null}
                      label="Bejelentkezés"
                    >
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField
                          id="username"
                          label="Felhasználónév"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            setTouched((prev) => ({ ...prev, username: true }));
                          }}
                          error={
                            touched.username ? fieldErrors.username : undefined
                          }
                        />

                        <InputField
                          id="password"
                          label="Jelszó"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setTouched((prev) => ({ ...prev, password: true }));
                          }}
                          enablePasswordToggle
                          error={
                            touched.password ? fieldErrors.password : undefined
                          }
                        />

                        <SubmitButton
                          isPending={isPending}
                          label="Bejelentkezés"
                        />

                        <div className="text-left mt-2">
                          <Link
                            to="/register"
                            className="text-md text-primary hover:underline"
                          >
                            Nincs fiókod? Regisztrálj
                          </Link>
                        </div>
                      </form>
                    </FormContainer>
                  </PageTransition>
                </Suspense>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Login;
