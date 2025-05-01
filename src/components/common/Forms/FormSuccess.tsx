import { FaCheckCircle } from "react-icons/fa";

interface FormSuccessProps {
  message: string;
}

const FormSuccess: React.FC<FormSuccessProps> = ({ message }) => (
  <div className="mb-4 p-3 bg-green-500/10 border border-green-500 text-green-500 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
    <FaCheckCircle />
    {message}
  </div>
);

export default FormSuccess;
