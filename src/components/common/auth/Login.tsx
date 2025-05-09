import React, { Suspense, useState } from "react";
import { z } from "zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
const FormContainer = React.lazy(() => import("../Forms/FormContainer"));
const InputField = React.lazy(() => import("../Forms/InputField"));
const SubmitButton = React.lazy(() => import("../Forms/SubmitButton"));

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
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

  return (
    <Suspense>
      <div>
        <div className="max-w-2xl mx-auto items-center h-screen pb-50 pt-35 justify-center overflow-hidden">
          <FormContainer error={null} success={null} label="Bejelentkezés">
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Felhasználónév"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setTouched({ ...touched, username: true });
                }}
                error={touched.username ? fieldErrors.username : undefined}
              />

              <InputField
                label="Jelszó"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setTouched({ ...touched, password: true });
                }}
                enablePasswordToggle
                error={touched.password ? fieldErrors.password : undefined}
              />

              <SubmitButton isPending={isPending} label="Bejelentkezés" />
              <div className="text-left mt-2">
                <Link
                  to="/register"
                  className="text-md text-teal-400 hover:underline"
                >
                  Nincs fiókod? Regisztrálj
                </Link>
              </div>
            </form>
          </FormContainer>
        </div>
      </div>
    </Suspense>
  );
};

export default Login;
