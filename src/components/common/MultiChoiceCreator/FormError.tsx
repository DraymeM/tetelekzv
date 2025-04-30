import { FaExclamationCircle } from "react-icons/fa";

interface FormErrorProps {
  message: string;
}

const FormError: React.FC<FormErrorProps> = ({ message }) => (
  <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
    <FaExclamationCircle />
    {message}
  </div>
);

export default FormError;
