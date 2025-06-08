import React, { Suspense, useState } from "react";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { register } from "../../../api/repo";
import { toast } from "react-toastify";
import OfflinePlaceholder from "../../OfflinePlaceholder";
import { useOnlineStatus } from "../../../hooks/useOnlineStatus";
import PageTransition from "../PageTransition";
const FormContainer = React.lazy(() => import("../Forms/FormContainer"));
const InputField = React.lazy(() => import("../Forms/InputField"));
const SubmitButton = React.lazy(() => import("../Forms/SubmitButton"));

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const isOnline = useOnlineStatus();

  const registerSchema = z
    .object({
      username: z
        .string()
        .min(3, "Legalább 3 karakter")
        .max(32, "Legfeljebb 32 karakter")
        .regex(
          /^[a-zA-Z0-9_]+$/,
          "Csak betűk, számok és aláhúzás (_) megengedett"
        ),
      email: z
        .string()
        .min(5, "Legalább 5 karakter")
        .max(254, "Túl hosszú email cím")
        .email("Érvényes email cím szükséges"),
      password: z
        .string()
        .min(8, "Legalább 8 karakter")
        .max(30, "Túl hosszú jelszó")
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
          setError(err.response.data.error || "Registration failed");
          toast.error(
            err.response.data.error || "Nems sikerült a regisztráció!"
          );
        }
      } else {
        setError(err instanceof Error ? err.message : "Registration failed");
        toast.error("Nems sikerült a regisztráció!");
      }
    } finally {
      setIsPending(false);
    }
  };

  if (!isOnline) {
    return <OfflinePlaceholder />;
  }

  return (
    <Suspense>
      <PageTransition>
        <div className="max-w-2xl mx-auto items-center h-screen pb-55 pt-30 justify-center overflow-hidden">
          <FormContainer error={error} success={success} label="Register">
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                id="username"
                label="Felhasználónév"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setTouched({ ...touched, username: true });
                }}
                error={touched.username ? fieldErrors.username : undefined}
              />

              <InputField
                id="email"
                label="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setTouched({ ...touched, email: true });
                }}
                error={touched.email ? fieldErrors.email : undefined}
              />

              <InputField
                id="password"
                label="Jelszó"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setTouched({ ...touched, password: true });
                }}
                enablePasswordToggle
                error={touched.password ? fieldErrors.password : undefined}
              />

              <InputField
                id="confirm-password"
                label="Jelszó megerősítése"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setTouched({ ...touched, confirmPassword: true });
                }}
                enablePasswordToggle
                error={
                  touched.confirmPassword
                    ? fieldErrors.confirmPassword
                    : undefined
                }
              />

              <SubmitButton isPending={isPending} label="Register" />
            </form>
          </FormContainer>
        </div>
      </PageTransition>
    </Suspense>
  );
};

export default Register;
