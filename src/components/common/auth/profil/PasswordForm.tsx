import { z } from "zod";
import FormContainer from "../../Forms/FormContainer";
import InputField from "../../Forms/InputField";
import SubmitButton from "../../Forms/SubmitButton";

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Kötelező mező"),
    newPassword: z
      .string()
      .min(6, "A jelszónak legalább 6 karakter hosszúnak kell lennie"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "A jelszavak nem egyeznek",
    path: ["confirmPassword"],
  });

interface PasswordFormProps {
  onSubmit: (e: React.FormEvent) => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
  successMessage: string | null;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  setCurrentPassword: (value: string) => void;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
}

const PasswordForm = ({
  onSubmit,
  errors,
  isSubmitting,
  successMessage,
  currentPassword,
  newPassword,
  confirmPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
}: PasswordFormProps) => (
  <FormContainer
    error={errors.general || null}
    success={successMessage}
    label="Jelszó módosítása"
  >
    <form onSubmit={onSubmit} className="space-y-6 max-h-[90dvh]">
      <InputField
        label="Jelenlegi jelszó"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        error={errors.currentPassword}
        enablePasswordToggle
      />
      <InputField
        label="Új jelszó"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        error={errors.newPassword}
        enablePasswordToggle
      />
      <InputField
        label="Jelszó megerősítése"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
        enablePasswordToggle
      />
      <SubmitButton
        isPending={isSubmitting}
        label={isSubmitting ? "Feldolgozás..." : "Jelszó mentése"}
      />
    </form>
  </FormContainer>
);

export default PasswordForm;
