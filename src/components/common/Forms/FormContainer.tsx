import { Suspense, type ReactNode } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import Navbar from "../../Navbar";
import FormError from "./FormError.tsx";
import FormSuccess from "./FormSuccess.tsx";
import Spinner from "@/components/Spinner.tsx";

interface FormContainerProps {
  children: ReactNode;
  error: string | null;
  success: string | null;
  label: string;
}

const FormContainer: React.FC<FormContainerProps> = ({
  children,
  error,
  success,
  label,
}) => {
  return (
    <Suspense fallback={<Spinner />}>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="max-w-3xl mx-auto p-6 mt-16">
          <h2 className="text-3xl font-bold text-gray-100 mb-6 flex items-center gap-2 animate-in fade-in duration-500">
            <FaQuestionCircle />
            {label}
          </h2>
          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}
          {children}
        </div>
      </div>
    </Suspense>
  );
};

export default FormContainer;
