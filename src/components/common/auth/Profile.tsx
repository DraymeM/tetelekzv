import React, { Suspense, useState } from "react";
import { Tab } from "@headlessui/react";
import Navbar from "../../Navbar";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { updatePassword } from "@/api/repo";
import { FaArrowAltCircleRight } from "react-icons/fa";
import PasswordForm, { passwordSchema } from "./profil/PasswordForm";

const Sidebar = React.lazy(() => import("./profil/Sidebar"));
const UserInfo = React.lazy(() => import("./profil/UserInfo"));

const Profile: React.FC = () => {
  const { logout, isAuthenticated, isSuperUser, username } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Password state and handlers
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sikeres kijelentkezés!");
      navigate({ to: "/login" });
    } catch {
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
      confirmPassword,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
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
        general:
          error.response?.data?.error || "Hiba történt a jelszó frissítésekor",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <Suspense>
        <div className="lg:hidden p-4 flex justify-between items-center mt-15 z-50 overflow-hidden">
          <button
            className="p-2 border-border rounded-md focus:outline-none"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <FaArrowAltCircleRight size={36} />
          </button>
        </div>

        <Tab.Group>
          <div className="flex mt-4 relative">
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 p-8 ml-0 lg:mr-64 lg:ml-64">
              <Tab.Panels>
                <Tab.Panel>
                  <UserInfo
                    username={username || ""}
                    isSuperUser={isSuperUser}
                    isAuthenticated={isAuthenticated}
                    onLogout={handleLogout}
                  />
                </Tab.Panel>

                <Tab.Panel>
                  <PasswordForm
                    onSubmit={handlePasswordSubmit}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    successMessage={successMessage}
                    currentPassword={currentPassword}
                    newPassword={newPassword}
                    confirmPassword={confirmPassword}
                    setCurrentPassword={setCurrentPassword}
                    setNewPassword={setNewPassword}
                    setConfirmPassword={setConfirmPassword}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </div>
          </div>
        </Tab.Group>
      </Suspense>
    </>
  );
};

export default Profile;
