import { FaCheckCircle } from "react-icons/fa";

interface SubmitButtonProps {
  isPending: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isPending }) => (
  <button
    type="submit"
    disabled={isPending}
    className="w-full p-3 bg-blue-500 text-white rounded-lg hover:cursor-pointer hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 animate-in fade-in duration-500"
  >
    <FaCheckCircle />
    Kérdés Létrehozása
  </button>
);

export default SubmitButton;
