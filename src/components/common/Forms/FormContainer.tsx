import { Suspense, type ReactNode } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import FormError from "./FormError.tsx";
import FormSuccess from "./FormSuccess.tsx";

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
    <Suspense>
      <div className="min-h-[50dvh] ">
        <div className="mx-auto p-6 mt-16">
          <h2 className="text-3xl font-bold text-forground mb-6 flex items-center gap-2 animate-in fade-in duration-500">
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
