import React, { Fragment, useState, Suspense } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { register } from "../../../api/repo";
import { toast } from "react-toastify";
import { useOnlineStatus } from "../../../hooks/useOnlineStatus";
import OfflinePlaceholder from "../../OfflinePlaceholder";
import PageTransition from "../PageTransition";
const FormContainer = React.lazy(() => import("../Forms/FormContainer"));
const InputField = React.lazy(() => import("../Forms/InputField"));
const SubmitButton = React.lazy(() => import("../Forms/SubmitButton"));

const Register: React.FC = () => {
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const [open] = useState(true); // Always open and blocking

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const registerSchema = z
    .object({
      username: z
        .string()
        .min(3, "Legalább 3 karakter")
        .max(32)
        .regex(
          /^[a-zA-Z0-9_]+$/,
          "Csak betűk, számok és aláhúzás (_) megengedett"
        ),
      email: z.string().min(5).max(254).email("Érvényes email cím szükséges"),
      password: z
        .string()
        .min(8)
        .max(30)
        .regex(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
          "A jelszónak tartalmaznia kell betűt és számot"
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Nem egyeznek a jelszavak!",
      path: ["confirmPassword"],
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsPending(true);
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const validation = registerSchema.safeParse({
      username,
      email,
      password,
      confirmPassword,
    });

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
      await register(username, email, password);
      setSuccess("Sikeres Regisztráció!");
      toast.success("Sikeres regisztráció!");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFieldErrors({});
      setTouched({});
      navigate({ to: "/login" });
    } catch (err: any) {
      if (err.response?.status === 409) {
        if (err.response.data.error.includes("Email")) {
          setFieldErrors((prev) => ({
            ...prev,
            email: "Az email cím már foglalt",
          }));
          toast.error("Az email cím már foglalt");
        } else if (err.response.data.error.includes("Username")) {
          setFieldErrors((prev) => ({
            ...prev,
            username: "A felhasználónév már foglalt",
          }));
          toast.error("A felhasználónév már foglalt");
        } else {
          toast.error(
            err.response.data.error || "Nem sikerült a regisztráció!"
          );
        }
      } else {
        toast.error("Nem sikerült a regisztráció!");
      }
    } finally {
      setIsPending(false);
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
                      error={error}
                      success={success}
                      label="Regisztráció"
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
                          id="email"
                          label="Email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setTouched((prev) => ({ ...prev, email: true }));
                          }}
                          error={touched.email ? fieldErrors.email : undefined}
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
                        <InputField
                          id="confirmPassword"
                          label="Jelszó megerősítése"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setTouched((prev) => ({
                              ...prev,
                              confirmPassword: true,
                            }));
                          }}
                          enablePasswordToggle
                          error={
                            touched.confirmPassword
                              ? fieldErrors.confirmPassword
                              : undefined
                          }
                        />
                        <SubmitButton
                          isPending={isPending}
                          label="Regisztráció"
                        />
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

export default Register;
