import React, { useState } from "react";
import { z } from "zod";
import FormContainer from "../Forms/FormContainer";
import InputField from "../Forms/InputField";
import SubmitButton from "../Forms/SubmitButton";
import { useNavigate } from "@tanstack/react-router";
import { register } from "../../../api/repo";
import { toast } from "react-toastify";
const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const registerSchema = z
    .object({
      username: z.string().min(3, "Legalább 3 karakter"),
      password: z.string().min(6, "Legalább 6 karakter"),
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
    setTouched({ username: true, password: true, confirmPassword: true });

    const validation = registerSchema.safeParse({
      username,
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
      await register(username, password);
      setSuccess("Sikeres Regiszráció!");
      toast.success("Sikeres regisztráció!");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setFieldErrors({});
      setTouched({});
      navigate({ to: "/login" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      toast.error("Nems sikerült a regisztráció!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto items-center h-screen py-50 justify-center overflow-hidden">
        <FormContainer error={error} success={success} label="Register">
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setTouched({ ...touched, username: true });
              }}
              error={touched.username ? fieldErrors.username : undefined}
            />

            <InputField
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setTouched({ ...touched, password: true });
              }}
              enablePasswordToggle
              error={touched.password ? fieldErrors.password : undefined}
            />

            <InputField
              label="Confirm Password"
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
    </div>
  );
};

export default Register;
