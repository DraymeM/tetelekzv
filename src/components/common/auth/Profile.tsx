import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import Navbar from "../../Navbar";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { z } from "zod";
import { updatePassword } from "@/api/repo";
import FormContainer from "../Forms/FormContainer";
import InputField from "../Forms/InputField";
import SubmitButton from "../Forms/SubmitButton";

const Profile: React.FC = () => {
  const { logout, userId } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Kötelező mező"),
    newPassword: z.string().min(6, "A jelszónak legalább 6 karakter hosszúnak kell lennie"),
    confirmPassword: z.string()
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "A jelszavak nem egyeznek",
    path: ["confirmPassword"]
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sikeres kijelentkezés!");
      navigate({ to: "/login" });
    } catch (error) {
      toast.error("Hiba történt a kijelentkezés során");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    
    const validation = passwordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword
    });

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach(issue => {
        errors[issue.path[0]] = issue.message;
      });
      setErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword, confirmPassword);
      setSuccessMessage("Jelszó sikeresen frissítve!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.error || "Hiba történt a jelszó frissítésekor"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <Navbar />
      
      <div className="flex items-center max-w-screen mt-20 w-full justify-center min-h-screen overflow-hidden px-4 sm:px-6 lg:px-8 py-12">
        <Tab.Group as="div" className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar Navigation */}
          <Tab.List className="space-y-1 lg:col-span-3">
            <Tab
              className={({ selected }) =>
                `w-full px-4 py-3 text-left rounded-lg transition-colors ${
                  selected 
                    ? 'bg-gray-800 text-blue-400'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              Jelszó módosítása
            </Tab>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left rounded-lg text-gray-300 hover:bg-gray-800 hover:text-red-400 hover:cursor-pointer transition-colors"
            >
              Kijelentkezés
            </button>
          </Tab.List>

          {/* Content Panel */}
          <Tab.Panels className="mt-8 lg:mt-0 lg:col-span-9">
            <Tab.Panel>
              <FormContainer 
                error={errors.general || null} 
                success={successMessage} 
                label="Jelszó módosítása"
              >
                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                  <InputField
                    label="Jelenlegi jelszó"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    error={errors.currentPassword}
                    enablePasswordToggle={true}
                  />

                  <InputField
                    label="Új jelszó"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={errors.newPassword}
                    enablePasswordToggle={true}
                  />

                  <InputField
                    label="Jelszó megerősítése"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errors.confirmPassword}
                    enablePasswordToggle={true}
                  />

                  <SubmitButton 
                    isPending={isSubmitting} 
                    label={isSubmitting ? 'Feldolgozás...' : 'Jelszó mentése'}
                  />
                </form>
              </FormContainer>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Profile;