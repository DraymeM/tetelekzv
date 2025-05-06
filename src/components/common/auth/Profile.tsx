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
import { FiX, FiUser, FiLogOut } from "react-icons/fi";
import { FaArrowAltCircleRight } from "react-icons/fa";

const Profile: React.FC = () => {
  const { logout, isAuthenticated, isSuperUser, username } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const passwordSchema = z
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
      {/* Mobile Hamburger Menu Toggle */}
      <div className="lg:hidden p-4 flex justify-between items-center mt-15 z-50 overflow-hidden">
        <button
          className=" p-2 border-border rounded-md focus:outline-none"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open menu"
        >
          <FaArrowAltCircleRight size={36} />
        </button>
      </div>

      <Tab.Group>
        <div className="flex mt-4 relative">
          {/* Sidebar */}
          <div
            className={`w-64 p-6 space-y-4 bg-secondary transition-all duration-300 transform lg:h-[110dvh] mt-13 h-full fixed z-40 top-0 lg:relative ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0`}
          >
            {/* Mobile Close Button Inside Sidebar */}
            <div className="lg:hidden flex justify-end mb-4">
              <button
                className="text-foreground bg-muted p-1 rounded"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close menu"
              >
                <FiX size={24} style={{ strokeWidth: 3 }} />
              </button>
            </div>

            <Tab.List className="space-y-4">
              <Tab
                className={({ selected }) =>
                  `block w-full px-4 py-4 text-xl font-medium text-center transition-colors rounded  hover:cursor-pointer ${
                    selected
                      ? "bg-secondary text-primary font-bold "
                      : "text-secondary-foreground hover:bg-muted"
                  }`
                }
              >
                Rólam
              </Tab>
              <Tab
                className={({ selected }) =>
                  `block w-full px-4 py-4 text-xl font-medium transition-colors rounded text-center hover:cursor-pointer ${
                    selected
                      ? "bg-secondary text-primary font-bold "
                      : "text-secondary-foreground hover:bg-muted"
                  }`
                }
              >
                Jelszó módosítása
              </Tab>
            </Tab.List>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 ml-0 lg:mr-64 lg:ml-64">
            <Tab.Panels>
              <Tab.Panel>
                <div className="flex flex-col justify-center items-center h-full min-h-[60vh] p-8 ml-0 ">
                  <div className="flex items-center space-x-6 p-6 rounded-2xl shadow-xl mb-6">
                    {" "}
                    {/* Added mb-6 for spacing */}
                    <FiUser
                      size={100}
                      className="text-foreground bg-secondary p-2 rounded-full"
                    />
                    <div>
                      <p className="text-4xl font-bold mb-5 text-center justify-center">
                        {isAuthenticated
                          ? `${username}`
                          : "Nincs felhasználói név"}
                      </p>
                      <span
                        className={`inline-block mt-2 px-3 py-1 text-lg font-semibold rounded-full text-white ${
                          isSuperUser ? "bg-red-500" : "bg-teal-500"
                        }`}
                      >
                        {isSuperUser ? "Szuperfelhasználó" : "Felhasználó"}
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-auto px-4 py-2 text-xl text-white font-bold hover:bg-red-800 hover:cursor-pointer bg-red-700 rounded transition-colors flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <FiLogOut size={20} />
                    Kijelentkezés
                  </button>
                </div>
              </Tab.Panel>
            </Tab.Panels>
            {/* Password Tab */}
            <Tab.Panel>
              <FormContainer
                error={errors.general || null}
                success={successMessage}
                label="Jelszó módosítása"
              >
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
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
            </Tab.Panel>
          </div>
        </div>
      </Tab.Group>
    </>
  );
};

export default Profile;
