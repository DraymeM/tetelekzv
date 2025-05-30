import { Suspense } from "react";
import { FaCheckCircle } from "react-icons/fa";

interface SubmitButtonProps {
  isPending: boolean;
  label: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isPending, label }) => (
  <Suspense>
    <button
      id="submitbutton"
      type="submit"
      disabled={isPending}
      className="w-full p-3 bg-teal-700 text-white rounded-lg hover:cursor-pointer hover:bg-teal-800 disabled:bg-gray-500 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 animate-in fade-in duration-500"
    >
      <FaCheckCircle />
      {label}
    </button>
  </Suspense>
);

export default SubmitButton;
